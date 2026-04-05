import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Check from '@mui/icons-material/Check';
import TranslateOutlined from '@mui/icons-material/TranslateOutlined';
import { normalizeLocale } from '../i18n/constants';

const logoSrc = `${process.env.PUBLIC_URL || ''}/favicon.png`;

function AppNavbar() {
  const { t, i18n } = useTranslation();
  const currentLang = normalizeLocale(i18n.language);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const pickLanguage = (code) => {
    i18n.changeLanguage(code);
    handleClose();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'rgba(161, 98, 7, 0.28)',
        background: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(24,21,14,0.97) 100%)',
        backdropFilter: 'blur(14px)'
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Toolbar disableGutters sx={{ minHeight: { xs: 58, md: 68 }, gap: 2, py: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
            <Box
              component="img"
              src={logoSrc}
              alt={t('app.navBrand')}
              sx={{
                height: { xs: 36, md: 42 },
                width: { xs: 36, md: 42 },
                borderRadius: 1.25,
                flexShrink: 0,
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                border: '1px solid rgba(251,191,36,0.25)'
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ color: '#fffbeb', fontWeight: 800, lineHeight: 1.2, letterSpacing: 0.2 }}
              >
                {t('app.navBrand')}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(226,232,240,0.78)',
                  display: { xs: 'none', sm: 'block' },
                  lineHeight: 1.3
                }}
              >
                {t('app.preciousMetalsDesk')}
              </Typography>
            </Box>
          </Stack>

          <Tooltip title={t('language.label')}>
            <IconButton
              color="inherit"
              onClick={handleOpen}
              aria-label={t('language.label')}
              aria-controls={open ? 'language-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              size="medium"
              sx={{
                flexShrink: 0,
                color: '#fffbeb',
                border: '1px solid rgba(251,191,36,0.38)',
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.04)',
                '&:hover': {
                  bgcolor: 'rgba(251,191,36,0.12)',
                  borderColor: 'rgba(251,191,36,0.55)'
                }
              }}
            >
              <TranslateOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>

          <Menu
            id="language-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              elevation: 8,
              sx: {
                mt: 1,
                minWidth: 220,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'visible'
              }
            }}
            MenuListProps={{
              dense: true,
              sx: { py: 1 }
            }}
          >
            <MenuItem
              onClick={() => pickLanguage('en')}
              selected={currentLang === 'en'}
              sx={{ gap: 1, py: 1.25 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {currentLang === 'en' ? <Check fontSize="small" color="primary" /> : <Box sx={{ width: 18 }} />}
              </ListItemIcon>
              {t('language.en')}
            </MenuItem>
            <MenuItem
              onClick={() => pickLanguage('ar')}
              selected={currentLang === 'ar'}
              sx={{ gap: 1, py: 1.25 }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {currentLang === 'ar' ? <Check fontSize="small" color="primary" /> : <Box sx={{ width: 18 }} />}
              </ListItemIcon>
              {t('language.ar')}
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AppNavbar;
