/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    const query1 = 'goog';
    const query2 = 'msft';
    let stock1Likes;
    let stock2Likes;
  
    suite('GET /api/stock-prices => stockData object', function() {
      // delay api calls because alphavantage limits to 5 api calls each minute
      beforeEach(function(done) {
        this.timeout(650000);
        setTimeout(done, 60000);
      });

      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: query1})
        .end((err, res) => {
         
          assert.equal(res.status, 200);
          assert.equal(res.body.stock, "GOOG", "Stock is Google");
          assert.isString(res.body.price, "Price is string");
          
          done();
        });
      });
            
      test('1 stock with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: query1, like: true})
          .end((err, res) => {
            
            assert.equal(res.status, 200);
            assert.equal(res.body.stock, "GOOG", "Stock is Google");
            assert.isString(res.body.price, "Price is string");
            assert.isNumber(res.body.likes, "Likes is a number");
          
            stock1Likes = res.body.likes;
          
            done();
        });
      });
      
      test('1 different stock with like', function(done) {
        // add delay because alphavantage limits to 5 api calls a minute
          chai.request(server)
          .get('/api/stock-prices')
          .query({stock: query2, like: true})
          .end((err, res) => {
            
            assert.equal(res.status, 200);
            assert.equal(res.body.stock, "MSFT", "Stock is Microsoft");
            assert.isString(res.body.price, "Price is string");
            assert.isNumber(res.body.likes, "Likes is a number");
          
            stock2Likes = res.body.likes;
          
            done();
          });
      });
        
        test('1 stock with like again (ensure likes arent double counted)', function(done) {
        
          chai.request(server)
            .get('/api/stock-prices')
            .query({stock: query2, like: true})
            .end((err, res) => {

              assert.equal(res.status, 200);
              assert.equal(res.body.stock, "MSFT", "Stock is Microsoft");
              assert.isString(res.body.price, "Price is string");
              assert.isNumber(res.body.likes, "Likes is a number");
              assert.equal(res.body.likes, stock2Likes + 1, "Likes will have increased by 1");

              stock2Likes = res.body.likes;

              done();
            });
      });
      
      test('2 stocks', function(done) {
        
          chai.request(server)
            .get('/api/stock-prices')
            .query({stock: [query1, query2]})
            .end((err, res) => {

              assert.equal(res.status, 200);
              console.log(res.body);
              assert.isArray(res.body, "Body is an array");
              assert.equal(res.body.length, 2, "Array length should be 2");
              assert.equal(res.body[0].stock, "GOOG", "First stock is Google");
              assert.equal(res.body[1].stock, "MSFT", "Second stock is Microsoft");
              assert.isString(res.body[0].price, "Price is string");
              assert.isString(res.body[1].price, "Price is string");

              done();
            });        
      });
        
      test('2 stocks with like', function(done) {
          chai.request(server) 
            .get('/api/stock-prices')
            .query({stock: [query1, query2], like: true})
            .end((err, res) => {

              assert.equal(res.status, 200);
              console.log(res.body);
              assert.isArray(res.body, "Body is an array");
              assert.equal(res.body.length, 2, "Array length should be 2");
              assert.equal(res.body[0].stock, "GOOG", "First stock is Google");
              assert.equal(res.body[1].stock, "MSFT", "Second stock is Microsoft");
              assert.isString(res.body[0].price, "Price is string");
              assert.isString(res.body[1].price, "Price is string");
              assert.equal(res.body[0].rel_likes, stock1Likes - stock2Likes, "Relative likes are correct");
              assert.equal(res.body[1].rel_likes, stock2Likes - stock1Likes, "Relative likes are correct");

              done();

          });
      });
      
    });

});
