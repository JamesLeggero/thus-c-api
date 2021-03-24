const express = require('express')
const router = express.Router()
const thus = require('../../thus')
const  { User, Stock } = require('../models/')
// const models = require('../models/models')

router.get('/', async (req, res) => {
    const stocks = await Stock.findAll({
    })
    res.json(stocks)
})

router.post('/', async (req, res) => {
    try {
        const {symbol} = req.body
        const stocks = await thus.makeLocalStockList()
        if (!stocks.includes(symbol)) {

            const name = await thus.retrieveStockName(symbol) 
            const stock = await Stock.create({
                symbol: symbol,
                name: name
            })
            const newStockList = await thus.makeLocalStockList()
            res.json(newStockList)
        } else {

            res.json('Stock exists in list: ' + stocks)
        }

    } catch (error) {
        res.json({error: error.message})
    }
})



module.exports = router