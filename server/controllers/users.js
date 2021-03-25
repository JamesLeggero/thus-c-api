const express = require('express')
const router = express.Router()
const  { User, Stock, Draw, UserStocks } = require('../models/')

router.get('/', async (req, res) => {
    try {
        
        const users = await User.findAll({
            include: [
                { model: Draw , as: 'draws'},
                {model: Stock, as: 'stocks'}
            ]
        })
        res.json(users)
    } catch (error) {
        res.json({error: error.message})
    }
})

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        res.json({error: error.message})
    }
})

router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.json(user)
    } catch (error) {
        res.json({error: error.message})
    }
})

router.post('/:id', async (req, res) => {
    try {
        const userStock = await UserStocks.create({
            userId: req.params.id,
            stockId: req.body.stockId
        })
        res.json(userStock)
    } catch (error) {
        res.json({error: error.message})
    }
})





module.exports = router