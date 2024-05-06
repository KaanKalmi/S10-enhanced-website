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

const sdgData = await fetchJson(apiUrl + '/hf_sdgs'),
    stakeholdersData = await fetchJson(apiUrl + '/hf_stakeholders?filter={"company_id":2}'),
    scoresData = await fetchJson(apiUrl + '/hf_scores'),
    companiesData = await fetchJson(apiUrl + '/hf_companies/2')

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

app.post('/sdg', function (request, response) { //post route naar /sdg met response request
    const sdgId = req.body.sdg; // haal sdg uit request body
    if (sdgId) {
        response.redirect(`/score?sdgIds=${sdgId}`); // redirect naar score net de sdgId
    } else {
        response.redirect('/?error=true'); // redirect naar home met error
    }
})

app.get('/score', function(request, response) {
    let sdgIds = request.query.sdgIds;
    if (!Array.isArray(sdgIds)) {
        sdgIds = [sdgIds]; // convert to array if it's not an array
    }
    const filteredsdgs = sdgData.data.filter(sdg => sdgIds.includes(sdg.number))
    response.render('score', {
        sdg: filteredsdgs,
        stakeholder: stakeholdersData.data,
        score: scoresData.data,
    })
})
app.get('/stakeholder', function (request, response) {
    response.render('stakeholder', {
        stakeholder: stakeholdersData.data,
        score: scoresData.data,
        company: companiesData.data
    })
})

app.post("/", function (request, response) {
    console.log(request.body); // Log the request body to debug
    try {
        const { companiesData, staff, suppliers, clients, environment, message } = request.body;

        if (!companiesData || !message) {
            return response.status(400).send('Missing companiesData or message in request body');
        }

        let checkedRadio;
        if (staff) {
            checkedRadio = "staff";
        } else if (suppliers) {
            checkedRadio = "suppliers";
        } else if (clients) {
            checkedRadio = "clients";
        } else if (environment) {
            checkedRadio = "environment";
        }

        if (!checkedRadio) {
            return response.status(400).send('Missing staff, suppliers, clients, or environment in request body');
        }

        console.log(`companyId: ${companiesData}`);
        console.log(`checkedRadio: ${checkedRadio}`);
        console.log(`name: ${message}`);

        fetch('https://fdnd-agency.directus.app/items/hf_stakeholders?fields=*,*,*,*,*,*', {
            method: 'POST',
            body: JSON.stringify({
                companiesData: companiesData,
                company_id: companiesData,
                type: checkedRadio,
                name: message
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then((postresponse) => {
            response.redirect('/')
        })
    } catch (error) {
        console.error("Error handling POST request:", error);
        response.status(500).send("Error handling POST request");
    }
});

app.get('/environment', function (request, response) {
    response.render('environment', {
        sdgs: sdgData.data,
        stakeholder: stakeholdersData.data,
        score: scoresData.data,
        company: companiesData.data
    })
})