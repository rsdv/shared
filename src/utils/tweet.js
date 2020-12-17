// Set this lower than 280 so it's safer
const MAX_TWEET_LENGTH = 250

/**
 * @param {string} str - string to be truncated
 * @param {number} num - length to trim to
 * */
function truncateString (str, num) {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + '...'
}

/**
 * Truncate the tweet length if its over 280 characters
 *
 * @param {string} title
 * @param {string} author
 * @param {string} url
 * */
module.exports = (title, author, url) => {
  // Can't be more than 280
  const totalLength = (title.length + author.length + url.length)
  if (totalLength > MAX_TWEET_LENGTH) {
    title = truncateString(title, (MAX_TWEET_LENGTH + 3) - totalLength)
  }

  return `${title} by ${author} - ${url}`
}
