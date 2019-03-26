const getData = require("./data/owm.js");
const dal = require("wtr-dal");
const id_source = 3

async function startDataСollection() {
    const masLocation = await dal.getAllLocationCoordsId()
    const url_api = await dal.getUrlApi(id_source)
    for (var i = 0; i < masLocation.length; i++) {
        let lat = masLocation[i].lat
        let lon = masLocation[i].lon
        let id_location = masLocation[i].id

        const dataRealWeather = await getData.getforecast(url_api, lat, lon, id_source);
        await dal.saveRealData(dataRealWeather, id_location);
    }
}

startDataСollection();