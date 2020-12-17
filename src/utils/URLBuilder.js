// const url = require('url')
//
// const config = require('../config')
//
// const SOCIAL = {
//   TWITTER: 't.twitter',
//   FACEBOOK: 't.facebook'
// }
//
// const social = (type) => {
//   switch (type) {
//     case 'twitter':
//       return { host: 'https://twitter.com/', path: '/intent/tweet', source: SOCIAL.TWITTER }
//     case 'facebook':
//       return { host: 'https://www.facebook.com/', path: '/dialog/share', source: SOCIAL.FACEBOOK }
//   }
// }
//
// function URLBuilder(base, options) {
//   this.base = base
//   this.fbAppID = options.fbAppID || null
// }
//
// URLBuilder.prototype.createURL = function(type, href, body, options) {
//   const { host, path, source } = social(type)
//
//   const url = new url.URL(path, host)
//   const query = new URLSearchParams()
//
//   switch (source) {
//     case SOCIAL.TWITTER:
//       query.append('text', encodeURI(body))
//       break
//   }
// }
//
// URLBuilder.prototype._createURL = function(type, )
//
// module.exports = new URLBuilder(config.get('frontend'), {
//   fbAppID: config.get('app-id')
// })

const config = require('../config')

/**
 * @readonly
 * @enum {String}
 * */
const URLBuilderURLType = {
  TWITTER: 's.twitter',
  FACEBOOK: 's.facebook'
}

// Handle the base url components
const URLBuilderURLComponents = {
  [URLBuilderURLType.FACEBOOK]: {
    host: 'https://www.facebook.com/',
    path: '/dialog/share',
    query: new URLSearchParams([
      ['display', 'page']
    ])
  },
  [URLBuilderURLType.TWITTER]: {
    host: 'https://twitter.com/',
    path: '/intent/tweet'
  }
}

/**
 * Add query params from object
 *
 * @param {URLSearchParams} query
 * @param {Object} object
 * @return {URLSearchParams|String}
 * */
const append = (query, object) => {
  Object.keys(object).forEach((key) => query.append(key, object[key]))
  return query
}

/**
 * Create a URL object from the base components
 * and any required configuration
 *
 * @param {URLBuilderURLType} type
 * @param {Object} requiredQuery
 * */
const getBaseURL = (type, requiredQuery) => {
  const { host, path, query } = URLBuilderURLComponents[type]

  const url = new URL(path, host)
  if (Object.keys(requiredQuery).length > 0) url.search = append(query, requiredQuery)
  return url
}

/**
 * Build the URLBuilder
 *
 * @param {String} base - The base of any redirect URI's
 * @param {Object} options - Any API ids
 * @param {String} options.facebookAppID - Facebook App ID
 * */
function URLBuilder (base, options) {
  /**
   * @param {URLBuilderURLType} type
   * @param {Object} body
   * @return {URL}
   * */
  const builder = (type, body) => {
    // Get the URLSearchParams
    let query
    switch (type) {
      case URLBuilderURLType.TWITTER:
        query = { }
        break
      case URLBuilderURLType.FACEBOOK:
        query = {
          app_id: options.facebookAppID,
          redirect_uri: encodeURI(`${base}/facebook/close`)
        }
        break
    }

    const url = getBaseURL(type, query)
    url.search = append(url.searchParams, body)

    return url
  }

  builder.Type = URLBuilderURLType

  return builder
}

module.exports = URLBuilder(config.get('frontend'), {
  facebookAppID: config.get('app-id')
})
