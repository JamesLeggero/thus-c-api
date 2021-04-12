// 'use strict';
// require('dotenv').config()

// const { PG_URI } = process.env

// const Sequelize = require('sequelize')
// const sequelize = new Sequelize(PG_URI)

// const db = {}

// db.Sequelize = Sequelize
// db.sequelize = sequelize

// db.user = require('../models/user.js')
// db.stock = require('../models/stock.js')
// db.draw = require('../models/draw.js')

// db.user.belongsToMany(db.stock, {through: 'UserStocks'})
// db.user.hasMany(db.draw)
// db.stock.belongsToMany(db.user, {through: 'UserStocks'})
// db.draw.belongsTo(db.user)

// module.exports = db