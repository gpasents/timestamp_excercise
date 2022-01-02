// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var moment = require('moment');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

//logger
app.use((req,res,next)=>{
  console.log(req.method + " "+ req.ip );
  next();
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

const isUnix = (ts)=>{
  return moment(ts,"X",true).isValid();
}

const isNormal = (ts)=>{
  return moment(ts).isValid();
}
const isValid = (timeStamp)=>{
  if (isUnix(timeStamp)){
    return true;
  }else{
    return isNormal(timeStamp);
  }
}

app.get("/api/:stamp",(req,res,next)=>{
  let stamp = req.params.stamp;
  let json = {};
  if (isValid(stamp)){
    if (isUnix(stamp)){
      let date = new Date(Number(stamp));
      json = {"unix":date.getTime(),"utc":date.toUTCString()};
    }else{
      let ts = (new Date(stamp));
      json = {"unix":ts.getTime(),"utc":String(ts.toUTCString())};
    }
  }else{
    json = {"error":"Invalid Date"};
  }
  res.json(json);
  next();
});

app.get("/api",(req,res,next)=>{
  let date = new Date();

  res.json({"unix":date.getTime(),"utc":date.toUTCString()});
})



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
