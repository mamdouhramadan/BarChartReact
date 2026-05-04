import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import WifiOffRoundedIcon from '@mui/icons-material/WifiOffRounded';
import { useTranslation } from 'react-i18next';

type NetworkBlockedPageProps = {
  onRetry: () => void;
  retrying?: boolean;
};

export default function NetworkBlockedPage({ onRetry, retrying }: NetworkBlockedPageProps) {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, sm: 3 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(252,248,240,0.96) 100%)',
          textAlign: 'center'
        }}
      >
        <Stack spacing={2.5} alignItems="center">
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
              color: 'warning.dark'
            }}
          >
            <WifiOffRoundedIcon sx={{ fontSize: 40 }} aria-hidden />
          </Box>
          <Typography variant="h5" component="h1">
            {t('networkIssue.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('networkIssue.body')}
          </Typography>
          <Box sx={{ textAlign: 'left', width: '100%', pl: { xs: 0, sm: 1 } }}>
            <Typography component="ul" variant="body2" color="text.secondary" sx={{ m: 0, pl: 2.5 }}>
              <li>{t('networkIssue.bulletFirewall')}</li>
              <li>{t('networkIssue.bulletVpn')}</li>
              <li>{t('networkIssue.bulletIt')}</li>
            </Typography>
          </Box>
          <Button variant="contained" size="large" onClick={onRetry} disabled={retrying} sx={{ mt: 1 }}>
            {retrying ? t('networkIssue.retrying') : t('networkIssue.retry')}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
