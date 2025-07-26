export const commandIsSupported = 'command' in HTMLButtonElement.prototype
  && 'source' in ((globalThis.CommandEvent || {}).prototype || {})

export const anchorIsSupported = CSS.supports('anchor-name', '--')

export class DefaultElement extends HTMLElement {
  constructor() {
    super()

    this.addEventListener('command', (e) => {
      e.preventDefault()

      const method = e.command
        .replace(/^--/, '')
        .replace(/(-\w)/g, c => c[1].toUpperCase())

      if (method in this) this[method](e)
    })
  }
}
