var express = require('express');

const app = express();

app.set('trust proxy', true);

const axios = require('axios');
const cors = require('cors');
var bodyParser = require('body-parser');
const date = require('date-and-time');

app.use(cors());

var jsonParser = bodyParser.json();

const { MongoClient, ObjectId} = require("mongodb");
const uri =  "mongodb+srv://sachinkoti123:Sdk1996@clusterhw3.71m5mf6.mongodb.net/?retryWrites=true&w=majority&appName=clusterHW3";


//company profile description
//finnhub api key: cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0
//https://finnhub.io/api/v1/stock/profile2?symbol=tsla&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0

app.post('/search/ticker', jsonParser ,function(req, exp_res){
    console.log(req.body.ticker);
    ticker = req.body.ticker;
    if (ticker){
      ticker = ticker.toUpperCase();
    }
    axios.get('https://finnhub.io/api/v1/stock/profile2?symbol='+ticker+'&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0')
    .then((res)=>{
        exp_res.send(JSON.stringify(res.data));
        //console.log(res.data);
    }).catch((err)=>{
        console.log(err);
    })
});

//quote
//https://finnhub.io/api/v1/quote?symbol=GOOGL&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0


//symbol-search (Autocomplete)
//https://finnhub.io/api/v1/search?q=AMZ&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0


app.post('/search/home',jsonParser, function(req, exp_res){
//    res.send("portfolio");
    console.log("from Search Home",req.body.ticker);
    ticker = req.body.ticker;
    if (ticker){
      ticker = ticker.toUpperCase();
    }
    axios.get('https://finnhub.io/api/v1/search?q='+ ticker +'&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0')
    .then((res)=>{
        exp_res.send(JSON.stringify(res.data));
        //console.log(res.data);
    }).catch((err)=>{
        console.log(err);
    })
});


app.post('/getStockQuote', jsonParser, function(req, exp_res){
  console.log("From StockQuote",req.body.ticker);
  ticker = req.body.ticker;
  if (ticker){
    ticker = ticker.toUpperCase();
  }
  let urls = [
    "https://finnhub.io/api/v1/stock/profile2?symbol="+ ticker + "&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0",
    "https://finnhub.io/api/v1/quote?symbol=" + ticker + "&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0",
    "https://finnhub.io/api/v1/stock/peers?symbol="+ticker+"&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0",
  ];

  let stock_quote_data = [];

  const requests = urls.map((url) => axios.get(url));
  axios.all(requests).then((responses) => {
    responses.forEach((resp) => {
      stock_quote_data.push(resp.data);
    }); 
    //console.log(stock_quote_data);
    exp_res.send(JSON.stringify(stock_quote_data));
  })
  .catch(function(error){
    console.log(error);
  });
});

//getQuote
app.post('/getQuote', jsonParser ,function(req, exp_res){
  console.log(req.body.ticker);
  ticker = req.body.ticker;
  if (ticker){
    ticker = ticker.toUpperCase();
  }
  axios.get("https://finnhub.io/api/v1/quote?symbol=" + ticker + "&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0")
  .then((res)=>{
      exp_res.send(JSON.stringify(res.data));
      //console.log(res.data);
  }).catch((err)=>{
      console.log(err);
  })
});


//aggregate_bars_API
//https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-09/2023-01-09?adjusted=true&sort=asc&apiKey=Ng5hjXVcY3pWkurL4GplsVIReWjkFz3n

app.post('/getAggBars', jsonParser, function(req, exp_res){
  console.log("From Agg Bars",req.body.ticker); 
  ticker = req.body.ticker;
  if (ticker){
    ticker = ticker.toUpperCase();
  }

  const curr_date = new Date();
  const formatted_curr_date = date.format(curr_date, 'YYYY-MM-DD');
  console.log(formatted_curr_date);

  const today = new Date();

// Calculate the date two years ago
  const twoYearsAgo = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
  const formatted_twoYearsAgo = date.format(twoYearsAgo, 'YYYY-MM-DD');
  console.log("Two years ago:", formatted_twoYearsAgo);
  
  axios.get('https://api.polygon.io/v2/aggs/ticker/' + ticker + '/range/1/day/' + formatted_twoYearsAgo + '/' + formatted_curr_date + '?adjusted=true&sort=asc&apiKey=Ng5hjXVcY3pWkurL4GplsVIReWjkFz3n').then((res)=>{
        exp_res.send(JSON.stringify(res.data));
        console.log(res.data['results'][0]);
    }).catch((err)=>{
        console.log(err);
    })
}); 


