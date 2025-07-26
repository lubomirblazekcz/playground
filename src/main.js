import {
  anchorIsSupported,
  commandIsSupported,
  DefaultElement,
  DefaultElementTest,
  interestIsSupported,
} from './utils.js'
import { apply } from './interestfor-polyfill.js'

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
    })
  }

  async showPopover({ source }) {
    const autoUpdate = 'autoUpdate' in this.dataset

    if (autoUpdate || !anchorIsSupported) {
      const { autoUpdatePopover } = await import('./popover/index.js')

      console.log(this.dataset.autoUpdate || 's')

      await autoUpdatePopover(source, this, this.dataset.placement, JSON.parse(this.dataset.autoUpdate || autoUpdate))
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
