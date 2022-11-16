const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortner', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shorturls = await ShortUrl.find()
    res.render('index.ejs', { shorturls: shorturls })
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shorturl', async (req, res) => {
    const shorturl = await ShortUrl.findOne({ short: req.params.shorturl })

    if (shorturl == null) return res.sendStatus(404)

    shorturl.clicks++
    shorturl.save()
    res.redirect(shorturl.full)
})
app.listen(process.env.PORT || 5000);