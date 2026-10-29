import { Component, type ErrorInfo, type ReactNode } from 'react'
import './ErrorBoundary.css'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Shown instead of the app when something inside crashes. */
  title?: string
  message?: string
}

interface ErrorBoundaryState {
  hasError: boolean
}

/** Catches render errors (e.g. a device without WebGL) so users see a message, not a blank page. */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const { title = 'Something went wrong', message = 'Please reload the page and try again.' } = this.props
    return (
      <div className="error-screen" role="alert">
        <h1>{title}</h1>
        <p>{message}</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    )
  }
}
