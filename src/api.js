const os = require('./utils/os')
const build = require('./utils/build')
const service = require('./service/social')

/**
 * @param {express.Router} router
 * */
module.exports = (router) => {

  router.get('/', (req, res, next) => {
    return res.status(200).json({
      name: config.get('name'),
      version: config.get('version'),
      os,
      build
    })
  })

  /**
   * GET /s/:social?slug=1234567890
   * */
  router.get('/s/:social', async (req, res, next) => {
    const slug = req.query.slug
    const social = req.params.social

    try {
      const url = await service.share(social, slug)
      return res.redirect(url.href)
    } catch (err) {
      return next(err)
    }
  })
}
