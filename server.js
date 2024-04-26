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
app.use(express.urlencoded({ extended: true }))


// Stel het basis endpoint in
const apiUrl = 'https://fdnd-agency.directus.app/items'

const sdgData = await fetchJson(apiUrl + '/hf_sdgs')
const stakeholdersData = await fetchJson(apiUrl + '/hf_stakeholders?filter={"company_id":2}')
const scoresData = await fetchJson(apiUrl + '/hf_scores')
const companiesData = await fetchJson(apiUrl + '/hf_companies/2')

console.log(companiesData.data.name)

app.get('/', function (request, response) {
    response.render('index', {
        sdgs: sdgData.data,
        stakeholder: stakeholdersData.data,
        score: scoresData.data,
        company: companiesData.data,
    })
})

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8009)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
    // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})

app.get('/sdg', function (request, response) {
    response.render('sdg', {
        sdgs: sdgData.data,
        stakeholder: stakeholdersData.data,
        score: scoresData.data,
        company: companiesData.data
    })
})

app.post('/sdg', function (req, res) { //post route naar /sdg met response request
    const sdgId = req.body.sdg; // haal sdg uit request body
    if (sdgId) {
        res.redirect(`/score?sdgIds=${sdgId}`); // redirect naar score net de sdgId
    } else {
        res.redirect('/?error=true'); // redirect naar home met error
    }
})

app.get('/stakeholder', function (request, response) {
    response.render('stakeholder', {
        stakeholder: stakeholdersData.data,
        score: scoresData.data,
    })
})

app.post("/", async function (request, response) {
    try {
        const companyId = request.params.id;
        const staff = request.body.staff;
        const suppliers = request.body.suppliers;
        const clients = request.body.clients;
        const environment = request.body.environment;
        const name = request.body.message;
        const stakeholder = [];
        let CheckedRadio;
        if (staff) {
            CheckedRadio = "staff";
        } else if (suppliers) {
            CheckedRadio = "suppliers";
        } else if (clients) {
            CheckedRadio = "clients";
        } else if (environment) {
            CheckedRadio = "environment";
        }

        stakeholder.push(companyId, CheckedRadio, name);
        fetch('https://fdnd-agency.directus.app/items/hf_stakeholders', {
            method: 'POST',
            body: JSON.stringify({
                company_id: companyId,
                type: CheckedRadio,
                name: name
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then((postReponse) => {
            response.redirect('/' + companyId)
        })
    } catch (error) {
        console.error("Error handling POST request:", error);
        response.status(500).send("Error handling POST request");
    }
});