//getHourlyData
//https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/hour/2023-01-09/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=Ng5hjXVcY3pWkurL4GplsVIReWjkFz3n
app.post('/getHourlyData', jsonParser, function(req, exp_res){
  console.log("From Hourly Data",req.body.ticker); 
  ticker = req.body.ticker;
  from_date = req.body.from_date;
  to_date = req.body.to_date;
  console.log(from_date, to_date);
  console.log(typeof from_date);

  if (ticker){
    ticker = ticker.toUpperCase();
  }

  const fromDate = new Date(from_date);
  const formatted_fromDate = date.format(fromDate, 'YYYY-MM-DD');
  console.log(formatted_fromDate);

  const toDate = new Date(to_date);
  // let previousDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  formatted_toDate = date.format(toDate, 'YYYY-MM-DD');
  console.log("Previous Day:", formatted_toDate);
  
  axios.get('https://api.polygon.io/v2/aggs/ticker/' + ticker + '/range/1/hour/' + formatted_fromDate + '/' + formatted_toDate + '?adjusted=true&sort=asc&apiKey=Ng5hjXVcY3pWkurL4GplsVIReWjkFz3n').then((res)=>{
        exp_res.send(JSON.stringify(res.data));
        console.log(res.data['results']);
    }).catch((err)=>{
        console.log(err);
    })
});



//Top News
//https://finnhub.io/api/v1/company-news?symbol=MSFT&from=2023-09-01&to=2023-09-09&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0

app.post('/getTopNews', jsonParser, function(req, exp_res){
  console.log("From TopNews",req.body.ticker); 
  ticker = req.body.ticker;
  if (ticker){
    ticker = ticker.toUpperCase();
  }

  const curr_date = new Date();
  const formatted_curr_date = date.format(curr_date, 'YYYY-MM-DD');

  console.log(formatted_curr_date);
  
  axios.get('https://finnhub.io/api/v1/company-news?symbol=' + ticker +'&from=2023-09-01&to=' + formatted_curr_date + '&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0')
    .then((res)=>{
        exp_res.send(JSON.stringify(res.data));
        console.log(res.data[0]);
    }).catch((err)=>{
        console.log(err);
    })
  
}); 


//for assignment sample api endpoint purpose
app.get('/getTopNews', jsonParser, function(req, exp_res){
  console.log("From TopNews",req.query.ticker); 
  ticker = req.query.ticker;
  if (ticker){
    ticker = ticker.toUpperCase();
  }

  const curr_date = new Date();
  const formatted_curr_date = date.format(curr_date, 'YYYY-MM-DD');

  console.log(formatted_curr_date);
  
  axios.get('https://finnhub.io/api/v1/company-news?symbol=' + ticker +'&from=2023-09-01&to=' + formatted_curr_date + '&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0')
    .then((res)=>{
        exp_res.send(JSON.stringify(res.data));
        console.log(res.data[0]);
    }).catch((err)=>{
        console.log(err);
    })
  
}); 




//Recommendation Trends
//https://finnhub.io/api/v1/stock/recommendation?symbol=AAPL&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0
app.post('/getTrends', jsonParser, function(req, exp_res){
  console.log("From Rec Trends",req.body.ticker); 
  ticker = req.body.ticker;
  if (ticker){
    ticker = ticker.toUpperCase();
  }

  axios.get('https://finnhub.io/api/v1/stock/recommendation?symbol=' + ticker +'&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0')
    .then((res)=>{
        exp_res.send(JSON.stringify(res.data));
        console.log(res.data[0]);
    }).catch((err)=>{
        console.log(err);
    })
  
}); 


//Insider Sentiment
//https://finnhub.io/api/v1/stock/insider-sentiment?symbol=LOW&from=2022-01-01&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0
app.post('/getSentiment', jsonParser, function(req, exp_res){
  console.log("From Insider Sentiment",req.body.ticker); 
  ticker = req.body.ticker;
  if (ticker){
    ticker = ticker.toUpperCase();
  }

  axios.get('https://finnhub.io/api/v1/stock/insider-sentiment?symbol=' + ticker +'&from=2022-01-01&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0')
    .then((res)=>{
        exp_res.send(JSON.stringify(res.data));
        console.log("Insider Sentiment",res.data);
    }).catch((err)=>{
        console.log(err);
    })
  
}); 


