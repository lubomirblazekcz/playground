import {
  anchorIsSupported,
  commandIsSupported,
  DefaultElement,
  interestIsSupported,
} from './utils.js'

if (!commandIsSupported) {
  const { apply } = await import('invokers-polyfill/fn')

  apply()
}

if (!interestIsSupported && document.querySelector('[interestfor]')) {
  const { apply } = await import('./interestfor-polyfill.js')

  apply()
}

customElements.define('x-popover', class extends DefaultElement {
  $open = false

  connectedCallback() {
    this.addEventListener('toggle', (event) => {
      this.$open = event.newState === 'open'
      if (this.$source.ariaExpanded) this.$source.ariaExpanded = this.$open
    })
  }

  async showPopover({ source }) {
    const autoUpdate = 'autoUpdate' in this.dataset

    if (autoUpdate || !anchorIsSupported) {
      const { autoUpdatePopover } = await import('./popover/index.js')

      await autoUpdatePopover(source, this, this.dataset.placement, JSON.parse(this.dataset.autoUpdate || autoUpdate))
    }

    this.$source = source

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
