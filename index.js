const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middlewares
app.use(cors());
app.use(express.json());


// MongoDB Codes
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.shklq4p.mongodb.net/?retryWrites=true&w=majority`;
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

    const allTasksCollection = client.db("Taskify").collection("allTasks"); 

    //Get all task data
    app.get('/allTasks', async(req,res) => {
      const result = await allTasksCollection.find().toArray();
      res.send(result);
    })

    // Reading individual data
     // Read data to Update assignments
     app.get("/allTasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await allTasksCollection.findOne(query);
      res.send(result);
    })

    // Posting new task to the Database
    app.post("/allTasks", async(req, res) => {
      const newTask = req.body;
      console.log(newTask);
      const result = await allTasksCollection.insertOne(newTask);
      res.send(result);
    });

    // Deleting Tasks
     // Delete Operations
     app.delete('/allTasks/:id', async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await allTasksCollection.deleteOne(query);
      res.send(result);
    })

    // Updating Tasks
    app.put("/allTasks/:id", async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true};
      const updatedTask = req.body;
      const task = {
        $set: {
          taskName: updatedTask.taskName,
          taskDescription: updatedTask.taskDescription,
          priority: updatedTask.priority,
          status: updatedTask.status,
          dueDate: updatedTask.dueDate
        }
      }
      const result = await allTasksCollection.updateOne(filter, task, options);
      res.send(result);
    })

    // Patching the complete functionality
    app.patch("/allTasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updatedDoc = {
        $set: {
          status: "Completed"
        }
      }
      const result = await allTasksCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })


    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Fly Taskify!!!')
})

app.listen(port, () => {
  console.log(`Taskify running on port ${port}`)
})