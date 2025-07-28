import {
  supportsAnchor,
  supportsCommand,
  supportsInterest,
  supportsIs,
  WebuumElement,
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
   * @property {object|boolean} $autoUpdate
   * @property {HTMLElement|null} $test
  */
  class extends WebuumElement {
    $open = false

    static values = {
      $placement: null,
      $autoUpdate: null,
    }

    connectedCallback() {
      this.addEventListener('toggle', (event) => {
        this.$open = event.newState === 'open'
        if (this.$source?.ariaExpanded) this.$source.ariaExpanded = this.$open
      })
    }

    async showPopover({ source }) {
      console.dir(this)
      if (this.$autoUpdate || !supportsAnchor) {
        const { autoUpdatePopover } = await import('./popover/index.js')

        this.$cleanup = await autoUpdatePopover(source, this, this.$placement, this.$autoUpdate)
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
