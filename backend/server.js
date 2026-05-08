const express = require('express')
const cors = require('cors')
const QRCode = require('qrcode')
const { v4: uuidv4 } = require('uuid')

const db = require('./database')

const app = express()

app.use(cors())
app.use(express.json())

/*
====================================
STATIC QR CODE
====================================
*/

app.post('/generate-static', async (req, res) => {

  try {

    const { url } = req.body

    if (!url) {

      return res.status(400).json({
        success: false,
        message: 'URL is required'
      })

    }

    const qr = await QRCode.toDataURL(url)

    res.json({
      success: true,
      type: 'static',
      qr
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: 'Error generating static QR'
    })

  }

})

/*
====================================
DYNAMIC QR CODE
====================================
*/

app.post('/generate-dynamic', async (req, res) => {

  try {

    const { url } = req.body

    if (!url) {

      return res.status(400).json({
        success: false,
        message: 'URL is required'
      })

    }

    const id = uuidv4()

    db.run(
      'INSERT INTO qrcodes (id, original_url) VALUES (?, ?)',
      [id, url],
      async (err) => {

        if (err) {

          console.log(err)

          return res.status(500).json({
            success: false,
            message: 'Database error'
          })

        }

        console.log('QR saved successfully')

        const dynamicUrl = `http://192.168.0.106:3000/r/${id}`

        const qr = await QRCode.toDataURL(dynamicUrl)

        res.json({
          success: true,
          type: 'dynamic',
          qr,
          dynamicUrl
        })

      }
    )

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: 'Error generating dynamic QR'
    })

  }

})

/*
====================================
REDIRECT ROUTE
====================================
*/

app.get('/r/:id', (req, res) => {

  const id = req.params.id

  db.get(
    'SELECT * FROM qrcodes WHERE id = ?',
    [id],
    (err, row) => {

      if (!row) {
        return res.send('QR Code not found')
      }

      res.redirect(row.original_url)

    }
  )

})


/*
====================================
SERVER
====================================
*/

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000')
})