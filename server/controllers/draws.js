const express = require('express')
const router = express.Router()
const axios = require('axios')
const thus = require('../../thus')
const  { Draw } = require('../models/')
const { so } = require('stopword')

const { makeTarotRadix, makeUserStockList, makeSortedStocks } = thus


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
        const { userId } = req.body

        const tarotRadix = makeTarotRadix()
        const userStockList = await makeUserStockList(userId)
        const sortedStocks = await makeSortedStocks(userStockList)
        
        // const userStockSymbolList = await thus.makeUserStockSymbolList(userId)
        // const userStocksArnOscRanked = await thus.makeUserStocksArnOscRanked(userStockSymbolList)
        const drawnDeck = thus.drawCards(tarotRadix)
        const tarotSentiment = thus.determineTarotSentiment(drawnDeck, tarotRadix)


        // const frontDeck = makeFrontDeck(stockId, tarotRadix)
        // const dbDeck = makeDbDeck(userId, tarotRadix)
        const pickedStock = await thus.pickStock(sortedStocks, tarotSentiment)
        
       
        res.json(pickedStock)

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