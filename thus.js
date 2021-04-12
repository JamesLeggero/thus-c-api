require('dotenv').config()
const axios = require('axios')

const { Stock, UserStocks } = require('./server/models')
// const db = require('./server/config/config')
const sentiment = require('sentiment')
const tarot = require('tarot-deck')
const Analyzer = require('natural').SentimentAnalyzer;
const stemmer = require('natural').PorterStemmer;

const ALPHA = process.env.ALPHAVANTAGE_API
const IEX_SP = process.env.IEX_SANDBOX_PUBLIC



const thus = {
    retrieveStockName: async stockSymbol => {
        const response = await axios.get(`https://sandbox.iexapis.com/stable/stock/${stockSymbol}/quote?token=${IEX_SP}`)
        const data = response.data
        const company = data.companyName
        return company
    },
    getInitialAroonOsc: async symbol =>{
        const initalAroonResponse = await axios.get(`https://sandbox.iexapis.com/stable/stock/${symbol}/indicator/aroonosc?range=ytd&lastIndicator=true&indicatorOnly=true&token=${IEX_SP}`)
        const initialAroonOsc = initalAroonResponse.data.indicator[0][0]
        return initialAroonOsc   
    },
    makeLocalStockList: async () => {
        const localStockList = []
        const stocks = await Stock.findAll({})
        for (let i = 0; i < stocks.length; i++) {
            localStockList.push(stocks[i].symbol)
        }
        return localStockList //array
    },
    updateAroonOscs: async localStockList => {
        const updatedAroons = []
        for (let i = 0; i < localStockList.length; i++) {
            const stockSymbol = localStockList[i]
            const newAroonResponse = await axios.get(`https://sandbox.iexapis.com/stable/stock/${stockSymbol}/indicator/aroonosc?range=ytd&lastIndicator=true&indicatorOnly=true&token=${IEX_SP}`)
            const updatedAroonOsc = newAroonResponse.data.indicator[0][0]
            const stockToUpdate = Stock.update({aroonOsc: updatedAroonOsc}, {
                where: {
                    symbol: stockSymbol
                }
            })
            updatedAroons.push([stockSymbol, updatedAroonOsc])
        }
        const updatedStockList = await Stock.findAll({
            attributes: ['symbol', 'aroonOsc']
        })
        return updatedStockList
    },
    //note - overload the other one but you can use this for now
    // makeLocalUserStockList: async user => {
    //     const localUserStockList = []
    //     const stocks = await UserStocks.findAll({
    //         where:
    //         //come back to this after you write userStock controller
    //     })
    // }
    
    makeTarotRadix: () => {
        
        const threeBooleans = []
        const threeNumbers = []
        const tarotRadix = []

        while (threeNumbers.length < 3) {
            const num = Math.floor(Math.random() * 22)
            if (threeNumbers.includes(num)) {
                continue
            }
            threeNumbers.push(num)
        }
        for (let i = 0; i < 3; i++) {    
                threeBooleans.push(Math.random() >= 0.5)
        }
        for (let i = 0; i < 3; i++) {
            tarotRadix.push([threeNumbers[i], threeBooleans[i]])
        }

        return tarotRadix
    },
    makeUserStockSymbolList: async userId => {
        const userStockIdList = []
        const userStockSymbolList = []
        const fullUserStockList = await UserStocks.findAll({
            where: {
                userId: userId
            }
        })
        for (let i = 0; i < fullUserStockList.length; i++) {
            userStockIdList.push(fullUserStockList[i].stockId)
        }
        for (let i = 0; i < userStockIdList.length; i++) {
            const newStockSymbol = await Stock.findByPk(userStockIdList[i])
            userStockSymbolList.push(newStockSymbol.symbol)
        }
        return userStockSymbolList
    },
    makeUserStocksArnOscRanked: async userStockSymbolList => {
        const userStocksArnOscRanked = []
        for (let i = 0; i < userStockSymbolList.length; i++) {
            const stockObject = {}
            const stockSymbol = userStockSymbolList[i]
            const dbStock = await Stock.findOne({
                where: {
                    symbol: stockSymbol
                }
            })
            stockObject.symbol = stockSymbol
            stockObject.aroon = dbStock.aroonOsc
            userStocksArnOscRanked.push(stockObject)
        }
        userStocksArnOscRanked.sort((a,b) => a.aroon - b.aroon) //sorts second element of array

        //determine percentage out of 100 in line
        //there's some kludge in here because you dont actually want 50, 100, for example. you want 25 and 75
        for (let i = 0; i < userStocksArnOscRanked.length; i++) {
            userStocksArnOscRanked[i].percentage = Math.trunc(
                ((i  / userStocksArnOscRanked.length) * 100)
                + (100 / (userStocksArnOscRanked.length * 2))
            )
        }
        return userStocksArnOscRanked
    },
    drawCards: tarotRadix => {
        const drawnDeck = []
        for (let i = 0; i < 3; i++) {
            const card = tarot.getByRank(tarotRadix[i][0])
            const limitedCard = {}
            limitedCard.name = card.name
            limitedCard.meanings = card.meanings
            drawnDeck.push(limitedCard)

        }
        return drawnDeck
    },
    determineTarotSentiment: (drawnDeck, tarotRadix) => {
        let max = 0
        let min = 0
        let final = 0

        let lightMeanings = []
        let lightMeaningsSplit = []
        for (let i = 0; i < 3; i++) {
            lightMeanings.push(drawnDeck[i].meanings.light)
        }
        lightMeanings = lightMeanings.flat()
        for (let i = 0; i < lightMeanings.length; i++) {
            const words = lightMeanings[i]
            const wordsArr = words.split(' ');
            lightMeaningsSplit.push(wordsArr)
        }
        lightMeaningsSplit = lightMeaningsSplit.flat()

        const maxAnalyzer = new Analyzer("English", stemmer, "afinn")
        max = Math.trunc((maxAnalyzer.getSentiment(lightMeaningsSplit) * 100))

        let shadowMeanings = []
        let shadowMeaningsSplit = []
        for (let i = 0; i < 3; i++) {
            shadowMeanings.push(drawnDeck[i].meanings.shadow)
        }
        shadowMeanings = shadowMeanings.flat()
        for (let i = 0; i < shadowMeanings.length; i++) {
            const words = shadowMeanings[i]
            const wordsArr = words.split(' ');
            shadowMeaningsSplit.push(wordsArr)
        }
        shadowMeaningsSplit = shadowMeaningsSplit.flat()
        
        const minAnalyzer = new Analyzer("English", stemmer, "afinn")
        min = Math.trunc((minAnalyzer.getSentiment(shadowMeaningsSplit) * 100))

        let finalMeanings = []
        let finalMeaningsSplit = []
        for (let i = 0; i < 3; i++) {
            if (tarotRadix[i][1]){
                finalMeanings.push(drawnDeck[i].meanings.shadow)
            } else {
                finalMeanings.push(drawnDeck[i].meanings.light)
            }
        }
        finalMeanings = finalMeanings.flat()
        for (let i = 0; i < finalMeanings.length; i++) {
            const words = finalMeanings[i]
            const wordsArr = words.split(' ');
            finalMeaningsSplit.push(wordsArr)
        }
        finalMeaningsSplit = finalMeaningsSplit.flat()
        

        const everything = [
            drawnDeck[0].name,
            drawnDeck[1].name,
            drawnDeck[2].name,
            max,
            min,
            finalMeaningsSplit
        ]


        return everything
        
    }
}

module.exports = thus