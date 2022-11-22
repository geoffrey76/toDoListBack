import express from 'express';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

const app = express();
const port = 8800;
app.use (express.json());

dotenv.config();

const uri = process.env.STRING_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect((err, db) => {
  console.log('connecté avec succès à DB');
  const collection = db.db("to-do-list").collection('to-do-items');
  if (err || !db) { return false; };

  app.get('/api', async (req, res) => {
    const response = await collection.find({}).toArray();
    res.json(response);
    
  });

  app.post('/api/addTask', async (req, res) => {
    const task = req.body;
    await collection.insertOne(task);
  })
  
  app.delete(`/api/deleteTask/:id`, async(req, res) => {
      // const task = req.params.;
      var id = req.params.id;
      await collection.deleteOne({_id: ObjectId(id)});

      const response = await collection.find({}).toArray();
      
      res.json(response);
  })
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})