const express = require('express')
const router = express.Router()
const axios = require('axios')
const thus = require('../../thus')
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
    //copied over from users
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
    try {
        const { userId } = req.body

        const tarotRadix = thus.makeTarotRadix()
        const userStockSymbolList = await thus.makeUserStockSymbolList(userId)
        const userStocksArnOscRanked = await thus.makeUserStocksArnOscRanked(userStockSymbolList)


        // const frontDeck = makeFrontDeck(stockId, tarotRadix)
        // const dbDeck = makeDbDeck(userId, tarotRadix)
        res.json(userStocksArnOscRanked)

        // const userId = req.body.id

        // const userStockList = await getUserStockList(userId)

        // const ratedStockList = await getRatedStockList(userStockList) //note this is an array of objects

        // const drawInfoAndSentiment = await getDrawInfoAndSentiment() note: return a bunch of things in an object incl sentimentScore
        //second note: in 1.1 this will also return the three card thoughts or possibly the finished paragraph version of this

        // const pickedStock = await pickStock(ratedStockList, drawInfoAndSentiment.sentimentScore) //note: this is an array of either just the string and bool or the object version of this

        /*

        const createdDraw = {
            userID: userId,
            drawInfoAndSentiment.
                firstRank and R
                secondRank and R
                thirdRank and R
                pickedStock: pickedStock.symbol
                and R
        }

        */

        /*
        const newDraw = await Draw.create(createdDraw, {
            createdAt: ??,
            updatedAt: ??
            //these might happen auto - check
        })
        */

        /*

        const frontendDrawInfo = {
            newDraw.
                firstRank and R
                secondRank and R
                thirdRank and R
                pickedStock: pickedStock.symbol
                and R
            //eventually, the text stuff
            //OTHER NOTE - this infor could be pulled as the last version of the crated object as well
        }

        */

        // res.json(frontendDrawInfo)












        // const draw = await Draw.create(req.body)
        // res.json(draw)
    } catch (error) {
        res.json({error: error.message})
    }
})



module.exports = router