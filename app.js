require('dotenv').config()
const express = require('express')
const path = require ('path')
const db = require('./server/models')


const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json( { extended: false } ))

app.use('/api/users', require('./server/controllers/users'))
app.use('/api/stocks', require('./server/controllers/stocks'))

db.sequelize.sync({
    // logging: false,
    force: false,
    logging: false
  }).then(() => {
      app.listen(PORT, () => {
          console.log("App listening on PORT " + PORT);
      });
  });
