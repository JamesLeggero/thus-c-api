require('dotenv').config()
const express = require('express')
const path = require ('path')
// const db = require('./server/models')
// const db = require('./server/config/db')
const Sequelize = require('sequelize')
const { sequelize } = require('./server/models')

const { PG_URI } = process.env


const PORT = process.env.PORT || 3001

const db = new Sequelize(PG_URI)

const app = express()
app.use(express.json( { extended: false } ))

app.use('/api/users', require('./server/controllers/users'))
app.use('/api/stocks', require('./server/controllers/stocks'))

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
    app.listen(PORT, () => {
            console.log('App listening on port ' + PORT)
        })
    
} catch (error) {
    console.error('error:', error)

}
