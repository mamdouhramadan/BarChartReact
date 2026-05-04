import useMediaQuery from '@mui/material/useMediaQuery';

export default function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)', { noSsr: true });
}
