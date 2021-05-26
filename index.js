const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const AuthRoute = require('./routes/auth')
const CourtRoute = require('./routes/courtApi')
const CoachRoute = require('./routes/coachApi')
const ShopRoute = require('./routes/shopApi')
const BookingRoute = require('./routes/bookingApi')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const dotenv = require('dotenv');
//const MongoClient = require('mongodb').MongoClient;


// Load env
dotenv.config({path : './config.env'});

// set express app
const app = express();

app.use(cors());


// Connect to MongoDB

// const uri = "mongodb+srv://Zakariae:Zakariae@cluster0.khiry.mongodb.net/rent2play?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

mongoose.connect('mongodb+srv://Zakariae:Zakariae@cluster0.khiry.mongodb.net/rent2play?retryWrites=true&w=majority', 
{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}).then(db => {
    console.log("Database connected");
  }).catch(error => console.log("Could not connect to mongo db " + error));
mongoose.Promise = global.Promise;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Initialize routes
app.use('/api', CourtRoute);
app.use ('/api', CoachRoute);
app.use('/api', ShopRoute);
app.use('/payment', BookingRoute)
app.use('/api', AuthRoute);

//Error handling middleware
app.use(function(err, req, res, next){
    res.status(404).send(
        {error: err.message}
    ).end();
})

//Handle production
if(process.env.NODE_ENV === 'production'){
    // Set static folder
    app.use(express.static(__dirname + '/public/'));

    // Hnadle SPA
    app.get(/.*/, (req,res) => {
        res.sendFile(__dirname + '/public/index.html')
    })
}

// Listen for request
const port = process.env.port || 4000;
app.listen(port, function(){
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port} `);
});



