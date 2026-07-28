import type { Variants, Transition } from 'framer-motion';

/* ── Transition Presets ── */

/** Smooth, intentional easing — Apple-style */
export const transition: Record<string, Transition> = {
  default: {
    duration: 0.2,
    ease: [0.25, 0.1, 0.25, 1],
  },
  slow: {
    duration: 0.35,
    ease: [0.25, 0.1, 0.25, 1],
  },
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  bounce: {
    type: 'spring',
    stiffness: 400,
    damping: 20,
  },
  easeOut: {
    duration: 0.25,
    ease: [0.19, 1, 0.22, 1],
  },
};

/* ── Fade Variants ── */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.default },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/* ── Slide Variants ── */

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: transition.default },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: transition.default },
  exit: { opacity: 0, y: 8, transition: { duration: 0.15 } },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: transition.default },
  exit: { opacity: 0, x: -8, transition: { duration: 0.15 } },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: transition.default },
  exit: { opacity: 0, x: 8, transition: { duration: 0.15 } },
};

/* ── Scale Variants ── */

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: transition.default },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export const scaleInSubtle: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: transition.slow },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.15 } },
};

/* ── Stagger Children ── */

/**
 * Parent container variant — animate children with stagger.
 * Usage: <motion.div variants={staggerContainer} initial="hidden" animate="visible">
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
      ...transition.default,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

/**
 * Child item variant for use inside staggerContainer.
 * Usage: <motion.div variants={staggerItem}>
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition.default,
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.1 },
  },
};

/**
 * Create a staggered list with a given delay per child.
 *
 * Usage:
 *   <motion.div variants={staggeredList(0.08)} initial="hidden" animate="visible">
 *     {items.map((item) => (
 *       <motion.div key={item.id} variants={staggerItem}>...</motion.div>
 *     ))}
 *   </motion.div>
 */
export function staggeredList(staggerDelay = 0.06): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05,
        ...transition.default,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15 },
    },
  };
}

/* ── Page Transition ── */

/** Full page enter/exit transition */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

/* ── Slide-in variants by direction (for modals, drawers, etc.) ── */

export const slideInFrom = {
  top: {
    hidden: { opacity: 0, y: '-100%' },
    visible: { opacity: 1, y: '0%', transition: transition.spring },
    exit: { opacity: 0, y: '-100%', transition: { duration: 0.2 } },
  } satisfies Variants,

  bottom: {
    hidden: { opacity: 0, y: '100%' },
    visible: { opacity: 1, y: '0%', transition: transition.spring },
    exit: { opacity: 0, y: '100%', transition: { duration: 0.2 } },
  } satisfies Variants,

  left: {
    hidden: { opacity: 0, x: '-100%' },
    visible: { opacity: 1, x: '0%', transition: transition.spring },
    exit: { opacity: 0, x: '-100%', transition: { duration: 0.2 } },
  } satisfies Variants,

  right: {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: '0%', transition: transition.spring },
    exit: { opacity: 0, x: '100%', transition: { duration: 0.2 } },
  } satisfies Variants,
};
