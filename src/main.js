function isSupported() {
    return (
        typeof HTMLButtonElement !== "undefined" &&
        "command" in HTMLButtonElement.prototype &&
        "source" in ((globalThis.CommandEvent || {}).prototype || {})
    )
}

if (!isSupported()) {
    const { apply } = await import('invokers-polyfill')

    apply()
}

const superConnect = (self) => {
    self.addEventListener("command", e => {
        const method = e.command.slice(2)
            .replace(/(-\w)/g, c => c[1].toUpperCase())

        if (method in self) self[method](e)
    })
}

customElements.define("x-popover", class extends HTMLElement {
    connectedCallback() {
        superConnect(this)
        console.log(this)
    }

    togglePopover() {
        console.log('show')
    }
})