const express = require('express')
const router = express.Router()
const  { User, Stock, Draw, UserStocks } = require('../models/')

router.get('/', async (req, res) => {
    try {
        
        const users = await User.findAll({
            include: [
                { 
                    model: Draw, 
                    as: 'draws',
                    attributes: ['createdAt', 'pickedStock']
                },
                {
                    model: Stock, 
                    as: 'stocks',
                    attributes: ['symbol', 'name'],
                    through: {
                        attributes: []
                    }
                }
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
        //BIG NOTE YOU MIGHT BE MOVING THIS TO DRAWS and /draws/:id
        //or maybe users/:id/draws
        // get personal user stock list

        /* make a call to alphavantage for each stock in stock list to get whatever numbers youll use for sentiment analysis
        these should be objects so you can rank by whatever criteria (SMA, for example)
        */

        /* tarot reading. This is going to return back:
        each rank and reverse, the sentiment number (note - should you analyze sent afterewards?) and in 1.1, a random saying from each card. I think tarem has a version of this*/

        /*
        we'll create a new entry in draws and res.json some of that info to the front end. from draws:
            firstRank and R
            secondRank and R
            thirdRank and R
            pickedStock and R

        of course, we have to figure out the pickedStock string and maybe think about adding the sentiment to the draws, possibly.

        */


        // const userStock = await UserStocks.create({
        //     userId: req.params.id,
        //     stockId: req.body.stockId
        // })
        // res.json(userStock)
    } catch (error) {
        res.json({error: error.message})
    }
})





module.exports = router