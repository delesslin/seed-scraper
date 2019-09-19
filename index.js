const express = require('express')
const bodyParser = require('body-parser')
const middleware = require('./middleware')

const PORT = process.env.PORT || 3001
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(middleware.scrapeData)
app.use(express.static('build'))

app.get('/api', (req, res) => {
  res.send(req.body.payload)

})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
