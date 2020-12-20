var express = require('express');
var mySQL = require('./mySQLDAO');
const mongoDAO = require('./mongoDAO');
var bodyParser = require('body-parser');
const { body, validationResult, check } = require('express-validator');
const { request } = require('express');
const { createPool } = require('promise-mysql');

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}))

var cb = function(){
    console.log("Listening on port 3000")
}

app.get('/', (req, res)=> {
    res.sendFile(__dirname + "/views/links.html")
})

// Displays country data from the server to the page
app.get('/countries', (req, res)=> {
    mySQL.getCountry()
    .then((result)=>{
        res.render('showCountries', {countries:result})
    })
    .catch((error)=>{
        res.send(error)
    })
})

// Displays city data from the server to the page
app.get('/cities', (req, res)=> {
    mySQL.getCity()
    .then((result)=>{
        res.render('showCities', {cities:result})
    })
    .catch((error)=>{
        res.send(error)
    })
})

// Displays state data from the server to the page
app.get('/state', (req, res)=>{
    mongoDAO.getStates()
    .then((documents)=>{
        res.render("showState", {states:documents})
    })
    .catch((error)=>{
        res.send(error)
    })
})

// Add country method
app.get('/addCountry', (req, res) => {
    res.render("addCountry", {errors:undefined, 
        co_code: "", 
        co_name: "", 
        co_details:""})
})

// Sending new country data back to the server
app.post('/addCountry', 
[check('code').isLength({min:3}).withMessage("Country Code must be 3 characters"), 
check('name').isLength({min:3}).withMessage("Country Name must be at least 3 characters")
//('code').equals("code").withMessage("Country already Exists")
],
(req, res)=>{
    var errors = validationResult(req)
  
        if(!errors.isEmpty()){
            res.render("addCountry", {errors:errors.errors,
                co_code:req.body.code,
                co_name:req.body.name,
                co_details:req.body.details
            })
        } else {
            console.log(req.body)
            mySQL.addCountry(req.body.code, req.body.name, req.body.details)
            res.send(req.body.name + " has been added!<a href='/'>Home</a>")
        }
 })

 // Edit Country method
 app.get('/editCountry/:country', (req, res)=>{
     mySQL.getCountryDetails(req.params.country)
     .then((result)=>{
        res.render("editCountry", {
            co_code: result[0].co_code,
            co_name: result[0].co_name,
            co_details: result[0].co_details
        })
     })
     .catch((error)=>{
         console.log(error)
         res.send(error)
     })
 })

 // Sends updated country data back to the server
app.post('/editCountry', (req, res)=>{
    mySQL.editCountry(req.body.code, req.body.name, req.body.details)
    .then((result)=>{
        console.log(req.body)
        res.send("<h1>Country " + req.body.code + " has been updated</h1> <a href='/'>Home</a>")
    })
    .catch((error)=>{
        res.send(error)
    })
})

 // Delete Country method
 app.get('/deleteCountry/:country', (req, res)=>{
     mySQL.deleteCountry(req.params.country)
        .then((result)=>{
            res.send("<h1>"+ req.params.country + " has been deleted</h1><a href='/'>Home</a>")
        })
        .catch((error)=>{
            console.log("Cannot delete country")
            res.send("<h1>Error Message " + req.params.country + " has cities, it cannot be deleted</h1><a href='/'>Home</a>")
        })
 })

// Display city details in text boxes
 app.get('/showCityDetails/:city', (req, res)=>{
    mySQL.getCityDetails(req.params.city)
    .then((result)=>{
       res.render("showCityDetails", {
           cty_code: result[0].cty_code,
           cty_name: result[0].cty_name,
           population: result[0].population,
           isCoastal: result[0].isCoastal,
           areaKM: result[0].areaKM,
           co_code: result[0].co_code,
           co_name: result[0].co_name
       })
    })
    .catch((error)=>{
        console.log(error)
        res.send(error)
    })
})


// Add country method
app.get('/addState', (req, res) => {
    res.render("addState", {errors:undefined, 
        _id: "", 
        headOfState: ""})
})

//Returns newly added state to the database
app.post('/addState', 
[check('_id').isLength({min:3}).withMessage("Country Code must be 3 characters"), 
check('name').isLength({min:3}).withMessage("Head of State must be at least 3 characters")
],
(req, res)=>{
    var errors = validationResult(req)
  
        if(!errors.isEmpty()){
            res.render("addState", {errors:errors.errors,
                _id:req.body._id,
                headOfState:req.body.name
            })
            
        } else {
            mongoDAO.addStates(req.body._id, req.body.name)
            console.log(req.body)
            res.send(req.body.name + " has been added! <a href='/'>Home</a>")
        }
 })

app.listen(3000, cb)



