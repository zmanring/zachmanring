import { Component, type ErrorInfo, type ReactNode } from 'react';

const FONT = '"Press Start 2P", monospace';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Game failed to initialize:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed', inset: 0, background: '#111111',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 24, padding: 32, fontFamily: FONT,
        }}>
          <p style={{ fontSize: 14, color: '#DD4400', textAlign: 'center', lineHeight: 2 }}>
            GAME FAILED TO LOAD
          </p>
          <p style={{ fontSize: 10, color: '#888888', textAlign: 'center', lineHeight: 2, maxWidth: 480 }}>
            Your browser may not support WebGL. Try Chrome, Firefox, or Edge.
          </p>
          <a
            href="https://linkedin.com/in/zachmanring"
            style={{
              marginTop: 8, padding: '12px 24px',
              background: '#DD4400', color: '#F0EDE8',
              textDecoration: 'none', fontSize: 10, fontFamily: FONT,
            }}
          >
            VIEW LINKEDIN INSTEAD
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}
