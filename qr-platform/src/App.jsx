import { useState } from 'react'
import './App.css'

function App() {

  const [url, setUrl] = useState('')
  const [qr, setQr] = useState('')
  const [size, setSize] = useState(256)
  const [type, setType] = useState('static')

  async function generateQR() {

    if (!url) {
      alert('Please enter a URL')
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

        body: JSON.stringify({
          url
        })

      })

      const data = await response.json()

      setQr(data.qr)

    } catch (error) {

      console.log(error)

      alert('Error generating QR Code')

    }

  }

  function downloadQR() {

    if (!qr) {
      alert('Generate a QR Code first')
      return
    }

    const link = document.createElement('a')

    link.href = qr
    link.download = 'qrcode.png'

    link.click()

  }

  return (

    <div className="container">

      <div className="left-panel">

        <div className="logo">
          QR
        </div>

        <h1>
          QR Code Generator
        </h1>

        <p className="subtitle">
          Create custom QR codes instantly
        </p>

        <h3 className="section-title">
          QR Code Type
        </h3>

        <div className="type-container">

          <div
            className={
              type === 'static'
                ? 'type-card active'
                : 'type-card'
            }

            onClick={() => setType('static')}
          >

            <h2>
              Static QR
            </h2>

            <p>
              Fixed content, not editable
            </p>

          </div>

          <div
            className={
              type === 'dynamic'
                ? 'type-card active'
                : 'type-card'
            }

            onClick={() => setType('dynamic')}
          >

            <h2>
              Dynamic QR
            </h2>

            <p>
              Editable content with tracking
            </p>

          </div>

        </div>

        <h3 className="section-title">
          QR Content
        </h3>

        <input
          type="text"
          placeholder="Enter URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <div className="size-text">

          QR Code Size:

          <span>
            {size}px
          </span>

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

          <span>
            Small
          </span>

          <span>
            Large
          </span>

        </div>

        <div className="button-group">

          <button
            onClick={generateQR}
          >
            Generate QR Code
          </button>

          <button
            className="download-btn"
            onClick={downloadQR}
          >
            ↓ Download QR Code
          </button>

        </div>

        <div className="divider"></div>

        <div className="features">

          <div className="feature-card">

            <h2>
              ∞
            </h2>

            <p>
              Unlimited
            </p>

          </div>

          <div className="feature-card">

            <h2>
              HD
            </h2>

            <p>
              Quality
            </p>

          </div>

          <div className="feature-card">

            <h2>
              ⚡
            </h2>

            <p>
              Instant
            </p>

          </div>

        </div>

      </div>

      <div className="right-panel">

        <div className="qr-preview">

          {
            qr
              ? (
                <img
                  src={qr}
                  alt="QR Code"
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