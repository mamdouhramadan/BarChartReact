import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './index.css';
import App from './App';

const theme = createTheme({
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
    fontFamily: '"IBM Plex Sans", "Helvetica", "Arial", sans-serif',
    h3: {
      fontFamily: '"IBM Plex Serif", Georgia, serif',
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
      fontWeight: 700
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

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <App />
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
