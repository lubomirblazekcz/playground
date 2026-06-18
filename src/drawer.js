import { initializeController } from 'webuum'

class Drawer extends HTMLDialogElement {
  static parts = {
    $content: null,
  }

  static props = {
    $placement: 'left',
    $dialog: 'modal',
  }

  constructor() {
    super()
    initializeController(this)
  }

  connectedCallback() {
    this.addEventListener('scroll', this.$scroll)
    this.addEventListener('click', this.dismiss)

    this.addEventListener('command', (e) => {
      console.log(e)
    })
  }

  async $scroll({ target }) {
    const { scrollDrawer } = await import('./drawer/index.js')

    const bottomTop = {
      snapClass: 'snap-y snap-mandatory',
      scrollSize: target.scrollHeight - target.clientHeight,
      scrollDirection: target.scrollTop,
    }

    const rightBottom = {
      scrollClose: 0,
      opacityRatio: 0,
    }

    const placement = {
      right: {
        ...rightBottom,
        scrollOpen: target.scrollWidth - target.clientWidth,
      },
      bottom: {
        ...rightBottom,
        ...bottomTop,
        scrollOpen: target.scrollHeight - target.clientHeight,
      },
      top: {
        ...bottomTop,
        scrollOpen: 0,
        scrollClose: target.scrollHeight - target.clientHeight,
      },
    }

    await scrollDrawer(target, placement[this.$placement])
  }

  async showModal() {
    const { showDrawer, scrollInitDrawer } = await import('./drawer/index.js')

    super.showModal()

    const [distance, distanceClosed, direction] = {
      right: [this.scrollWidth, 0, 'left'],
      bottom: [this.scrollHeight, 0, 'top'],
      top: [0, this.scrollHeight, 'top'],
    }[this.$placement] ?? []

    console.log(this.$placement)

    await scrollInitDrawer(this, distanceClosed, direction)

    await showDrawer(this, distance, direction)
  }

  async close() {
    const { closeDrawer } = await import('./drawer/index.js')

    const [distance, direction] = {
      right: [0, 'left'],
      bottom: [0, 'top'],
      top: [this.scrollHeight, 'top'],
    }[this.$placement] ?? []

    await closeDrawer(this, distance, direction)

    if (this.$triggerElement) this.$triggerElement.ariaExpanded = false
  }

  async dismiss({ target }) {
    if (!this.open) return

    console.log('asdf')

    if (!this.$content.contains(target) && !this.$content.isEqualNode(target)) {
      await this.close()
    }
  }

  async toggle({ currentTarget }) {
    this.$triggerElement = currentTarget

    if (this.element.inert) {
      currentTarget.ariaExpanded = true
      this.showModal()
    }
    else {
      currentTarget.ariaExpanded = false
      this.close()
    }
  }
}

customElements.define('x-drawer', Drawer, { extends: 'dialog' })