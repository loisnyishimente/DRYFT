// src/utils/helpers.ts
export const colors = {
    primary: '#014D40',
    accent: '#00C16A',
    background: '#0b2f2a',
    light: '#e6f7f1',
    muted: '#94b7ac',
    text: '#212121',
    secondary: '#6C63FF',
  };
  
  export const genRideNumber = (): string =>
    'DRY-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  