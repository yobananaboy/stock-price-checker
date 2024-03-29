# Stock Price Checker

A simple API for getting and comparing stock prices, and for liking stocks.

## User stories

1. Set the content security policies to only allow loading of scripts and css from your server.
2. I can **GET** /api/stock-prices with form data containing a Nasdaq stock ticker and recieve back an object `stockData`.
3. In `stockData`, I can see the stock(string, the ticker), price(decimal in string format), and likes(int).
4. I can also pass along field like as true(boolean) to have my like added to the stock(s). Only 1 like per ip should be accepted.
5. If I pass along 2 stocks, the return object will be an array with both stock's info but instead of likes, it will display rel_likes(the difference between the likes on both) on both.
6. All 5 functional tests are complete and passing.

### Example usage:
`/api/stock-prices?stock=goog`
`/api/stock-prices?stock=goog&like=true`
`/api/stock-prices?stock=goog&stock=msft`
`/api/stock-prices?stock=goog&stock=msft&like=true`

### Example return:
`{"stockData":{"stock":"GOOG","price":"786.90","likes":1}}`
`{"stockData":[{"stock":"MSFT","price":"62.30","rel_likes":-1},{"stock":"GOOG","price":"786.90","rel_likes":1}]}`