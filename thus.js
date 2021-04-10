require('dotenv').config()
const axios = require('axios')

const { Stock, UserStocks } = require('./server/models')
// const db = require('./server/config/config')
// const sentiment = require('sentiment')
const tarot = require('tarot-deck')

const ALPHA = process.env.ALPHAVANTAGE_API



const thus = {
    retrieveStockName: async stockSymbol => {
        const response = await axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stockSymbol}&apikey=${ALPHA}`)
        const data = response.data
        const company = data.Name
        return company
    },
    makeLocalStockList: async () => {
        const localStockList = []
        const stocks = await Stock.findAll({})
        for (let i = 0; i < stocks.length; i++) {
            localStockList.push(stocks[i].symbol)
        }
        return localStockList //array
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
            tarotRadix.push(threeNumbers[i], threeBooleans[i])
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
    makeUserStocksDmRanked: async userStockSymbolList => {
        const userStockDmRanked = []
        for (let i = 0; i < userStockSymbolList.length; i++) {
            const plusDiResponse = await axios.get(`https://www.alphavantage.co/query?function=PLUS_DI&symbol=${userStockSymbolList[i]}&interval=weekly&time_period=25&apikey=${ALPHA}`)
            userStockDmRanked.push(plusDiResponse.data)
        }
        return userStockDmRanked
    }
}

module.exports = thus