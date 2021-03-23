require('dotenv').config()
const axios = require('axios')
const { Stock } = require('./server/models')
// const db = require('./server/config/config')
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
        return localStockList
    }

}

module.exports = thus