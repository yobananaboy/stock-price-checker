var axios = require('axios');

function StockHandler() {
  
  var url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=" + process.env.ALPHAVANTAGE_API;
  
  // get stock
  this.fetchStock = async (stock) => {
    let response = await axios.get(url + "&symbol=" + stock);
    let data = response.data;
    console.log(data);
    if(data) {
      return {
        stock: data["Global Quote"]["01. symbol"],
        price: data["Global Quote"]["05. price"]
      };
    }
  };
  
  // find likes
  this.findLikes = async (stock, db, ip) => {
    let response = await db.collection(ip).find({stock}).toArray();
    return response[0].likes;
  }
  
  // save likes
  this.saveLikes = async (stock, db, ip) => {
    let response = await db.collection(ip)
      .findOneAndUpdate(
        { stock },
        { $inc: { likes: 1 } },
        {upsert: true, returnOriginal: false }
      );
    return response;
  }
  
  // compare likes
  this.compareLikes = (stocks) => {
    stocks[0].rel_likes = stocks[0].likes - stocks[1].likes;
    stocks[1].rel_likes = stocks[1].likes - stocks[0].likes;
    
    delete stocks[0].likes;
    delete stocks[1].likes;
    
    return stocks;
  }
  
  this.addLike = async (stock, db, ip) => {
    let saveLikeData = await this.saveLikes(stock, db, ip);
    let likes = saveLikeData.value.likes;
    return likes;
  };

}

module.exports = StockHandler;