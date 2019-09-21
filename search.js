const google = require("google-it")
const scraper = require('./scraper')

module.exports = (terms) => {
  return new Promise((resolve, reject)=>{
    google({"query" : terms}).then(res => {
      resolve(res.filter(entry => {
        for(let registrant of scraper.registry){
          if(entry.link.match(registrant.url)){
            return true
          }
        }
      }))
    })
    .catch(e => reject(e))
  })
}


