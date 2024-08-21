const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
//natureTourism
//bTUQc9C39XVewTBh


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.BD_PASS}@cluster0.jp5aibk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = "mongodb+srv://<username>:<password>@cluster0.jp5aibk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

     const tourism = client.db("natureTourism").collection("touristsSpots");
     const tourCountry =client.db("natureTourism").collection("countriess");

     app.get('/touristsSpots', async (req, res) => {
        const allSpots = tourism.find();
        const result = await allSpots.toArray();
        res.json( result );
    })
     app.get('/touristsSpots/myList', async (req, res) => {
        const  user = req.query.name;
        console.log(user);
        const allSpots = tourism.find({user_name:user});
        const result = await allSpots.toArray();
        res.json( result );
    })

    app.get('/countriesSpots/:id', async (req, res) => {
        const  user = req.params.id;
        console.log(user);
        const allSpots = tourism.find({country_name:user});
        const result = await allSpots.toArray();
        res.json( result );
    })

    app.get('/touristsSpots/:id', async (req, res) => {
        const spotId = req.params.id;
        const query = { _id: new ObjectId(spotId) };
        const foundSpot = await tourism.findOne(query);
        if(!foundSpot) return res.status(404).json({ message: 'tourists spot not found' });
        // res.json(foundSpot);
        res.status(200).json(foundSpot);
        // res.send(foundSpot);
    })

    app.post('/touristsSpots', async (req, res) => {
        const newSpot = req.body;
        // console.log(newSpot);
        const result = await tourism.insertOne(newSpot);
        res.status(201).json({ message: 'New spot added successfully', insertedId: result.insertedId });
        // res.send(result);
    })

    app.put('/touristsSpots/:id', async (req, res) => {
        const spotId = req.params.id;
        const updatedSpot = req.body;
        const query = { _id: new ObjectId(spotId) };
        const options = { upsert: true };
        const result = await tourism.updateOne(query, { $set: updatedSpot }, options);
        if(result.matchedCount === 0) return res.status(404).json({ message: 'Tourists spot not found' });
        res.status(200).json({ message: 'Tourists spot updated successfully', modifiedCount: result.modifiedCount });
        // res.send(result);
    })

    app.delete('/touristsSpots/:id', async (req, res) => {
        const spotId = req.params.id;
        const query = { _id: new ObjectId(spotId) };
        const result = await tourism.deleteOne(query);
        if(result.deletedCount === 0) return res.status(404).json({ message: 'Tourists spot not found' });
        res.status(200).json({ message: 'Coffee deleted successfully', deletedCount: result.deletedCount });
        // res.send(result);
    })

    // countries section

    app.get('/countriess', async (req, res) => {
        const allCountries = tourCountry.find();
        const result = await allCountries.toArray();
        res.json( result );
    })

    app.post('/countriess', async (req, res)=>{
        const newCountry = req.body;
        const result = await tourCountry.insertOne(newCountry);
        res.status(201).json({ message: 'New country added successfully', insertedId: result.insertedId });
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, resizeBy) => {
    resizeBy.send('nature tourism server is runing');
});



app.listen(port, (req, res) => {
    console.log(`Server running on port: ${port}`);
});