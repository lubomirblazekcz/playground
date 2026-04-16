export const scrollBy = (element, { direction = 1, distance, position = 'left', ratio = 0.85 }) => {
  distance ??= element.clientWidth * ratio

  element.scrollBy({
    [position]: distance * direction
  })
}

export const toggleScrollState = (element, { prevElement, nextElement, scrollStart, scrollEnd, scrollNone }) => {
  scrollStart ??= element.scrollLeft <= 0
  scrollEnd ??= element.scrollLeft >= element.scrollWidth - element.clientWidth
  scrollNone ??= element.scrollWidth - element.clientWidth === 0

  if (prevElement && nextElement) {
    prevElement.disabled = scrollStart
    nextElement.disabled = scrollEnd
  }

  element.toggleAttribute('data-scroll-start', scrollStart)
  element.toggleAttribute('data-scroll-end', scrollEnd)
  element.toggleAttribute('data-scroll-none', scrollNone)
}

export const setActiveAttribute = (element, index, attributeName = 'data-current') => {
  [...element.children].forEach(el => el.removeAttribute(attributeName))
  element.children[index].setAttribute(attributeName, '')
}

export const scrollToMarker = (element, target, markerGroupElement) => {
  const index = [...markerGroupElement.children].indexOf(target)

  element._markerIndex = index;

  setActiveAttribute(markerGroupElement, index)

  ;[...element.children][index]?.scrollIntoView({
    inline: "start",
    block: "nearest"
  });

  return index
}

export const setSnappedElement = (element, target, markerGroupElement) => {
  const snappedIndex = [...element.children].indexOf(target)

  setActiveAttribute(element, snappedIndex, 'data-snapped')

  const index = element._markerIndex ? element._markerIndex : snappedIndex

  if (markerGroupElement) setActiveAttribute(markerGroupElement, index)

  element._markerIndex = null

  return index
}