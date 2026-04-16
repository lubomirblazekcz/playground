import { supportsAnchor, supportsAnchoredContainer } from './utils.js'
import { initializeController, WebuumElement } from 'webuum'
import { scrollBy, scrollToMarker, setSnappedAttribute, setCurrentAttribute, toggleScrollState } from './carousel/index.js'
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
      $content: null,
      $markerGroup: null,
      $marker: null,
      $prev: null,
      $next: null
  }

  connectedCallback() {
    this.$marker.forEach((element) => element.addEventListener('click', (event) => {
      event.preventDefault()

      scrollToMarker(this.$content, event.target, this.$markerGroup)
    }))

    this.$content.addEventListener('scrollsnapchanging', (event) => {
      setSnappedAttribute(this.$content, event.snapTargetInline ?? event.snapTargetBlock, this.$markerGroup)
    })

    this.$content.addEventListener('scroll', () => {
      toggleScrollState(this.$content, {
        prevElement: this.$prev,
        nextElement: this.$next
      })
    })
  }

  scrollPrev() {
    scrollBy(this.$content, {
      direction: -1,
    })
  }

  scrollNext() {
    scrollBy(this.$content, {
      direction: 1,
    })
  }

  scrollDown() {
    scrollBy(this.$content, {
      direction: 1,
      distance: this.$content.clientHeight * 0.85,
      position: 'top'
    })
  }

  scrollUp() {
    scrollBy(this.$content, {
      direction: -1,
      distance: this.$content.clientHeight * 0.85,
      position: 'top'
    })
  }
})
