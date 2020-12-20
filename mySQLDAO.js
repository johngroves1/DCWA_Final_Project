var mysql = require ('promise-mysql');

var pool

mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'geography'
})
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log(error)
    })

var getCountry = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from country')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })

    })
}

var getCity = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from city')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })

    })
}

var addCountry = function (co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'insert into country values (?, ?, ?)',
            values: [co_code, co_name, co_details]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })

    })
}

var getCountryDetails = function (co_code) {
    return new Promise((resolve, reject) =>{
        var myQuery = {
            sql: 'select * from country where co_code = ? ',
            values: [co_code]
        }
        pool.query(myQuery)
        .then((result) =>{
            resolve(result)
        })
        .catch((error)=>{
            reject(error)
        })
    })
}

var getCityDetails = function (cty_code) {
    return new Promise((resolve, reject) =>{
        var myQuery = {
            sql: 'select * from city where cty_code = ? ',
            values: [cty_code]
        }
        pool.query(myQuery)
        .then((result) =>{
            resolve(result)
        })
        .catch((error)=>{
            reject(error)
        })
    })
}

var editCountry = function (co_code, co_name, co_details) {
    return new Promise((resolve, reject) =>{
        var myQuery = {
            sql: 'update country set co_name = ?, co_details = ? where co_code = ?',
            values: [co_name, co_details, co_code]
        }
        pool.query(myQuery)
        .then((result) =>{
            resolve(result)
        })
        .catch((error)=>{
            reject(error)
        })
    })
}

var deleteCountry = function(co_code){
    return new Promise((resolve, reject) =>{
        var myQuery = {
            sql: 'delete from country where co_code = ? ',
            values: [co_code]
        }
        pool.query(myQuery)
        .then((result) =>{
        
            resolve(result)

        })
        .catch((error)=>{
            reject(error)
        })
    })
}



module.exports = { getCountry, getCity, addCountry, getCountryDetails, editCountry, deleteCountry, getCityDetails}

