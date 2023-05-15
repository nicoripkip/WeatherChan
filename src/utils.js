const fetch = require("node-fetch")
const fs = require('node:fs');
const path = require('node:path');
const { finished, Readable, Stream } = require("node:stream");
const { promisify } = require("node:util");


const knmiApiUrls = [
    `https://api.dataplatform.knmi.nl/open-data/v1/datasets/Actuele10mindataKNMIstations/versions/2/files`,
    `https://api.dataplatform.knmi.nl/open-data/v1/datasets/radar_forecast/versions/1.0/files`,
    `https://api.dataplatform.knmi.nl/open-data/v1/datasets/harmonie_arome_cy40_p5/versions/0.2/files`,
]


const datasetFolder = "datasets"
const datasetPath = path.join(__dirname, "../"+datasetFolder)
if (!fs.existsSync(datasetPath)) {
    fs.mkdir(datasetPath, { recursive: true }, error => {
        if (error) {
            console.error(`[error]\terror: ${error}`)
            return
        }
    })
}


function findLastAddedFile(fpath) {
    const files = fs.readdirSync(fpath, { recursive: true })
    files.sort((a, b) => {
        const filePathA = path.join(fpath, a);
        const filePathB = path.join(fpath, b);
        return fs.statSync(filePathB).mtime.getTime() - fs.statSync(filePathA).mtime.getTime();
    });

    return files[0]
}


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
            console.error(`[error]\terror: ${error}`)
        })

    if (response != undefined) 
        return response
}


let fileStream
async function downloadGribFileFromApi(url, file) {
    const headers = {
        "Authorization": process.env.WEATHER_API_TOKEN,
    }
    let response = await fetch(url, { headers })

    const flags = {
        flags: "wx"
    }
    fileStream = fs.createWriteStream(path.join(datasetPath, file), flags)
    return new Promise((resolve, reject) => {
        Stream.pipeline(response.body, fileStream, error => {
            
        })
    })
}


module.exports = {
    knmiApiUrls: knmiApiUrls,
    getWeatherData: getWeatherData,
    downloadGribFileFromApi: downloadGribFileFromApi,
    findLastAddedFile: findLastAddedFile,
}