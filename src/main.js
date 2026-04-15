import { supportsAnchor, supportsAnchoredContainer } from './utils.js'
import { initializeController, WebuumElement } from 'webuum'
import './polyfill.js'

customElements.define('x-app', class extends HTMLBodyElement {
  constructor() {
    super()
    initializeController(this)
  }

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

customElements.define('x-carousel', class extends WebuumElement {
  static parts = {
      $content: null
  }

  $index = 0

  connectedCallback() {
    console.log(this)

    this.$children = [...this.$content.children]

    this.$content.addEventListener('scrollsnapchange', (event) => {
      this.$index = this.$children.indexOf(event.snapTargetInline)
    })
  }

  scrollTo(index) {
    this.$children[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  }

  scrollPrev() {
    console.log('scrollPrev')
    this.scrollTo(this.$index - 1)
  }

  scrollNext() {
    this.scrollTo(this.$index + 1)
  }
})
