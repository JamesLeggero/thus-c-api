require('dotenv').config()
const express = require('express')
const path = require ('path')
// const db = require('./server/models')
// const db = require('./server/config/db')
const schedule = require('node-schedule')
const cors = require('cors')
const Sequelize = require('sequelize')
const passport = require('./server/config/passport')()
const { sequelize } = require('./server/models')
const thus = require('./thus')


const { PG_URI } = process.env


const PORT = process.env.PORT || 3001

const db = new Sequelize(PG_URI)

const app = express()
app.use(cors())
app.use(express.json( { extended: false } ))
app.use(passport.initialize())

app.use('/api/users', require('./server/controllers/users'))
app.use('/api/stocks', require('./server/controllers/stocks'))
app.use('/api/draws', require('./server/controllers/draws'))
app.use('/api/userstocks', require('./server/controllers/userStocks')) //watch out here



// db.sequelize.sync({
//     // logging: false,
//     force: false,
//     logging: false
//   }).then(() => {
//       app.listen(PORT, () => {
//           console.log("App listening on PORT " + PORT);
//       });
//   });


    try {
        sequelize.authenticate()
        console.log('Connection to db made')
        const rule = new schedule.RecurrenceRule()
        rule.hour = 6
        
        const job = schedule.scheduleJob(rule, async function(){
            const stocks = await thus.makeLocalStockList()
            const updatedAroons = await thus.updateAroonOscs(stocks)
            const updateObject = {}
            for (let i = 0; i < updatedAroons.length; i++) {
                updateObject[updatedAroons[i].symbol] = updatedAroons[i].aroonOsc
            }
            console.log(updateObject)
        })
        
        app.listen(PORT, () => {
            console.log('App listening on port ' + PORT)
        })
        
    } catch (error) {
        console.error('error:', error)




}