//Company Earnings
//https://finnhub.io/api/v1/stock/earnings?symbol=MSFT&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0
//Replace null response values with zero, if any
app.post('/getEarnings', jsonParser, function(req, exp_res){
  console.log("From Company Earnings",req.body.ticker); 
  ticker = req.body.ticker;
  if (ticker){
    ticker = ticker.toUpperCase();
  }

  axios.get('https://finnhub.io/api/v1/stock/earnings?symbol=' + ticker +'&token=cnsas7pr01qmmmfkvtcgcnsas7pr01qmmmfkvtd0')
    .then((res)=>{
        exp_res.send(JSON.stringify(res.data));
        console.log("Company Earnings",res.data);
    }).catch((err)=>{
        console.log(err);
    })
  
}); 

//MongoDB Connection string
//mongodb+srv://sachinkoti123:Sdk%401996@clusterhw3.71m5mf6.mongodb.net/?retryWrites=true&w=majority&appName=clusterHW3
app.post('/addToWatchlist', jsonParser, function(req, exp_res){
  console.log("From add Watchlist", req.body);
  const ticker_value = req.body.ticker;
  const company_name = req.body.companyName;

  const client = new MongoClient(uri);

  async function run() {
    try {
         await client.connect();
         const db = client.db("HW3");
         const col = db.collection("WatchList");

        const item = {"ticker": ticker_value, "companyName": company_name}
        if (await col.findOne(item) == null){
        const p = await col.insertOne(item);
        console.log("Insert status", p);
        }
        else{
          console.log("Item already exists")
          await client.close();
        }

        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}

run().catch(console.dir);
});


//removeFromWatchlist

app.post('/removeFromWatchlist', jsonParser, function(req, exp_res){
  console.log("From remove Watchlist", req.body.ticker);
  const value = req.body.ticker;

  const client = new MongoClient(uri);

  async function run() {
    try {
        // Connect to the Atlas cluster
         await client.connect();

         // Get the database and collection on which to run the operation
         const db = client.db("HW3");
         const col = db.collection("WatchList");

        const filter = {"ticker": value}
        const d = await col.deleteOne(filter)
        console.log("Delete status", d); 

        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}

run().catch(console.dir);
});

//searchWatchlist
app.post('/searchWatchlist', jsonParser, function(req, exp_res){
  console.log("From Search Watchlist", req.body.ticker);
  const value = req.body.ticker;

  const client = new MongoClient(uri);

  async function run() {
    try {
        // Connect to the Atlas cluster
         await client.connect();

         // Get the database and collection on which to run the operation
         const db = client.db("HW3");
         const col = db.collection("WatchList");

         const item = {"ticker": value}
         if (await col.findOne(item) != null){
            exp_res.send("1");
         }
         else{
           console.log("Ticker doesn't exist");
           exp_res.send("0");
           await client.close();
         }

        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}

run().catch(console.dir);
});

//getWatchlistls
app.get('/getWatchlist', function(req, exp_res){
  console.log("From Get Watchlist");

  const client = new MongoClient(uri);

  async function run() {
    try {
      // Connect to the Atlas cluster
      await client.connect();

      // Get the database and collection on which to run the operation
      const db = client.db("HW3");
      const col = db.collection("WatchList");

      // Use await with find and toArray to ensure asynchronous operations complete before proceeding
      const result = await col.find({}, { projection: { _id: 0, ticker: 1, companyName:1 } }).toArray();
      console.log(result);
      exp_res.send(result);
    } 
      catch (err) {
      console.log(err.stack);
    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);
});


//Wallet Balance
//getBalance
app.get('/getBalance', function(req, exp_res){
  console.log("From Balance");

  const client = new MongoClient(uri);

  async function run() {
    try {
      // Connect to the Atlas cluster
      await client.connect();

      // Get the database and collection on which to run the operation
      const db = client.db("HW3");
      const col = db.collection("Wallet");

      const query = { _id: new ObjectId('660751009cbfbda39f01f2ff') };
      // Use await with find and toArray to ensure asynchronous operations complete before proceeding
      const result = await col.findOne(query);
      console.log(result['balance']);
      exp_res.send(result['balance']);
    } 
      catch (err) {
      console.log(err.stack);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});


//writePortfolio
app.post('/writePortfolio', jsonParser, function(req, exp_res){
  console.log("From write to portfolio", req.body);
  const ticker_value = req.body.ticker;
  const company_name = req.body.companyName || '';
  const quantity = req.body.quantity;
  const modalTotal = req.body.modalTotal;

  const client = new MongoClient(uri);

  async function run() {
    try {
         await client.connect();
         const db = client.db("HW3");
         const col = db.collection("Portfolio");
         const col_wallet = db.collection("Wallet");

        const existingItem = await col.findOne({ ticker: ticker_value });

        const walletUpdateResult = await col_wallet.updateOne({}, { $inc: { balance: -modalTotal } });
        console.log("Updated wallet balance:", walletUpdateResult);

        if(!existingItem)
        {
          const item={"ticker": ticker_value, "companyName": company_name, 'quantity':quantity,'total':modalTotal};
          const p = await col.insertOne(item);
          console.log("Inserted item:", p);
          exp_res.send({"response":"Inserted"})
        }  
        else{
          const updatedItem={
            $set:{
              quantity: existingItem.quantity + quantity,
              total: existingItem.total + modalTotal
            }
          };
          const result = await col.updateOne({ticker:ticker_value}, updatedItem);
          console.log("Item already exists and was updated", result)
          exp_res.send({"response":"Updated"});
          await client.close();
        }

        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}

run().catch(console.dir);
});


//searchPortfolio
app.post('/searchPortfolio', jsonParser ,function(req, exp_res) {
  console.log("From Search Portfolio", req.body.ticker);
  const value = req.body.ticker;

  const client = new MongoClient(uri);

  async function run() {
    try {
        // Connect to the Atlas cluster
         await client.connect();

         // Get the database and collection on which to run the operation
         const db = client.db("HW3");
         const col = db.collection("Portfolio");

         const item = {"ticker": value}
         p = await col.findOne(item);
         if ( p != null){
          console.log(p);
            exp_res.send({"found":"1", "quantity":p.quantity});
         }
         else{
           console.log("Ticker doesn't exist");
           exp_res.send({"found":"0"});
           await client.close();
         }

        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}

run().catch(console.dir);
});



//getPortfolio
app.get('/getPortfolio', async function(req, res) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("HW3");
    const col = db.collection("Portfolio");

    // Find all documents in the Portfolio collection
    const portfolioItems = await col.find({}).toArray();

    // Send the retrieved portfolio items as the response
    res.json(portfolioItems);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});


//sellPortfolio
app.post('/sellPortfolio', jsonParser, function(req, exp_res){
  console.log("From sell portfolio", req.body);
  const ticker_value = req.body.ticker;
  const company_name = req.body.companyName || '';
  const quantity = req.body.quantity;
  const modalTotal = req.body.modalTotal;

  const client = new MongoClient(uri);

  async function run() {
    try {
         await client.connect();
         const db = client.db("HW3");
         const col = db.collection("Portfolio");
         const col_wallet = db.collection("Wallet");

        const existingItem = await col.findOne({ ticker: ticker_value });

        const walletUpdateResult = await col_wallet.updateOne({}, { $inc: { balance: +modalTotal } });
        console.log("Updated wallet balance:", walletUpdateResult);

        if(!existingItem)
        {
          const item={"ticker": ticker_value, "companyName": company_name, 'quantity':quantity,'total':modalTotal};
          const p = await col.insertOne(item);
          console.log("Inserted item:", p);
          exp_res.send({"response":"Inserted"})
        }  
        else{
          const updatedItem={
            $set:{
              quantity: existingItem.quantity - quantity,
              total: existingItem.total - modalTotal
            }
          };
          const result = await col.updateOne({ticker:ticker_value}, updatedItem);
          console.log("Item was sold", result)
          exp_res.send({"response":"Sold"});
          
          if((existingItem.quantity - quantity) == 0){
            await col.deleteOne({ticker:ticker_value});
            exp_res.send({"response":"Sold"});
            console.log("record with zero quantity removed");
          }
        }

        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}

run().catch(console.dir);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> console.log("Server is listening"));
