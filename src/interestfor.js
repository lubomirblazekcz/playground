export const interestForEvents = (source) => {
  const popover = window[source.getAttribute('interestfor')]

  source.addEventListener('mouseover', () => {
    popover.showPopover({ source })
  })

  source.addEventListener('mouseout', () => {
    popover.hidePopover()
  })

  source.addEventListener('focus', () => {
    popover.showPopover({ source })
  })

  source.addEventListener('blur', () => {
    popover.hidePopover()
  })
}

export const interestForInit = () => {
  document.querySelectorAll('[interestfor]')
    .forEach((element) => {
      interestForEvents(element)
    })
}
