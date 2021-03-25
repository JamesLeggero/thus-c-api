const express = require('express')
const router = express.Router()
const  { Draw } = require('../models/')

router.get('/', async (req, res) => {
    try {
        
        const draws = await Draw.findAll({

        })
        res.json(draws)
    } catch (error) {
        res.json({error: error.message})
    }
})

router.get('/:id', async (req, res) => {
    try {
        const draw = await Draw.findByPk(req.params.id)
        res.status(200).json(draw)
    } catch (error) {
        res.json({error: error.message})
    }
})

router.post('/', async (req, res) => {
    try {
        const draw = await Draw.create(req.body)
        res.json(draw)
    } catch (error) {
        res.json({error: error.message})
    }
})



module.exports = router