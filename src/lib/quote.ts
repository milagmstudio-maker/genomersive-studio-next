/**
 * Stored quote shape — written by Services section, read by Contact form.
 */
export type QuoteSnapshot = {
  plans: Array<{
    id: string;
    name: string;
    category: string;
    units: number;
    subtotal: number;
    recurring?: "monthly";
  }>;
  addons: Array<{ id: string; name: string; price: number }>;
  delivery: { id: string; name: string; surcharge: number };
  discount: { id: string; name: string; description: string };
  total: number;
};

const KEY = "mila:quote";

export function saveQuote(q: QuoteSnapshot) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(q));
  } catch {
    /* ignore quota errors */
  }
}

export function loadQuote(): QuoteSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as QuoteSnapshot) : null;
  } catch {
    return null;
  }
}

export function clearQuote() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

export function formatJPY(n: number) {
  return `¥${n.toLocaleString("ja-JP")}`;
}
