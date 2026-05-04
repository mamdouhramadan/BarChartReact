import { createTheme } from '@mui/material/styles';
import type { SupportedLocale } from '../i18n/constants';

export function createAppTheme(direction: 'ltr' | 'rtl' = 'ltr', lang: SupportedLocale | string = 'en') {
  const isArabic = lang === 'ar';
  const bodySans = isArabic
    ? '"Almarai", "IBM Plex Sans", system-ui, sans-serif'
    : '"IBM Plex Sans", "Helvetica", "Arial", sans-serif';
  const displaySerif = isArabic
    ? '"Almarai", "IBM Plex Serif", Georgia, serif'
    : '"IBM Plex Serif", Georgia, serif';

  return createTheme({
    direction,
    palette: {
      primary: {
        main: '#a16207'
      },
      secondary: {
        main: '#334155'
      },
      background: {
        default: '#f8f4e8',
        paper: '#fffdf9'
      },
      text: {
        primary: '#172033',
        secondary: '#5f6675'
      }
    },
    shape: {
      borderRadius: 18
    },
    typography: {
      fontFamily: bodySans,
      h3: {
        fontFamily: displaySerif,
        fontWeight: 700,
        lineHeight: 1.08,
        letterSpacing: '-0.04em'
      },
      h5: {
        fontWeight: 700
      },
      h6: {
        fontWeight: 700
      },
      overline: {
        fontWeight: 700,
        fontFamily: bodySans
      },
      body1: {
        lineHeight: 1.7
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            textTransform: 'none',
            fontWeight: 700
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0 20px 50px rgba(23, 32, 51, 0.08)'
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.72)'
          }
        }
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 52
          }
        }
      }
    }
  });
}
