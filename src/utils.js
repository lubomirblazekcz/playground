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

const typecast = (value) => {
  try {
    return JSON.parse(value)
  }
  catch {
    return value
  }
}

const partSelector = (name, selector, nodeName) => (
  `[data-${nodeName}-part="${selector?.length > 0 ? selector : name.slice(1)}"]`
)

const querySelector = (host, selector) =>
  [...host.querySelectorAll(selector)].filter(
    node => node.closest(host.nodeName) === host,
  )

const defineCommand = (host, replacer = c => c[1].toUpperCase()) => {
  host.addEventListener('command', (e) => {
    e.preventDefault()

    e.source.$value = typecast(e.source?.value)

    const method = e.command
      .replace(/^--/, '')
      .replace(/(-\w)/g, replacer)

    if (method in host) host[method](e)
  })
}

const defineParts = (parts, host) => {
  for (let [name, selector] of Object.entries(parts)) {
    const isArray = Array.isArray(selector)

    selector = partSelector(name, isArray ? selector[0] : selector, host.nodeName)

    Object.defineProperty(host, name, {
      get: () => {
        const queryPart = querySelector(host, selector)

        return isArray ? queryPart : queryPart[0] || null
      },
    })
  }
}

const defineValues = (values, host) => {
  for (let [name, value] of Object.entries(values)) {
    Object.defineProperty(host, name, {
      get: () => {
        const attribute = host.dataset[name.slice(1)]

        return attribute ? typecast(attribute) : value
      },
      set: (value) => {
        host.dataset[name.slice(1)] = value
      },
    })
  }
}

export const initializeController = (host) => {
  const parts = host.constructor.parts
  const values = host.constructor.values

  defineCommand(host)

  if (parts) {
    defineParts(parts, host)
  }

  if (values) {
    defineValues(values, host)
  }
}

export class WebuumElement extends HTMLElement {
  constructor() {
    super()

    initializeController(this)
  }
}
