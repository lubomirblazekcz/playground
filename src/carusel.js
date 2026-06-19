import {WebuumElement} from "webuum";

customElements.define('x-carousel', class extends WebuumElement {
  static parts = {
    $content: null,
    $markerGroup: null,
    $marker: null,
    $prev: null,
    $next: null,
  }

  static props = {
    $vertical: false,
  }

  async connectedCallback() {
    const { scrollToMarker, setSnappedAttribute, toggleScrollState } = await import('./carousel/index.js')

    this.$marker.forEach(element => element.addEventListener('click', (event) => {
      event.preventDefault()

      scrollToMarker(this.$content, event.target, this.$markerGroup, this.$vertical
        ? {
          block: 'start',
        }
        : {})
    }))

    this.$content.addEventListener('scrollsnapchanging', (event) => {
      setSnappedAttribute(this.$content, event.snapTargetInline ?? event.snapTargetBlock, this.$markerGroup)
    })

    this.$content.addEventListener('scroll', () => {
      const vertical = this.$vertical
        ? {
          scrollStart: this.$content.scrollTop <= 0,
          scrollEnd: this.$content.scrollTop >= this.$content.scrollHeight - this.$content.clientHeight,
          scrollNone: !(this.$content.scrollHeight - this.$content.clientHeight),
        }
        : {}

      toggleScrollState(this.$content, {
        prevElement: this.$prev,
        nextElement: this.$next,
        ...vertical,
      })
    })
  }

  async $scroll(direction) {
    const { scrollBy } = await import('./carousel/index.js')

    const vertical = this.$vertical
      ? {
        distance: this.$content.clientHeight * 0.85,
        position: 'top',
      }
      : {}

    scrollBy(this.$content, {
      direction,
      ...vertical,
    })
  }

  scrollPrev() {
    this.$scroll(-1)
  }

  scrollNext() {
    this.$scroll(1)
  }
})

customElements.define('x-carousel-horizontal', class extends WebuumElement {
  static parts = {
    $content: null,
    $markerGroup: null,
    $marker: null,
    $prev: null,
    $next: null,
  }

  async connectedCallback() {
    const { scrollToMarker, setSnappedAttribute, toggleScrollState } = await import('./carousel/index.js')

    this.$marker.forEach(element => element.addEventListener('click', (event) => {
      event.preventDefault()

      scrollToMarker(this.$content, event.target, this.$markerGroup)
    }))

    this.$content.addEventListener('scrollsnapchanging', (event) => {
      setSnappedAttribute(this.$content, event.snapTargetInline ?? event.snapTargetBlock, this.$markerGroup)
    })

    this.$content.addEventListener('scroll', () => {
      toggleScrollState(this.$content, {
        prevElement: this.$prev,
        nextElement: this.$next,
      })
    })
  }

  async $scroll(direction) {
    const { scrollBy } = await import('./carousel/index.js')

    scrollBy(this.$content, {
      direction,
    })
  }

  scrollPrev() {
    this.$scroll(-1)
  }

  scrollNext() {
    this.$scroll(1)
  }
})

customElements.define('x-carousel-vertical', class extends WebuumElement {
  static parts = {
    $content: null,
    $markerGroup: null,
    $marker: null,
    $prev: null,
    $next: null,
  }

  async connectedCallback() {
    const { scrollToMarker, setSnappedAttribute, toggleScrollState } = await import('./carousel/index.js')

    this.$marker.forEach(element => element.addEventListener('click', (event) => {
      event.preventDefault()

      scrollToMarker(this.$content, event.target, this.$markerGroup, {
        block: 'start',
      })
    }))

    this.$content.addEventListener('scrollsnapchanging', (event) => {
      setSnappedAttribute(this.$content, event.snapTargetInline ?? event.snapTargetBlock, this.$markerGroup)
    })

    this.$content.addEventListener('scroll', () => {
      toggleScrollState(this.$content, {
        prevElement: this.$prev,
        nextElement: this.$next,
        scrollStart: this.$content.scrollTop <= 0,
        scrollEnd: this.$content.scrollTop >= this.$content.scrollHeight - this.$content.clientHeight,
        scrollNone: !(this.$content.scrollHeight - this.$content.clientHeight),
      })
    })
  }

  async $scroll(direction) {
    const { scrollBy } = await import('./carousel/index.js')

    scrollBy(this.$content, {
      direction,
      distance: this.$content.clientHeight * 0.85,
      position: 'top',
    })
  }

  scrollPrev() {
    this.$scroll(-1)
  }

  scrollNext() {
    this.$scroll(1)
  }
})