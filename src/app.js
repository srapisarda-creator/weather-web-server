const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define Paths / Express Config
const publicPath = path.join(__dirname, '.././public')
const viewsPath = path.join(__dirname, '../views/templates')
const partialsPath = path.join(__dirname, '../views/partials')

// Setup Handlebars Engine and Views Location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup Static Directory to Save
app.use(express.static(publicPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Sergio'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Big L',
        name: 'Sergio'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Lorem ipsum dolor'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address.'
        })
    }
    console.log(req.query.address)
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }
    
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Sergio',
        errorMessage: 'Article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Sergio',
        errorMessage: 'Page not found'
    })
})

// '<iframe src="https://giphy.com/embed/14uQ3cOFteDaU" width="100%" height="100%" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>'

app.listen(port, () => {
    console.log('Server: Live...')
})