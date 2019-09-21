// TODO: Turn these into promises!

const scrape = require('scrape-metadata')
const axios = require('axios')
const cheerio =  require("cheerio")


const seedSavers = (url, callback) => {
  return new Promise((resolve, reject) => {
    scrape(url, (err, meta) => {
      if(err){
        reject(err)
      }
      const data = {
        title: meta["ogTitle"],
        source: meta["ogSiteName"],
        img: meta["ogImage"],
        description: meta["description"],
        url: meta["ogUrl"]
      }
      resolve(data)
  })
  })
}

const southernExposure = (url) => {
  return new Promise((resolve, reject) => {
    axios.get(url).then((res, err) => {
      if(err){
        reject(err)
      }
      const $ = cheerio.load(res.data)
      const data = {
        description: $("#productDescription").text(),
        img: `http://www.southernexposure.com/${$("#productMainImage a").attr("href")}`,
        source: "Southern Exposure Seed Exchange",
        url: url,
        title: $("#productGeneral .page-header h1").text()
      }
      scrape(data.url, (err, meta) => {
        if(err){
          reject(err)
        }
        data.description = meta["description"]
        resolve(data)
      })
    })

  })
}

const rareSeeds = (url, callback) => {
  return new Promise((resolve, reject) => {
    axios.get(url).then((res, err) => {
      if(err){
        reject(err)
      }
      const $ = cheerio.load(res.data)
      const data = {
        description: $(".longDescription").text(),
        title: $(".reviewsWrapper .multiColumn .reviewItem .grid_6 .item .fn").text(),
        source: "Baker Creek Heirloom Seeds",
        url: url,
        img: `http://www.rareseeds.com${$("#productImage .mainImage").attr("src")}`
      }
      resolve(data)
    })
  })
}

const seedScraper = (url) => {
  new Promise((resolve, reject) => {
    for(registrant of registry){
      if(url.match(registrant.url)){
        resolve(registrant.fn(url))
      }
    }
    reject("Can't scrape that address")
  })
}

const registry = [
  {
    fn: url => rareSeeds,
    url: "rareseeds.com"
  },
  {
    fn: url => seedSavers,
    url: "seedsavers.org"
  },
  {
    fn: url => southernExposure,
    url: "southernexposure.com"
  }
]
module.exports.rareSeeds = rareSeeds
module.exports.southernExposure = southernExposure
module.exports.seedSavers = seedSavers
module.exports.seedScraper = seedScraper
module.exports.registry = registry
