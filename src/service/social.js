const fetch = require('node-fetch')

const { NotFound, BadRequest } = require('@hndlr/errors')

const config = require('../config')
const tweet = require('../utils/tweet')
const urlBuilder = require('../utils/URLBuilder')

class SocialService {
  async share (social, slug) {
    switch (social) {
      case 'twitter': {
        const response = await fetch(`${config.get('api')}/articles?slug=${slug}`)
        const data = await response.json()

        const article = data[0]
        if (!article) throw new NotFound(`Could not find slug [${slug}]`)

        const type = urlBuilder.Type.TWITTER
        const body = {
          text: tweet(article.title, article.author || 'Resdev Team', encodeURI(`${config.get('frontend')}/${slug}?source=${type}`))
        }
        return urlBuilder(type, body)
      }
      case 'facebook': {
        const type = urlBuilder.Type.FACEBOOK
        const body = {
          href: encodeURI(`${config.get('frontend')}/${slug}?source=${type}`)
        }
        return urlBuilder(type, body)
      }
      default:
        throw new BadRequest('Invalid Social Type')
    }
  }
}

module.exports = new SocialService()
