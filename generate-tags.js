const mkdirp = require("mkdirp")
const path = require("path")

const saveIndex = require("./save-index.js")

function generateTags(articles) {
  const articlesByTag = {}
  articles.forEach(article => {
    article.tags.forEach(tag => {
      if (!articlesByTag[tag]) {
        articlesByTag[tag] = [article]
      } else {
        articlesByTag[tag].push(article)
      }
    })
  })

  const promises = Object.keys(articlesByTag).map(
    tag =>
      new Promise((resolve, reject) => {
        const articles = articlesByTag[tag]
        articles.sort((a, b) => {
          return (b.rawDate || 0) - (a.rawDate || 0)
        })

        const tagPath = path.join("output", "tags", tag)
        mkdirp(tagPath, err => {
          if (err) {
            return reject(err)
          }

          resolve(
            saveIndex(
              articles.filter(article => !article.hidden),
              path.join(tagPath, "index.html"),
              tag + " | jordan scales",
              "-- " + tag + " posts --"
            )
          )
        })
      })
  )

  return Promise.all(promises)
}

module.exports = generateTags
