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
    this.$controller = new AbortController()
  }

  async initializeDrawer() {
    const { drawerObserver, drawerEvents } = await import('./drawer/index.js')
    const { signal } = this.$controller

    drawerEvents(this, this.$content, this.$placement, signal)

    this.$observer = drawerObserver(this, this.$placement)
    this.$observer.observe(this.$content)
  }

  partConnectedCallback(name) {
    if (name === '$content') this.initializeDrawer()
  }

  partDisconnectedCallback(name) {
    if (name === '$content') this.$observer?.disconnect()
  }

  disconnectedCallback() {
    this.$controller?.abort()
  }

  async showModal() {
    const { showDrawer } = await import('./drawer/index.js')

    super.showModal()

    showDrawer(this.firstElementChild, this.$placement)
  }
}

customElements.define('x-drawer', Drawer, { extends: 'dialog' })
