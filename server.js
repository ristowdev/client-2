require('dotenv').config()

const express = require('express')
const next = require('next')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const moment = require('moment')
const _ = require('lodash')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

function searchIgnore (value, ignores) {
  return ignores.some(function (search) {
    return search.test(value)
  })
}

function redirectToHTTPS (ignoreHosts = []) {
  return function middlewareRedirectToHTTPS (req, res, next) {
    const isNotSecure =
      (!req.get('x-forwarded-port') && req.protocol !== 'https') ||
      (parseInt(req.get('x-forwarded-port'), 10) !== 443 &&
        parseInt(req.get('x-forwarded-port'), 10) ===
        parseInt(req.get('x-forwarded-port'), 10))

    let host = req.get('host')
    let redirectHost = host

    if (host.match(/^www/) !== null) {
      // redirect to non www
      redirectHost = host.replace(/^www\./, '')
    }

    if (
      (isNotSecure && !searchIgnore(host, ignoreHosts)) ||
      host !== redirectHost
    ) {
      return res.redirect(301, 'https://' + redirectHost + req.url)
    }

    next()
  }
}

app.prepare().then(() => {
  const server = express()
  if (!dev) {
    server.use(redirectToHTTPS([/localhost:(\d{4})/, /elasticbeanstalk.com/]))
  }

  server.use(cookieParser())
  server.use(bodyParser.json())
  server.use(compression())

  server.get('/_/set', (req, res) => {
    try {
      if (!req.cookies.language_key) {
        res.status(200).json(null)
        return
      }
      const t = JSON.parse(req.cookies.language_key)
      res.status(200).json(t)
    } catch (err) {
      res.status(400).json({ msg: err.message })
    }
  })

  server.post('/_/set', (req, res) => {
    const { rememberMe } = req.body
    const { token } = JSON.parse(req.body.token)

    let date = moment().add(1, 'days').toDate()
    if (rememberMe) {
      date = moment().add(14, 'days').toDate()
    }
    res
      .cookie('token', token, { expires: date, httpOnly: true, encode: String })
      .send({ ok: 'Ok' })
      .end()
  })

  server.delete('/_/set', (req, res) => {
    res.clearCookie('token').send({ ok: 'Ok' }).end()
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  const port = process.env.PORT || 3005

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
