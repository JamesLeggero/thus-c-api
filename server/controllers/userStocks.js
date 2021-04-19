const express = require('express')
const router = express.Router()
const thus = require('../../thus')
const  { UserStocks, Stock } = require('../models/')

router.get('/', async (req, res) => {
    try {
        const userStocks = await UserStocks.findAll()
        res.json(userStocks)
    } catch (error) {
        res.json({error: error.message})
    }
})

router.get('/:userId/:stockId', async (req, res) => {
    try {
        const userStock = await UserStocks.findOne({
            where: {
                stockId: req.params.stockId,
                userId: req.params.userId
            }
        })
        res.json(userStock)
    } catch (error) {
        console.log({error: error.message})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        // console.log(req.query.id)
        const deletedUserStock = await UserStocks.destroy({
            where: {
                id: req.query.id
            }
        })
        // const deletedUserStock = userStockToDelete.destroy()
        res.status(200).json(deletedUserStock)
    } catch (error) {
        console.log({error: error.message})
    }
})

router.post('/', async (req, res) => {
    const { userId, symbol } = req.body
    const localStockList = await thus.makeLocalStockList()
    const userStockSymbolList = await thus.makeUserStockSymbolList(userId)
    if (userStockSymbolList.includes(symbol)) {
        res.json('already-present')
    } else {

    
        if (localStockList.includes(symbol)) {
            try {
            const stock = await Stock.findAll({
                where: {
                    symbol: symbol
                }
            })
            // console.log(stock[0].id)
            const userStock = await UserStocks.create({
                userId: userId,
                stockId: stock[0].id
            })
            res.json(userStock)

            } catch (error) {
                res.json({error: error.message})
            }  
        } else {
            try {
                const name = await thus.retrieveStockName(symbol)
                const aroonOsc = await thus.getInitialAroonOsc(symbol)
                const newStock = await Stock.create({
                    name: name,
                    symbol: symbol,
                    aroonOsc: aroonOsc
                })
                // const stock = await Stock.findAll({
                //     where: {
                //         symbol: symbol
                //     }
                // })
                const userStock = await UserStocks.create({
                    userId: userId,
                    stockId: newStock.id
                })
                res.json(userStock)
            } catch (error) {
                res.json({error: error.message})
            }
        }
    }
})

module.exports = router