const axios = require("axios")
let dal = require ('wtr-dal') 

function wind_direction(degree){
  switch(true){
    case ((degree>=337.5 && degree<=359)||(degree>=0 && degree<22.5)):
      return "n"
      break
    case (degree>=22.5 && degree<67.5):
      return "ne"
      break
      case (degree>=67.5 && degree<112.5):
      return "e"
      break
    case (degree>=112.5 && degree<157.5):
      return "se"
      break
    case (degree>=157.5 && degree<202.5):
      return "s"
      break
    case (degree>=202.5 && degree<247.5):
      return "sw"
      break
    case (degree>=247.5 && degree<292.5):
      return "w"
      break   
    case (degree>=292.5 && degree<337.5):
      return "nw"
      break 
    default:
      console.log("ERROR wind_direction OWM")
      return "error"
      break
  }
}

function rainfall(weather){
  let type = new Object();
  type.snow = "not";
  type.rain = "not";
  type.sand = "not";
  type.squalls = "not";
  type.mist = "not";
  type.storm = "not";
  type.drizzle = "not";
  type.rainsnow = "not";

  for (let i = 0; i<weather.length; i++){
    if (weather[i].main == "Snow")
      type.snow = "yes"
    if (weather[i].main == "Rain")
      type.rain = "yes"
    if (weather[i].main == "Sand, dust whirls" || weather[i].main =="Sand")
      type.sand = "yes"
    if (weather[i].main == "Squalls")
      type.squalls = "yes"
    if (weather[i].main == "Mist" || weather[i].main == "Fog" || weather[i].main == "Smoke")
      type.mist = "yes"
    if (weather[i].main == "Thunderstorm")
      type.storm = "yes"
    if (weather[i].main == "Drizzle")
      type.drizzle = "yes" 
    if (weather[i].id == 615 || weather[i].id == 616)
      type.rainsnow = "yes"   
  }
  return type
}

function cloudness(percent){
  switch(true) {
    case (percent<11): // 800
      return "not" 
      break
    case (percent>=11 && percent<=50): // 801 802
      return "light" 
      break   
    case (percent>50):  // 803 804
      return "heavy" 
      break 

    default:
      console.log("ERROR cloudness OWM")
      return "error"
      break
  }
}

function daytime(time){
  if (time.getHours()>=12 && time.getHours()<=23)
    return "day"
  return "night"
}

function analyzeData(newdata, newlat, newlon){
  let dataNow = new Object();
  dataNow.lat = newlat;
  dataNow.lon = newlon;  
  dataNow.date = new Date(); //newdata.dt ! уточнить
  dataNow.daytime = daytime(new Date());
  dataNow.temperature = newdata.main.temp;
  dataNow.wind_speed = newdata.wind.speed;
  dataNow.wind_gust = newdata.wind.gust; // ! часто отсутствуют
  // dataNow.wind_direction = wind_direction(newdata.wind.deg);
  // dataNow.pressure = newdata.main.pressure/1.333;
  dataNow.rainfall = rainfall(newdata.weather);
  // dataNow.rainfal_strength = уточнить
  // dataNow.cloudness = cloudness(newdata.clouds.all); 
  // dataNow.humidity = newdata.main.humidity;
  console.log(dataNow); 

  dal.saveNowData(dataNow) 
}

function getforecast(newlat, newlon) {
    axios({
      method: "get", 
      url: "http://api.openweathermap.org/data/2.5/weather",
      headers: {
        "x-api-key": "a1cf5b1ea3d4bf31d2838ed521148428"
      },
      params: {
       // APPID: "a1cf5b1ea3d4bf31d2838ed521148428",
        lat: newlat, 
        lon: newlon,
        units: "metric",
        //lang: "ru"
      }
    })
      .then(res => {
        console.log(res.data);
        analyzeData(res.data, newlat, newlon);
      })
      .catch(err => console.log(err));
  }
  
  module.exports.getforecast = getforecast;