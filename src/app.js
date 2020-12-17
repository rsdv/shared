const cors = require('cors')
const helmet = require('helmet')
const express = require('express')
const erred = require('@hndlr/erred')
const compression = require('compression')
const { NotFound } = require('@hndlr/errors')
const { trace, morgan } = require('@harrytwright/networking').middleware

const log = require('./utils/log')

/**
 * @param {Config} ctx
 * */
module.exports = (ctx) => {
  const app = express()

  app.set('trust proxy', !!ctx.get('proxy'))

  app.use(cors({
    origin: ctx.get('cors') || '*',
    methods: 'GET,HEAD',
    preflightContinue: false,
    optionsSuccessStatus: 204
  }))

  app.use(helmet())
  app.use(compression())

  app.use(trace)
  app.use(morgan(log))

  /**
   * Routing
   * */
  const router = express.Router()
  require('./api')(router)
  app.use(ctx.get('route') || '/', router)

  /**
   * Add error handling, we like to pass all errors back as a JSON
   * object since we're an API, the client should handle these
   * appropriately!
   */
  app.get('*', async (req, res, next) => {
    return next(new NotFound(`Could not find ${req.path}`))
  })

  app.use(erred({ stack: false }))

  return app
}
