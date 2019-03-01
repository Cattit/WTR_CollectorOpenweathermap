let getData = require("./data/owm.js");
let dal = require("wtr-dal");
// getData.getforecast(53.92072, 102.049065);  

async function startDataСollection() {
    let lat = 55.555072
    let lon = 98.664357
    const dataRealWeather = await getData.getforecast(lat, lon);
    const id_location = await dal.getIdLocationByCoords(lat, lon)
    await dal.saveRealData(dataRealWeather, id_location);
}

startDataСollection();