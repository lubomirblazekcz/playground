import {supportsScrollInitialTarget} from "../utils.js";

const nextRepaint = () => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve()
      })
    })
  })
}

/**
 * @param {'left' | 'right' | 'top' | 'bottom'} placement
 * @returns boolean
 */
export const isVerticalDrawer = (placement) => {
  return ['top', 'bottom'].includes(placement)
}

/**
 * @param {HTMLElement | Element} element
 * @param {'left' | 'right' | 'top' | 'bottom'} placement
 * @param {boolean} reverse
 * @param {'auto' | 'instant'} behavior
 * @returns void
 */
export const scrollDrawer = (element, placement, reverse = false, behavior = 'auto') => {
  const [direction, distance, closedDistance] = drawerProperties(element, placement)

  element.scroll({ [direction]: reverse ? closedDistance : distance, behavior })
}

/**
 * @param {HTMLElement | Element} element
 * @param {'left' | 'right' | 'top' | 'bottom'} placement
 * @returns void
 */
export const showDrawer = async (element, placement) => {
  if (!supportsScrollInitialTarget) {
    console.log(element, placement)
    scrollDrawer(element, placement, true, 'instant')
    await nextRepaint()
  }

  scrollDrawer(element, placement)
}

/**
 * @param {HTMLElement | Element} element
 * @param {'left' | 'right' | 'top' | 'bottom'} placement
 * @returns void
 */
export const closeDrawer = (element, placement) => {
  scrollDrawer(element, placement, true)
}


export const drawerEvents = (element, contentElement, placement, signal) => {
  element.addEventListener('cancel', (event) => {
    event.preventDefault()
    closeDrawer(element.firstElementChild, placement)
  }, { signal })

  element.addEventListener('click', ({ target }) => {
    if (!contentElement.contains(target) && !contentElement.isEqualNode(target))
      closeDrawer(element.firstElementChild, placement)
  }, { signal })

  // element.addEventListener('toggle', (event) => {
  //   if (element.open) {
  //     showDrawer(event.target.firstElementChild, placement)
  //   }
  // })
}

/**
 * @param {HTMLElement | Element} element
 * @param {'left' | 'right' | 'top' | 'bottom'} placement
 * @returns IntersectionObserver
 */
export const drawerObserver = (element, placement) => {
  const visibleThreshold = 1 / (
    isVerticalDrawer(placement) ? window.innerHeight : window.innerWidth
  )

  return new IntersectionObserver((entries) => {
      if (entries.at(-1).intersectionRatio < visibleThreshold) element.close()
    }, {
      root: element,
      threshold: [visibleThreshold, 1]
    }
  )
}

export const drawerProperties = (element, placement) => {
  const [openedDistance, closedDistance]  = {
    left: [0, element.offsetWidth],
    right: [element.offsetWidth, 0],
    top: [0, element.offsetHeight],
    bottom: [element.offsetHeight, 0],
  }[placement]

  return [isVerticalDrawer(placement) ? 'top' : 'left', openedDistance, closedDistance]
}