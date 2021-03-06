require('dotenv').config()
const axios = require('axios')

const { Stock, UserStocks } = require('./server/models')
// const db = require('./server/config/config')
const sentiment = require('sentiment')
const tarot = require('tarot-deck')
const SW = require('stopword')
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
    makeUserStockList: async userId => {
        const userStockList = []
        let allInfo = []
        if (userId === 0) {
            const allStocks = await Stock.findAll({})
            
            for (let i = 0; i < allStocks.length; i++) {
                const { id, symbol, aroonOsc } = allStocks[i]
                const stockObject = {
                    id: id,
                    symbol: symbol,
                    aroonOsc: aroonOsc
                }
                userStockList.push(stockObject)
            }
            return userStockList
        }
        const userStocks = await UserStocks.findAll({
            where: {
                userId: userId
            }
        })
        for (let i = 0; i < userStocks.length; i++) {
            const stockToAdd = await Stock.findOne({
                where: {
                    id: userStocks[i].stockId
                }
            })
            const {id, symbol, aroonOsc } = stockToAdd
            userStockList.push({id, symbol, aroonOsc})
        }
        return userStockList
        
        
    },
    makeSortedStocks: async userStockList => {
        const sortedStocks = userStockList
        sortedStocks.sort((a,b) => a.aroonOsc - b.aroonOsc) //sorts by aroon of each object in arr

        // determine percentage out of 100 in line
        // there's some kludge in here because you dont actually want 50, 100, for example. you want 25 and 75

        //note 210417 - you could also do a min max, al la:
        /*
        min:0, max:19
        min:20, max: 39,
        min:40, max: 59;
        min: 60, max:79,
        min:80, max:100

        we'll do this another time, maybe
        */
        for (let i = 0; i < sortedStocks.length; i++) {
            sortedStocks[i].percentage = Math.trunc(
                ((i  / sortedStocks.length) * 100)
                + (100 / (sortedStocks.length * 2))
            )
        }
        return sortedStocks
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
        const filteredLightMeanings = SW.removeStopwords(lightMeaningsSplit)

        const maxAnalyzer = new Analyzer("English", stemmer, "afinn")
        max = Math.trunc((maxAnalyzer.getSentiment(filteredLightMeanings) * 100))

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
        const filteredShadowMeanings = SW.removeStopwords(shadowMeaningsSplit)
        
        const minAnalyzer = new Analyzer("English", stemmer, "afinn")
        min = Math.trunc((minAnalyzer.getSentiment(filteredShadowMeanings) * 100))

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
        const filteredFinalMeanings = SW.removeStopwords(finalMeaningsSplit)

        const finalAnalyzer = new Analyzer("English", stemmer, "afinn")
        final = Math.trunc((finalAnalyzer.getSentiment(filteredFinalMeanings) * 100))

        let maxOffset = 0
        let minOffset = 0
        let finalOffset = 0
        if (min < 0) {
            maxOffset = max + Math.abs(min)
            finalOffset = final + Math.abs(min)
        } else if (min > 0) {
            maxOffset = max - Math.abs(min)
            finalOffset = final - Math.abs(min)
        } else {
            maxOffset = max
            finalOffset = final
        }
        
        const finalPercentage = Math.trunc((finalOffset / maxOffset) * 100)

        const everything = [
            drawnDeck[0].name, 
            tarotRadix[0][1] ? 'reversed' : 'upright',
            drawnDeck[1].name, 
            tarotRadix[1][1] ? 'reversed' : 'upright',
            drawnDeck[2].name, 
            tarotRadix[2][1] ? 'reversed' : 'upright',
            max,
            // filteredLightMeanings,
            min,
            // filteredShadowMeanings,
            final,
            filteredFinalMeanings,
            maxOffset,
            minOffset,
            finalOffset,
            finalPercentage
        ]
        
        return finalPercentage
        
    },
    pickStock: (sortedStocks, tarotSentiment) => {
        const pickedStock = []
        pickedStock.push(sortedStocks.reduce((prev, curr) => {
            return Math.abs(curr.percentage - tarotSentiment) < Math.abs(prev.percentage - tarotSentiment) ? curr : prev
        }))
        // pickedStock.push(pickedStock[0].aroonOsc < 0 ? 'reversed (true)' : 'upright (false)')
        return pickedStock[0]
    }
}

module.exports = thus