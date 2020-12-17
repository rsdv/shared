const buildDate = new Date()

const Config = require('@harrytwright/cli-config')

const { version, name } = require('../package.json')

/**
 * Any important values from `process.env` related to itself
 *
 * Mainly for the production or testing
 * */
const environment = { }

const NODE_ENV = process.env.NODE_ENV || 'development'
const isProduction = (NODE_ENV === 'production')

/* istanbul ignore next */
const isTest = NODE_ENV === 'test' ||
  NODE_ENV === 'testing'

environment['node-env'] = NODE_ENV
environment.production = isProduction
environment.test = isTest

const defaults = {
  ...environment,
  api: 'http://cms.localhost',
  date: buildDate,
  cors: '*',
  frontend: 'http://resdev.co.uk',
  loglevel: 'info',
  name,
  proxy: true,
  port: 3000,
  route: '/',
  version
}

const types = {
  api: String,
  'app-id': String,
  date: [Date, String],
  cors: String,
  frontend: String,
  loglevel: [
    'silent',
    'error',
    'warn',
    'notice',
    'http',
    'timing',
    'info',
    'verbose',
    'silly'
  ],
  name: String,
  'node-env': [null, String],
  production: Boolean,
  proxy: Boolean,
  port: [Number, String],
  route: String,
  test: Boolean,
  version: String
}

const envMap = {
  PORT: 'port'
}

module.exports = new Config(defaults, types, envMap, { })
