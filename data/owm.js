const axios = require("axios");
const dateNow = new Date()
dateNow.setHours(dateNow.getHours(), 0, 0, 000)

function wind_direction(degree) {
  switch (true) {
    case (degree >= 337.5 && degree <= 359) || (degree >= 0 && degree < 22.5):
      return "n";
      break;
    case degree >= 22.5 && degree < 67.5:
      return "ne";
      break;
    case degree >= 67.5 && degree < 112.5:
      return "e";
      break;
    case degree >= 112.5 && degree < 157.5:
      return "se";
      break;
    case degree >= 157.5 && degree < 202.5:
      return "s";
      break;
    case degree >= 202.5 && degree < 247.5:
      return "sw";
      break;
    case degree >= 247.5 && degree < 292.5:
      return "w";
      break;
    case degree >= 292.5 && degree < 337.5:
      return "nw";
      break;
    default:
      console.log("ERROR wind_direction OWM");
      return "error";
      break;
  }
}

function rainfall(weather, wind, temperature) {
  let type = new Object();
  type.snow = 0;
  type.rain = 0;
  type.sand = 0;
  type.squall = 0;
  type.mist = 0;
  type.storm = 0;
  type.drizzle = 0;
  type.rainsnow = 0;
  type.grad = null;
  type.hard_wind = wind >= 15 ? 1 : 0
  type.hard_heat = (dateNow.getMonth() >= 3 && dateNow.getMonth() <= 8 && temperature >= 40) ? 1 : 0
  type.hard_frost = ((dateNow.getMonth() >= 9 || dateNow.getMonth() <= 2) && temperature <= -35) ? 1 : 0

  for (let i = 0; i < weather.length; i++) {
    if (weather[i].main == "Snow") type.snow = 1;
    if (
      weather[i].main == "Rain" ||
      (weather[i].id >= 200 && weather[i].id <= 202) ||
      (weather[i].id >= 230 && weather[i].id <= 232) ||
      (weather[i].id >= 310 && weather[i].id <= 314)
    )
      type.rain = 1;
    if (weather[i].main == "Sand, dust whirls" || weather[i].main == "Sand")
      type.sand = 1;
    if (weather[i].main == "Squalls") type.squall = 1;
    if (
      weather[i].main == "Mist" ||
      weather[i].main == "Fog" ||
      weather[i].main == "Smoke"
    )
      type.mist = 1;
    if (weather[i].main == "Thunderstorm") type.storm = 1;
    if (
      weather[i].main == "Drizzle" ||
      (weather[i].id >= 230 && weather[i].id <= 232)
    )
      type.drizzle = 1;
    if (weather[i].id == 615 || weather[i].id == 616) type.rainsnow = 1;
  }
  return type;
}

function amount_rainfall(weather) {
  let type = new Object();
  type.from = 0;
  type.to = 0;
  for (let i = 0; i < weather.length; i++) {
    if (
      weather[i].id == 200 ||
      weather[i].id == 310 ||
      weather[i].id == 500 ||
      weather[i].id == 520 ||
      weather[i].id == 615
    ) {
      // light rain
      type.from += 0;
      type.to += 1;
    }
    if (
      weather[i].id == 201 ||
      weather[i].id == 311 ||
      weather[i].id == 501 ||
      weather[i].id == 511 ||
      weather[i].id == 521 ||
      weather[i].id == 531 ||
      weather[i].id == 616
    ) {
      // moderate rain
      type.from += 1;
      type.to += 4;
    }
    if (
      weather[i].id == 202 ||
      weather[i].id == 312 ||
      weather[i].id == 313 ||
      weather[i].id == 502
    ) {
      // heavy intensity rain
      type.from += 4;
      type.to += 16;
    }
    if (weather[i].id == 314 || weather[i].id == 503) {
      // very heavy rain
      type.from += 16;
      type.to += 50;
    }
    if (weather[i].id == 504) {
      // extreme rain
      type.from += 50;
      type.to += 2500; // нет верхней границы
    }

    if (weather[i].id == 600 || weather[i].id == 620) {
      // light show
      type.from += 0;
      type.to += 0.5;
    }
    if (
      weather[i].id == 601 ||
      weather[i].id == 611 ||
      weather[i].id == 615 ||
      weather[i].id == 616 ||
      weather[i].id == 621
    ) {
      // snow
      type.from += 0.5;
      type.to += 5;
    }
    if (weather[i].id == 602 || weather[i].id == 612 || weather[i].id == 622) {
      // heavy snow
      type.from += 5;
      type.to += 1000; //нет верхней границы
    }
  }
  return type;
}

function cloudness(percent) {
  switch (true) {
    case percent < 11: // 800
      return "not";
      break;
    case percent >= 11 && percent <= 50: // 801 802
      return "light";
      break;
    case percent > 50: // 803 804
      return "heavy";
      break;

    default:
      console.log("ERROR cloudness OWM");
      return "error";
      break;
  }
}

function daytime(time) {
  if (time.getHours() >= 12 && time.getHours() <= 23) return "day";
  return "night";
}

function wind_gust(gust) {
  if (gust == undefined) return -1;
  return gust;
}

function date() {
  return {
    date_start: dateNow,
    date_end: new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), dateNow.getHours() + 1, 0, 0, 000),
    type_day: (dateNow.getHours() >= 12 && new Date().getHours() <= 23) ? "day" : "night"
  }
}

function analyzeData(newdata, newlat, newlon, id_source) {
  let dataNow = new Object();
  dataNow.id_source = id_source;
  dataNow.lat = newlat;
  dataNow.lon = newlon;
  dataNow.date = date();
  dataNow.temperature = newdata.main.temp;
  dataNow.wind_speed = new Object();
  dataNow.wind_speed.from = newdata.wind.speed;
  dataNow.wind_speed.to = newdata.wind.speed;
  dataNow.wind_gust = wind_gust(newdata.wind.gust);
  dataNow.amount_rainfall = amount_rainfall(newdata.weather);
  dataNow.rainfall = rainfall(newdata.weather, Math.max(dataNow.wind_speed.from, dataNow.wind_speed.to, dataNow.wind_gust), dataNow.temperature);

  // dataNow.wind_direction = wind_direction(newdata.wind.deg);
  // dataNow.pressure = newdata.main.pressure/1.333;
  // dataNow.rainfal_strength = уточнить
  // dataNow.cloudness = cloudness(newdata.clouds.all);
  // dataNow.humidity = newdata.main.humidity;

  return dataNow
}

function getforecast(url_api, newlat, newlon, id_source) {
  return axios({
    method: "get",
    url: url_api, // "http://api.openweathermap.org/data/2.5/weather"
    headers: {
      "x-api-key": "a1cf5b1ea3d4bf31d2838ed521148428"
    },
    params: {
      // APPID: "a1cf5b1ea3d4bf31d2838ed521148428",
      lat: newlat,
      lon: newlon,
      units: "metric"
      //lang: "ru"
    }
  })
    .then(res => {
      return analyzeData(res.data, newlat, newlon, id_source);
    })
    .catch(err => console.log(err));
}

module.exports.getforecast = getforecast;
