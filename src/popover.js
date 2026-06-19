import {WebuumElement} from "webuum";
import {supportsAnchor, supportsAnchoredContainer} from "./utils.js";

customElements.define('x-popover',
  /**
   * @property {string} $placement
   * @property {object|boolean} $autoUpdate
   * @property {HTMLElement|null} $test
   */
  class extends WebuumElement {
    $open = false

    static props = {
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
      console.log(this.$autoUpdate)
      if ((this.$autoUpdate && !supportsAnchoredContainer) || !supportsAnchor) {
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