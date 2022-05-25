const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();



/// middlrware 
app.use(cors());
app.use(express.json());

// database start 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rkd0q.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// databse function start 1st
async function run() {
    try {
        await client.connect()
        console.log('database connected');
        const productsCollecetion = client.db('electric_manufacturer').collection('products');
        const bookingCollecetion = client.db('electric_manufacturer').collection('bookings');



        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollecetion.find(query);
            const products = await cursor.toArray()
            res.send(products);
        })


        /// available items
        app.get('/available', async (req, res) => {
            const date = req.query.date;
            const products = await productsCollecetion.find().toArray()
            const query = { date: date }
            const bookings = await bookingCollecetion.find(query).toArray()

            products.forEach(product => {
                const productBookings = bookings.filter(book => book.itemPackage === product.name);

                const bookedProducts = productBookings.map(book => book.product);

                const available = product.products.filter(product => !bookedProducts.includes(product));
                product.products = available;

            })
            res.send(products)
        })


        // booking showing to dashboard 

        app.get('/booking', async (req, res) => {
            const buyer = req.query.buyer;
            const query = { buyer: buyer }
            const bookings=  await bookingCollecetion.find(query).toArray()
            res.send(bookings)
        })





        // booking for products/items
        app.post('/booking', async (req, res) => {

            const booking = req.body;
            const query = { itemPackage: booking.itemPackage, date: booking.date, buyer: booking.buyer }
            const exists = await bookingCollecetion.findOne(query);

            if (exists) {
                return res.send({ success: false, booking: exists })
            }

            const result = await bookingCollecetion.insertOne(booking)

            return res.send({ success: true, result });
        })











    }
    finally {

    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('elctric server is running')
})


// port listen
app.listen(port, () => {
    console.log('listening to port', port)
})