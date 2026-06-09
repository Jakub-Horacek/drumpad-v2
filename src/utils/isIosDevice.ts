/** iPhone, iPad, or iPadOS reporting as desktop Safari. */
export function isIosDevice(): boolean {
  if (typeof navigator === 'undefined') {
    return false
  }

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

/** True for Safari on iOS — the only iOS browser that can install PWAs to the home screen. */
export function isIosSafari(): boolean {
  if (!isIosDevice()) {
    return false
  }

  return !/CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent)
}
