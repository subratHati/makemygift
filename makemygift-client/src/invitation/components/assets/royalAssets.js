// Single source for the Royal template asset paths.
// Drop the 8 PNGs into  makemygift-client/public/royal/  so these resolve.
// Changing the folder later = change ROYAL_BASE only.
export const ROYAL_BASE = '/royal/';
export const A = (name) => `${ROYAL_BASE}${name}`;

export const ROYAL = {
  heroBg:      A('background-hero.png'),
  mainBg:      A('background-main.png'),
  couple:      A('couple.png'),
  lamp:        A('lamp.png'),
  topFloral:   A('top-floral.png'),
  bottomFloral:A('bottom-floral.png'),
  leftFloral:  A('left-floral.png'),
  rightFloral: A('right-floral.png'),
};
