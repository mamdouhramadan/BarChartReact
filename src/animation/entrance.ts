import { keyframes } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeUpTight = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export interface EntranceOpts {
  delayStep?: number;
  baseDelay?: number;
  duration?: number;
  tight?: boolean;
}

/** CSS-only entrance (no extra animation libs). */
export function entranceSx(
  index: number,
  prefersReducedMotion: boolean,
  opts: EntranceOpts = {}
): SxProps<Theme> {
  const { delayStep = 0.07, baseDelay = 0.04, duration = 0.4, tight = false } = opts;
  if (prefersReducedMotion) {
    return {};
  }
  const delay = baseDelay + index * delayStep;
  const name = tight ? fadeUpTight : fadeUp;
  const dur = tight ? Math.min(duration, 0.34) : duration;
  return {
    opacity: 0,
    animation: `${name} ${dur}s ${easeOut} ${delay}s both`
  };
}
