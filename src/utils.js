export const supportsCommand = 'command' in HTMLButtonElement.prototype
  && 'source' in ((globalThis.CommandEvent || {}).prototype || {})

export const supportsInterest = Object.prototype.hasOwnProperty.call(HTMLButtonElement.prototype,
  'interestForElement',
)

export const supportsAnchor = CSS.supports('anchor-name', '--')

export const supportsIs = (name = 'is-supports') => {
  class Element extends HTMLBRElement {}
  customElements.define(name, Element, { extends: 'br' })

  return document.createElement('br', { is: name }) instanceof Element
}

export const superConnect = (element) => {
  element.addEventListener('command', (e) => {
    e.preventDefault()

    const method = e.command
      .replace(/^--/, '')
      .replace(/(-\w)/g, c => c[1].toUpperCase())

    if (method in element) element[method](e)
  })
}

export class DefaultElement extends HTMLElement {
  constructor() {
    super()

    superConnect(this)
  }
}
