import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  err: Error | null
}

/**
 * useSuspenseQuery y errores de render sin límite dejan el popup en negro / vacío
 * (sin error boundary, React 18 no muestra nada en extensiones).
 */
export class PopupErrorBoundary extends Component<Props, State> {
  state: State = { err: null }

  static getDerivedStateFromError(err: Error): State {
    return { err }
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    console.error('[MV Tools] Error en el popup de la extensión', err, info.componentStack)
  }

  render() {
    if (this.state.err) {
      return (
        <div
          className='box-border p-4 text-left text-sm'
          style={{
            minWidth: 400,
            minHeight: 120,
            background: '#262626',
            color: '#fafafa',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          <h2
            className='mb-2 font-bold'
            style={{ color: '#fb923c' }}
          >
            Error al abrir el popup
          </h2>
          <p className='break-words'>{this.state.err.message}</p>
        </div>
      )
    }
    return this.props.children
  }
}
