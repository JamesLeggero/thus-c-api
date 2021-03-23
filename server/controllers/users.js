const express = require('express')
const router = express.Router()
const  { User, Stock } = require('../models/')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: [
            {
                model: Stock
            }
        ]
    })
    res.json(users)
})

router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.json(user)
    } catch (error) {
        res.json({error: error.message})
    }
})



module.exports = router