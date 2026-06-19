import {initializeController} from "webuum";

customElements.define('x-app', class extends HTMLBodyElement {
  constructor() {
    super()
    initializeController(this)
  }

  connectedCallback() {
    console.log('x-app')
  }
}, { extends: 'body' })