import { anchorIsSupported, commandIsSupported, DefaultElement } from './utils.js'

if (!commandIsSupported) {
  const { apply } = await import('invokers-polyfill/fn')

  apply()
}

customElements.define('x-popover', class extends DefaultElement {
  $open = false

  connectedCallback() {
    this.addEventListener('toggle', (event) => {
      this.$open = event.newState === 'open'
    })
  }

  async showPopover({ source }) {
    const autoUpdate = 'autoUpdate' in this.dataset

    if (autoUpdate || !anchorIsSupported) {
      const { autoUpdatePopover } = await import('./popover/index.js')

      await autoUpdatePopover(source, this, autoUpdate && JSON.parse(this.dataset.autoUpdate))
    }

    super.showPopover({ source })
  }

  togglePopover({ source }) {
    !this.$open
      ? this.showPopover({ source })
      : this.hidePopover()
  }

  hidePopover() {
    this.$cleanup?.()

    super.hidePopover()
  }
})
