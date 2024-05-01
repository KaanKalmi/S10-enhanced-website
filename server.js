// Imports
import express from 'express'
import fetchJson from './helpers/fetch-json.js'

// Stel de variabelen in voor de API URL's en haal de data op
const apiUrl = 'https://fdnd-agency.directus.app/items',
    sdgData = await fetchJson(apiUrl + '/hf_sdgs'),
    stakeholdersData = await fetchJson(apiUrl + '/hf_stakeholders?filter={"company_id":2}'),
    scoresData = await fetchJson(apiUrl + '/hf_scores'),
    companiesData = await fetchJson(apiUrl + '/hf_companies/2')

// Maak een de express app aan met een view engine en een public folder voor statische bestanden
const app = express()
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.set('port', process.env.PORT || 8009)
app.listen(app.get('port'), function () {
    console.log(`Application started on http://localhost:${app.get('port')}`)
})

// Stel de GET routes in
app.get('/', function (request, response) {
    response.render('index', {
        sdgs: sdgData.data,
        stakeholder: stakeholdersData.data,
        score: scoresData.data,
        company: companiesData.data,
    })
})

app.get('/sdg', function (request, response) {
    response.render('sdg', {
        sdgs: sdgData.data,
        stakeholder: stakeholdersData.data,
        score: scoresData.data,
        company: companiesData.data
    })
})

app.get('/stakeholder', function (request, response) {
    response.render('stakeholder', {
        stakeholder: stakeholdersData.data,
        score: scoresData.data,
        company: companiesData.data
    })
})

// app.get naar score pagina

// stel de POST routes in
app.post("/", function (request, response) {
    console.log(request.body); 
    try {
        const { companiesData, staff, suppliers, clients, environment, message } = request.body;

        let checkedRadio;
        if (staff) { checkedRadio = "staff"; }
        else if (suppliers) { checkedRadio = "suppliers"; } 
        else if (clients) { checkedRadio = "clients"; } 
        else if (environment) { checkedRadio = "environment"; }

        if (!checkedRadio) {
            return response.status(400).send('Missing stakeholder type in request body');
        }

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

app.post('/sdg', function (request, response) { 
    const sdgId = request.body.sdg; 
    if (sdgId) { response.redirect(`/score?sdgIds=${sdgId}`); }
    else { response.status(400).send('Missing ID of SDG'); }
})

//console.log in terminal
console.log(companiesData.data.name)