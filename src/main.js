import {
  supportsAnchor,
  supportsCommand,
  supportsInterest,
  supportsIs,
  DefaultElement,
} from './utils.js'

if (!supportsIs()) {
  await import('@ungap/custom-elements')
}

if (!supportsCommand) {
  const { apply } = await import('invokers-polyfill/fn')

  apply()
}

if (!supportsInterest && document.querySelector('[interestfor]')) {
  const { apply } = await import('./interestfor-polyfill.js')

  apply()
}

customElements.define('x-app', class extends HTMLBodyElement {
  connectedCallback() {
    console.log('x-app')
  }
}, { extends: 'body' })

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

    if (autoUpdate || !supportsAnchor) {
      const { autoUpdatePopover } = await import('./popover/index.js')

      this.$cleanup = await autoUpdatePopover(source, this, this.dataset.placement, JSON.parse(this.dataset.autoUpdate || autoUpdate))
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
