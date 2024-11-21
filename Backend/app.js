const express = require('express');
const cors = require("cors")
require ("./src/config/db.js")
const mongoose = require('mongoose');


// Routes Import
const homeRoute = require('./src/routes/homeRoute.js');
const userRoute = require('./src/routes/userRoute.js')
const subjectRoute = require('./src/routes/subjectRoute.js')
const topicRoute = require('./src/routes/topicRoute.js')
const questionRoute = require('./src/routes/questionRoute.js')
const examRoute = require('./src/routes/examRoute.js')

const app = express();
app.use(express.json());

app.use('*',cors({
    origin: 'http://localhost:3000', // replace with your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // 'application/json' is a value, not a header key
    credentials: true // if you're using cookies or authentication
}));



app.listen(3001, (error)=>{
    if(!error)
        console.info("Success: Server is connected, port: ", 3001);
    else
        console.error("Error: Server can't connect", error);
})


app.get('/', (req, res) => {
    res.status(200);
    res.send("Hello world")
})

app.use('/', homeRoute)
app.use('/', userRoute)
app.use('/', subjectRoute)
app.use('/', topicRoute)
app.use('/', questionRoute)
app.use('/', examRoute)

app.use((req, res, next) => {
    res.status(404).send("sorry, the page you're looking not found.")
})