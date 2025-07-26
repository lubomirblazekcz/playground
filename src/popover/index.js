import { anchorIsSupported } from '../utils.js'

/**
 * @param {HTMLElement | Element} referenceElement
 * @param {HTMLElement | Element} floatingElement
 * @param {import("./").ShowPopoverOptions} options
 * @returns Promise<void>
 */
export const computePositionPopover = async (referenceElement, floatingElement, options = {}) => {
  const { computePosition, flip } = await import('@floating-ui/dom')

  floatingElement.classList.remove(floatingElement.$placement)
  floatingElement.style.setProperty('--anchor-size', !anchorIsSupported ? `${referenceElement.offsetWidth}px` : '')

  const { x, y, placement } = await computePosition(referenceElement, floatingElement, {
    middleware: options === true ? [flip()] : [],
    placement: floatingElement.dataset.placement,
    ...options,
  })

  floatingElement.style.inset = !anchorIsSupported && `${y}px auto auto ${x}px`
  floatingElement.classList.add(placement)
  floatingElement.$placement = placement
}

/**
 * @param {HTMLElement | Element} referenceElement
 * @param {HTMLElement | Element} floatingElement
 * @param {import("./").ShowPopoverOptions} options
 * @returns Promise<void>
 */
export const autoUpdatePopover = async (referenceElement, floatingElement, options) => {
  const { autoUpdate } = await import('@floating-ui/dom')

  floatingElement.$cleanup = autoUpdate(referenceElement, floatingElement, () =>
    computePositionPopover(referenceElement, floatingElement, options),
  )
}
