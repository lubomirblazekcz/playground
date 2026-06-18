import { initializeController } from 'webuum'

class Drawer extends HTMLDialogElement {
  static parts = {
    $content: null,
  }

  static props = {
    $placement: 'left',
  }

  constructor() {
    super()
    initializeController(this)
  }

  connectedCallback() {
    this.addEventListener('cancel', (event) => {
      event.preventDefault()
      this.closeDrawer()
    })

    const visibleThreshold = 1 / window.innerWidth
    this.$observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(-1)

        if (entry.intersectionRatio < visibleThreshold) {
          this.close()
        }
      },
      { root: this, threshold: [visibleThreshold, 1] },
    )

    this.$observer.observe(this.$content)
  }

  disconnectedCallback() {
    this.$observer?.disconnect()
  }

  async showModal() {
    super.showModal()
    this.showDrawer()
  }

  async showDrawer() {
    const { showDrawer } = await import('./drawer/index.js')

    const [distance, distanceClosed, direction] = {
      right: [this.scrollWidth, 0, 'left'],
      bottom: [this.scrollHeight, 0, 'top'],
      top: [0, this.scrollHeight, 'top'],
    }[this.$placement] ?? []

    await showDrawer(this.firstElementChild, distance, direction)
  }

  async closeDrawer() {
    const { closeDrawer } = await import('./drawer/index.js')

    const [distance, direction] = {
      right: [0, 'left'],
      bottom: [0, 'top'],
      top: [this.scrollHeight, 'top'],
    }[this.$placement] ?? []

    await closeDrawer(this.firstElementChild, distance, direction)
  }
}

customElements.define('x-drawer', Drawer, { extends: 'dialog' })
