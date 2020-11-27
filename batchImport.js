const fs = require("file-system");
const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async () => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");
    const result = await db
      .collection("greetings")
      .insertMany(greetings)
      .toArray();
    assert.strictEqual(result.length, result.insertedCount);
    if (result) {
      return console.log("Success");
    }
    return console.log("Nope, try again");
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

batchImport();
