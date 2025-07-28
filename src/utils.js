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

const partSelector = (name, selector, nodeName) => {
  const prefix = `data-${nodeName}-part`

  if (selector === '@') {
    return `[${prefix}='${name.slice(1)}']`
  }
  else {
    return selector.replace(/@([a-z-]+)/g, `[${prefix}='$1']`)
  }
}

export class DefaultElement extends HTMLElement {
  static parts
  static values

  constructor() {
    super()

    superConnect(this)

    const parts = this.constructor.parts
    const values = this.constructor.values

    if (parts) {
      for (let [name, selector] of Object.entries(parts)) {
        if (Array.isArray(selector)) {
          selector = partSelector(name, selector[0], this.nodeName)

          Object.defineProperty(this, name, {
            get: () =>
              Array.from(this.querySelectorAll(selector)).filter(
                node => node.closest(this.nodeName) === this,
              ),
          })
        }
        else {
          selector = partSelector(name, selector, this.nodeName)

          Object.defineProperty(this, name, {
            get: () => {
              const node = this.querySelector(selector)

              return node && (node.closest(this.nodeName) === this) ? node : null
            },
          })
        }
      }
    }

    if (values) {
      for (let [name, value] of Object.entries(values)) {
        Object.defineProperty(this, name, {
          get: () => {
            const attribute = this.getAttribute(`data-${this.nodeName}-${name.slice(1)}-value`)

            return attribute ? attribute : value
          },
        })
      }
    }
  }
}
