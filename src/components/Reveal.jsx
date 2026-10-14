import { forwardRef } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion'

const elements = { div: motion.div, h1: motion.h1, h2: motion.h2, p: motion.p, a: motion.a, article: motion.article, button: motion.button, span: motion.span }

/**
 * @typedef {Omit<import('react').HTMLAttributes<HTMLElement>, 'onLoad'> & {
 *   tag?: keyof typeof elements,
 *   delay?: number,
 *   distance?: number,
 *   scale?: number,
 *   direction?: 'up' | 'left' | 'right',
 *   onLoad?: boolean
 * }} RevealProps
 */

// Use the existing element as the motion surface, preserving flex/grid layout.
const Reveal = forwardRef(/** @param {RevealProps} props */ function Reveal({
  tag = 'div', delay = 0, distance = 40, scale = 1,
  direction = 'up', onLoad = false, children, ...props
}, ref) {
  const reducedMotion = useReducedMotion()
  const controls = useAnimationControls()
  const desktop = useMediaQuery('(min-width: 1024px)')
  const horizontal = desktop && direction !== 'up'
  const travel = desktop ? distance : Math.min(distance, 28)
  const Element = elements[tag] || motion.div
  const visible = { opacity: 1, x: 0, y: 0, scale: 1 }

  return (
    <Element
      {...props}
      ref={ref}
      data-reveal=""
      initial={reducedMotion ? false : {
        opacity: 0,
        x: horizontal ? (direction === 'left' ? -travel : travel) : 0,
        y: horizontal ? 0 : travel,
        scale,
      }}
      animate={onLoad || reducedMotion ? visible : controls}
      whileInView={visible}
      viewport={{ once: onLoad, amount: 0.2, margin: '0px 0px -64px 0px' }}
      transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      // Keyboard navigation should never leave a focused control invisible.
      onFocusCapture={(event) => {
        controls.set(visible)
        props.onFocusCapture?.(event)
      }}
    >
      {children}
    </Element>
  )
})

export default Reveal
