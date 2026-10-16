import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('FIND&GO ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            backgroundColor: '#faf8f5',
            color: '#2a2522',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              background: '#fff',
              padding: '36px 32px',
              borderRadius: '16px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.06)'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>☕</div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
              Đã xảy ra lỗi khi tải trang
            </h1>
            <p style={{ fontSize: '14px', color: '#6e6259', marginBottom: '24px', lineHeight: '1.6' }}>
              Ứng dụng gặp sự cố không mong muốn trong khi hiển thị. Vui lòng tải lại trang hoặc kiểm tra kết nối mạng.
            </p>
            {this.state.error?.message && (
              <pre
                style={{
                  fontSize: '12px',
                  color: '#b3261e',
                  backgroundColor: '#fef3f2',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  textAlign: 'left',
                  overflowX: 'auto',
                  marginBottom: '20px'
                }}
              >
                {this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                backgroundColor: '#d96b27',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                padding: '12px 28px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(217,107,39,0.3)'
              }}
            >
              Tải lại trang
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
