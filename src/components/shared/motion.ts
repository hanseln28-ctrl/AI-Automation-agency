'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import React from 'react';

// Wrapper components that avoid JSX member expressions (motion.div)
// which can cause SWC parsing issues in Next.js.
// Use <MotionDiv> instead of <motion.div>, etc.

export const MotionDiv = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  (props, ref) => React.createElement(motion.div, { ...props, ref })
);
MotionDiv.displayName = 'MotionDiv';

export const MotionButton = React.forwardRef<HTMLButtonElement, HTMLMotionProps<'button'>>(
  (props, ref) => React.createElement(motion.button, { ...props, ref })
);
MotionButton.displayName = 'MotionButton';

export const MotionSpan = React.forwardRef<HTMLSpanElement, HTMLMotionProps<'span'>>(
  (props, ref) => React.createElement(motion.span, { ...props, ref })
);
MotionSpan.displayName = 'MotionSpan';

export const MotionTr = React.forwardRef<HTMLTableRowElement, HTMLMotionProps<'tr'>>(
  (props, ref) => React.createElement(motion.tr, { ...props, ref })
);
MotionTr.displayName = 'MotionTr';

export const MotionP = React.forwardRef<HTMLParagraphElement, HTMLMotionProps<'p'>>(
  (props, ref) => React.createElement(motion.p, { ...props, ref })
);
MotionP.displayName = 'MotionP';

export { AnimatePresence };
