// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({extended: true}))


// Stel het basis endpoint in
const apiUrl = 'https://fdnd-agency.directus.app/items'

const sdgData = await fetchJson(apiUrl + '/hf_sdgs')
const stakeholdersData = await fetchJson(apiUrl + '/hf_stakeholders/1')
const scoresData = await fetchJson(apiUrl + '/hf_scores')
const companiesData = await fetchJson(apiUrl + '/hf_companies/1')

console.log(companiesData.data.name)

app.get('/', function(request, response) {
        response.render('index', {
            sdgs: sdgData.data,
            stakeholder: stakeholdersData.data,
            score: scoresData.data,
            company: companiesData.data
        })
})

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8009)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function() {
  // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})

// VOORBEELD POST VAN VORIGE SPRINT
// app.post('/', (req, res) => { //post route naar / met response request
//     console.log(req.body); // log request body in console
//     const sdgId = req.body.sdg; // haal sdg uit request body
//     if (sdgId) {
//         res.redirect(`/score?sdgIds=${sdgId}`); // redirect naar scoreboard net de sdgId
//     } else {
//         res.redirect('/?error=true'); // redirect naar home met error
//     }
// })

// app.get('/score', function(request, response) {
//     const filteredsdgs = sdgData.data.filter(sdg => request.query.sdgIds.includes(sdg.number)) // filter sdgs op basis van query van app.post
//     response.render('score', {
//         sdg:filteredsdgs, // filter sdgs op basis van query
//         stakeholder: stakeholdersData.data, 
//         score: scoresData.data, 
//     })
// })