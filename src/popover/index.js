import { anchorIsSupported } from '../utils.js'

/**
 * @param {HTMLElement | Element} referenceElement
 * @param {HTMLElement | Element} floatingElement
 * @param {import("@floating-ui/utils").Placement | string} placement
 * @param {import("@floating-ui/dom").ComputePositionConfig} options
 * @returns Promise<void>
 */
export const computePositionPopover = async (referenceElement, floatingElement, placement, options = {}) => {
  const { computePosition, flip } = await import('@floating-ui/dom')

  const middleware = options === true ? [flip()] : []

  floatingElement.classList.remove(floatingElement.$placement ?? placement)
  floatingElement.style.setProperty('--anchor-size', !anchorIsSupported ? `${referenceElement.offsetWidth}px` : '')

  await computePosition(referenceElement, floatingElement, {
    middleware,
    placement,
    ...options,
  }).then(({ x, y, placement, middlewareData }) => {
    floatingElement.style.inset = !anchorIsSupported && `${y}px auto auto ${x}px`
    floatingElement.classList.add(placement)
    floatingElement.$placement = placement
  })
}

/**
 * @param {HTMLElement | Element} referenceElement
 * @param {HTMLElement | Element} floatingElement
 * @param {import("@floating-ui/utils").Placement | string} [placement]
 * @param {import("@floating-ui/dom").ComputePositionConfig} [options={}]
 * @returns Promise<void>
 */
export const autoUpdatePopover = async (referenceElement, floatingElement, placement, options) => {
  const { autoUpdate } = await import('@floating-ui/dom')

  floatingElement.$cleanup = autoUpdate(referenceElement, floatingElement, () =>
    computePositionPopover(referenceElement, floatingElement, placement, options),
  )
}
