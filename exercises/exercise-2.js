const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const assert = require("assert");

const createGreeting = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");
    const result = await db.collection("greetings").insertOne(req.body);
    assert.strictEqual(1, result.insertedCount);
    if (result) {
      return res.status(201).json({
        status: 201,
        data: req.body,
      });
    }
    return res.status(500).json({
      status: 500,
      message: "Failed request",
    });
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

const getGreeting = async (req, res) => {
  const { _id } = req.params;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");
    const result = await db.collection("greetings").findOne({ _id });
    if (result) {
      res.status(200).json({
        status: 200,
        message: "Success",
        data: result,
      });
    }
    res.status(404).json({
      status: 404,
      message: "Greeting not found",
    });
  } catch (err) {
    console.log(err.stack);
  }
};

const getAllGreetings = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");
    const result = await db.collection("greetings").find().toArray();
    if (result.length > 0) {
      const start = Number(req.query.start) || 0;
      const cleanStart = start > -1 && start < result.length ? start : 0;
      const end = cleanStart + Number(req.query.limit) || 10;
      const cleanEnd = end > result.length ? result.length - 1 : end;
      const data = result.slice(cleanStart, cleanEnd);
      res.status(200).json({
        status: 200,
        message: "Success",
        data: data,
      });
    }
    res.status(404).json({
      status: 404,
      message: "Greeting not found",
    });
  } catch (err) {
    console.log(err.stack);
  }
};

const deleteGreeting = async (req, res) => {
  const { _id } = req.params;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");
    const result = await db.collection("greetings").deleteOne({ _id });
    assert.strictEqual(1, result.deletedCount);
    if (result) {
      return res.status(204).json({
        status: 204,
        message: `${_id} document succesfully deleted`,
        data: result,
      });
    }
    return res.status(500).json({
      status: 500,
      message: "Failed request",
    });
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

const updateGreeting = async (req, res) => {
  const { _id } = req.params;
  const { hello } = req.body;
  try {
    const query = { _id };
    const updatedHello = { $set: { hello } };
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");
    const result = await db
      .collection("greetings")
      .updateOne(query, updatedHello);
    if (result) {
      return res.status(204).json({
        status: 204,
        message: `${_id} document succesfully updated`,
        data: result,
      });
    }
    return res.status(500).json({
      status: 500,
      message: "Failed request",
    });
  } catch (err) {
    console.log(err.stack);
  }
};
module.exports = {
  createGreeting,
  getGreeting,
  getAllGreetings,
  deleteGreeting,
  updateGreeting,
};
