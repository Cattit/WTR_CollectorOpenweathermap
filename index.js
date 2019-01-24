var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var morgan = require('morgan')
const axios = require("axios")
let dal = require ('wtr-dal'); 

const db = require('./db')
var app = express()
app.use(cors())
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(3002, function(){
  console.log("PORT 3002!")
})

let getData = require("./data/owm.js"); 
getData.getforecast(52.29778, 104.29639);