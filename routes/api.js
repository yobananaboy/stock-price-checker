/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const asyncHandler = require('express-async-handler')

var StockHandler = require('../controllers/StockHandler.js');


const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  var stockHandler = new StockHandler();
  
  app.route('/api/stock-prices')
    .get(asyncHandler(async(req, res) => {
      let stock = req.query.stock;      
      let like = req.query.like || false;
      let ip = req.ip || 0;
      
      
      const getStock = async(stock) => {
        let stockData = await stockHandler.fetchStock(stock);
        return stockData;
      }
    
      const addLike = async(stock, db, ip) => {
        let likes = await stockHandler.addLike(stock, db, ip);
        return likes;
      }
      
      const findLikes = async(stock, db, ip) => {
        let likes = await stockHandler.findLikes(stock, db, ip);
        return likes;
      }

      const getSingleStock = async(stock, like, db, ip) => {
        // get stock data
        let stockData = await getStock(stock);
        // if like then add like
        if(like) {
          let likes = await addLike(stock, db, ip);
          stockData.likes = likes;
        }
        return stockData;
      }
    
      const getEachStock = async(stocks, like, db, ip) => {
        let arr = [];
        for (const stock of stocks) {
          arr.push(await getStock(stock.toUpperCase(), db, ip));
        }
        return arr;
      }
    
      const getEachLike = async(stocks, db, ip) => {
        for (const stock of stocks) {
          stock.likes = await findLikes(stock.stock, db, ip);
        }
        return stocks;
      }
    
      
      const getMultipleStocks = async(stocks, like, db, ip) => {
        let stockData = [];
        let likes = [];
        stockData = await getEachStock(stocks, db, ip);
        if(like) {
          stockData = await getEachLike(stockData, db, ip);
          stockData = stockHandler.compareLikes(stockData);
        }
        return stockData;
      }
    
      const client = await MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true });
      const db = client.db(process.env.DB_NAME);
        
        let result;
    
        // if single stock
        if(!Array.isArray(stock)) {
          try {
            result = await getSingleStock(stock.toUpperCase(), like, db, ip)  
          }
          catch(e) {
            console.log(e);
            result = "Could not load data";
          }
        }
        // if two stocks
        else if (Array.isArray(stock) && stock.length === 2) {
          try {
            result = await getMultipleStocks(stock, like, db, ip);  
          }
          catch(e) {
            console.log(e);
            result = "Could not load data";
          }
        }
        res.json(result);
        client.close();
      }));
          
};
