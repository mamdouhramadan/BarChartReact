import Box from '@mui/material/Box';
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(180,134,11,0.12), transparent 32%), radial-gradient(circle at top right, rgba(30,41,59,0.12), transparent 28%), linear-gradient(180deg, #f8f4e8 0%, #f4f1ea 52%, #eef2f0 100%)'
      }}
    >
      {children}
    </Box>
  );
}
