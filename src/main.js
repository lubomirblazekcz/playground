import {
  supportsAnchor,
  supportsCommand,
  supportsInterest,
  supportsIs,
  DefaultElement, superConnect,
} from './utils.js'

if (!supportsIs()) {
  await import('@webreflection/custom-elements-builtin')
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

customElements.define('x-popover',
  /**
   * @property {string} $placement
   * @property {string} $test
   * @property {HTMLElement|null} $test
  */
  class extends DefaultElement {
    $open = false

    static parts = {
      $test: '@',
    }

    static values = {
      $placement: 'left',
      $dialog: 'modal',
    }

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
  },
)

customElements.define('x-dialog', class extends HTMLDialogElement {
  connectedCallback() {
    superConnect(this)
    console.log('x-dialog')
  }
}, { extends: 'dialog' })
