const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const  cors = require('cors');
require('dotenv').config();
const port= process.env.PORT || 5000 ;
const app= express();



/// middlrware 
app.use(cors());
app.use(express.json());

// database start 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rkd0q.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
app.get('/',(req,res) =>{
    res.send('elctric server is running')
})


// port listen
app.listen( port,()=>{
    console.log('listening to port', port)
})