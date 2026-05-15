import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [logged, setLogged] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [url, setUrl] = useState('')
  const [qr, setQr] = useState('')
  const [size, setSize] = useState(256)
  const [type, setType] = useState('static')

  useEffect(() => {
    const session = localStorage.getItem('loggedUser')
    if (session) {
      setLogged(true)
    }
  }, [])

  async function handleLogin() {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await response.json()

      if (!data.success) {
        alert('Login inválido')
        return
      }

      localStorage.setItem('loggedUser', data.user.email)
      setLogged(true)

    } catch (error) {
      alert('Erro no login')
    }
  }

  function logout() {
    localStorage.removeItem('loggedUser')
    setLogged(false)
  }

  async function generateQR() {
    if (!url) {
      alert('Digite uma URL')
      return
    }

    const endpoint =
      type === 'static'
        ? 'http://localhost:3000/generate-static'
        : 'http://localhost:3000/generate-dynamic'

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      })

      const data = await response.json()
      setQr(data.qr)

    } catch {
      alert('Erro')
    }
  }

  function downloadQR() {
    if (!qr) return

    const link = document.createElement('a')
    link.href = qr
    link.download = 'qrcode.png'
    link.click()
  }

  if (!logged) {
    return (
      <div className="login-page">

        <div className="login-card">

          <div className="logo">QR</div>

          <h1>Bem-vindo</h1>
          <p className="subtitle">Faça login para continuar</p>

          <div className="login-form">

            <label>Email</label>
            <input
              type="text"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Senha</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>
              Entrar
            </button>

          </div>

        </div>

      </div>
    )
  }

  return (
    <div className="container">

      <button className="logout-btn" onClick={logout}>
        Sair
      </button>

      <div className="left-panel">

        <div className="logo">QR</div>

        <h1>QR Code Generator</h1>

        <p className="subtitle">
          Create custom QR codes instantly
        </p>

        <h3 className="section-title">
          QR Code Type
        </h3>

        <div className="type-container">

          <div
            className={type === 'static' ? 'type-card active' : 'type-card'}
            onClick={() => setType('static')}
          >
            <h2>Static QR</h2>
            <p>Fixed content</p>
          </div>

          <div
            className={type === 'dynamic' ? 'type-card active' : 'type-card'}
            onClick={() => setType('dynamic')}
          >
            <h2>Dynamic QR</h2>
            <p>Editable content</p>
          </div>

        </div>

        <h3 className="section-title">
          QR Content
        </h3>

        <input
          type="text"
          placeholder="Digite a URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <div className="size-text">
          QR Size <span>{size}px</span>
        </div>

        <input
          type="range"
          min="150"
          max="400"
          value={size}
          className="slider"
          onChange={(e) => setSize(e.target.value)}
        />

        <div className="range-labels">
          <span>Small</span>
          <span>Large</span>
        </div>

        <div className="button-group">
          <button onClick={generateQR}>
            Generate QR
          </button>

          <button
            className="download-btn"
            onClick={downloadQR}
          >
            Download
          </button>
        </div>

      </div>

      <div className="right-panel">

        <div className="qr-preview">

          {
            qr
              ? (
                <img
                  src={qr}
                  alt="QR"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`
                  }}
                />
              )
              : (
                <div className="placeholder">
                  QR Preview
                </div>
              )
          }

        </div>

      </div>

    </div>
  )
}

export default App