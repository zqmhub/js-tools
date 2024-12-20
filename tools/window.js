// 2023.03 typescript.4 pass
const module = {
  getLocation() {
    const href = window.location.href
    const origin = window.location.origin
    const pathname = window.location.pathname
    const search = window.location.search
    const hash = window.location.hash

    return { href, origin, pathname, search, hash }
  }
}

export default module
