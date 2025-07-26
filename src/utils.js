export const commandIsSupported = 'command' in HTMLButtonElement.prototype
  && 'source' in ((globalThis.CommandEvent || {}).prototype || {})

export const interestIsSupported = Object.prototype.hasOwnProperty.call(HTMLButtonElement.prototype,
  'interestForElement',
)

export const anchorIsSupported = CSS.supports('anchor-name', '--')

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
