import { Component } from 'react'

/* WebGL is not guaranteed: locked-down browsers, blocklisted drivers and
   headless environments all fail at context creation. When that happens
   the journey section should simply lose its 3D, not the whole page. */

export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      (window.WebGL2RenderingContext && canvas.getContext('webgl2')) ||
        (window.WebGLRenderingContext && canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

export default class CanvasBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.warn('3D scene disabled:', error?.message)
  }

  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}
