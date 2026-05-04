import { keyframes } from '@mui/material/styles';

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

/**
 * CSS-only entrance (no extra animation libs). Works with CRA + React 17.
 * @param {number} index — order in the cascade (0-based)
 * @param {boolean} prefersReducedMotion
 * @param {{ delayStep?: number, baseDelay?: number, duration?: number, tight?: boolean }} [opts]
 */
export function entranceSx(index, prefersReducedMotion, opts = {}) {
  const {
    delayStep = 0.07,
    baseDelay = 0.04,
    duration = 0.4,
    tight = false
  } = opts;
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
