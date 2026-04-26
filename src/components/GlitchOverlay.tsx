"use client";

/**
 * Constant glitch overlay layers — non-periodic, always-on subtle effects.
 * Heavy effects live inside BackgroundFX itself.
 */
export function GlitchOverlay() {
  return (
    <>
      <div aria-hidden className="dust-grain" />
      <div aria-hidden className="scanlines" />
    </>
  );
}
