export const linear = t => t

export const easeInQuad = t => t * t
export const easeOutQuad = t => t * (2 - t)
export const easeInOutQuad = t => t < 0.5
  ? 2 * t * t
  : -1 + (4 - 2 * t) * t

export const easeInCubic = t => t ** 3
export const easeOutCubic = t => 1 + (t - 1) ** 3
export const easeInOutCubic = t => t < 0.5
  ? 4 * t ** 3
  : 1 + (t - 1) * (2 * t - 2) ** 2

export const easeInQuart = t => t ** 4
export const easeOutQuart = t => 1 - (t - 1) ** 4
export const easeInOutQuart = t => t < 0.5
  ? 8 * t ** 4
  : 1 - 8 * (t - 1) ** 4

export const easeInQuint = t => t ** 5
export const easeOutQuint = t => 1 + (t - 1) ** 5
export const easeInOutQuint = t => t < 0.5
  ? 16 * t ** 5
  : 1 + 16 * (t - 1) ** 5

export const easeInCirc = t => -1 * Math.sqrt(1 - t ** 2) + 1
export const easeOutCirc = t => Math.sqrt(-1 * (t - 2) * t)
export const easeInOutCirc = t => t < 0.5
  ? 0.5 * (1 - Math.sqrt(1 - 4 * t * t))
  : 0.5 * (1 + Math.sqrt(-3 + 8 * t - 4 * t * t))

export const overshoot = t => -1 * (Math.E ** (-6.3 * t)) * (Math.cos(5 * t)) + 1

/* -- Material Design curves -- */

/**
 * Faster ease in, slower ease out
 */
export const standard = t => t < 0.4031
  ? 12 * t ** 4
  : 1 / 1290 * (11 * Math.sqrt(-40000 * t * t + 80000 * t - 23359) - 129)

export const decelerate = easeOutCubic
export const accelerate = easeInCubic
export const sharp = easeInOutQuad
