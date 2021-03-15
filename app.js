require('dotenv').config()
const express = require('express')
const path = require ('path')
const db = require('./server/models')

const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json( { extended: false } ))

db.sequelize.sync({
      force: true
  }).then(() => {
      app.listen(PORT, () => {
          console.log("App listening on PORT " + PORT);
      });
  });
