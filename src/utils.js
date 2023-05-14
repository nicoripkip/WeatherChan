const fetch = require("node-fetch")
const fs = require('node:fs');
const path = require('node:path')


const knmiApiUrls = [
    `https://api.dataplatform.knmi.nl/open-data/v1/datasets/Actuele10mindataKNMIstations/versions/2/files`,
    `https://api.dataplatform.knmi.nl/open-data/v1/datasets/radar_forecast/versions/1.0/files`,
    `https://api.dataplatform.knmi.nl/open-data/v1/datasets/harmonie_arome_cy40_p5/versions/0.2/files`,
]


async function getWeatherData(url) {
    const headers = {
        'Authorization':process.env.WEATHER_API_TOKEN
    }
    const response = await fetch(url, { headers })
        .then(response => response.json())
            .then(data => {
                return data
        })
        .catch(error => {
            console.error(error)
        })

    if (response != undefined) return response
}


const datasetFolder = "datasets"
const datasetPath = path.join(__dirname, "../"+datasetFolder)
if (!fs.existsSync(datasetPath)) {
    fs.mkdir(datasetPath, { recursive: true }, error => {
        if (error) {
            console.error(`[error]\terror: ${error}`)
        }
    })
}

console.log(datasetPath)

module.exports = {
    knmiApiUrls: knmiApiUrls,
    getWeatherData: getWeatherData,
}