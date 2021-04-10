const express = require('express')
const router = express.Router()
const thus = require('../../thus')
const  { User, Stock, Draw } = require('../models/')
// const models = require('../models/models')

router.get('/', async (req, res) => {
    const stocks = await Stock.findAll({
        include: [
            {
                model: User, 
                as: 'users',
                attributes: ['id', 'email'],
                through: {
                    attributes: []
                }
            },
            {
                model: Draw, 
                as: 'draws',
                attributes: ['id', 'userId', 'pickedStockReversed'],
            },

        ]
    })
    res.json(stocks)

    //testing the new IEX platform:
    // const { symbol } = req.body
    // try {
    //     const stock = await thus.retrieveStockName(symbol)
    //     res.json({
    //         symbol: symbol,
    //         stockName: stock
    //     })
    // } catch (error) {
    //     res.json({error: error.message})
    // }
})

router.get('/:id', async (req, res) => {
    const stock = await Stock.findByPk(req.params.id, 
        {
            include: [
                {
                    model: User, 
                    as: 'users',
                    attributes: ['id', 'email'],
                    through: {
                        attributes: []
                    }
                }
            ]
        })
    res.json(stock)
})



// router.post('/', async (req, res) => {
//     try {
//         const {symbol} = req.body
//         const stocks = await thus.makeLocalStockList()
//         if (!stocks.includes(symbol)) {

//             const name = await thus.retrieveStockName(symbol)
//             if (!name) {
//                 res.json('Stock does not exist')
//             } else {

//                 const stock = await Stock.create({
//                     symbol: symbol,
//                     name: name
//                 })
//                 const newStockList = await thus.makeLocalStockList()
//                 res.json(newStockList)
//             }
//         } else {

//             res.json('Stock exists in list: ' + stocks)
//         }

//     } catch (error) {
//         res.json({error: error.message})
//     }
// })



module.exports = router