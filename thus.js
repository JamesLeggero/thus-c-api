require('dotenv').config()
const axios = require('axios')

const { Stock, UserStocks } = require('./server/models')
// const db = require('./server/config/config')
// const sentiment = require('sentiment')
const tarot = require('tarot-deck')

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
    makeUserStocksArnOscRanked: async userStockSymbolList => {
        
        
        const userStocksArnOscRanked = []
        for (let i = 0; i < userStockSymbolList.length; i++) {
            const stockSymbol = userStockSymbolList[i]
            const dbStock = await Stock.findOne({
                where: {
                    symbol: stockSymbol
                }
            })
            userStocksArnOscRanked.push([stockSymbol, dbStock.aroonOsc])
        }

        userStocksArnOscRanked.sort(function(a,b){return a[1]-b[1]}) //sorts second element of array
        
        return userStocksArnOscRanked
    }
}

module.exports = thus