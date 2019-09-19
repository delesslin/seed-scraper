const scrape = require('scrape-metadata')
const axios = require('axios')
const cheerio =  require("cheerio")

const scrapeSeedSavers = (url, callback) => {
  scrape(url, (err, meta) => {
    const data = {
      title: meta["ogTitle"],
      source: meta["ogSiteName"],
      img: meta["ogImage"],
      description: meta["description"],
      url: meta["ogUrl"]
    }
    callback(err, data)
  })
}

const scrapeSouthernExposure = (url, callback) => {
  axios.get(url).then((res, err) => {
    const $ = cheerio.load(res.data)
    const data = {
      description: $("#productDescription").text(),
      img: `http://www.southernexposure.com/${$("#productMainImage a").attr("href")}`,
      source: "Southern Exposure Seed Exchange",
      url: url,
      title: $("#productGeneral .page-header h1").text()
    }
    scrape(data.url, (err, meta) => {
      data.description = meta["description"]
      callback(err, data)
    })
  })
}

const scrapeRareSeeds = (url, callback) => {
  axios.get(url).then((res, err) => {
    const $ = cheerio.load(res.data)
    const data = {
      description: $(".longDescription").text(),
      title: $(".reviewsWrapper .multiColumn .reviewItem .grid_6 .item .fn").text(),
      source: "Baker Creek Heirloom Seeds",
      url: url,
      img: `http://www.rareseeds.com${$("#productImage .mainImage").attr("src")}`
    }
    callback(err, data)
  })
}

const scrapeData = (req, res, next) => {
  if(req.originalUrl != "/api"){
    next()
  }else{
    const url = req.body.url
    if(url.match("southernexposure.com")){
      scrapeSouthernExposure(req.body.url, (err, data) => {
        if(err){
          res.send(500)
        }
        req.body.payload = data
        next()
      })
    }else if(url.match("seedsavers.org")){
      scrapeSeedSavers(req.body.url, (err, data) => {
        if(err){
          res.send(500)
        }
        req.body.payload = data;
        next()
      })
    }else if(url.match("rareseeds.com")){
      scrapeRareSeeds(url, (err, data) => {
        if(err){
          res.send(500)
        }
        req.body.payload=data
        next()
      })
    }else{
      res.send("400 Error: I don't know how to scrape that site")
    }
  }
}

module.exports.scrapeData = scrapeData
