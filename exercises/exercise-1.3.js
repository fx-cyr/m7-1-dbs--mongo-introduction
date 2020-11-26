const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const getUsers = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");
  const data = await db.collection("users").find().toArray();
  //   console.log(db.collection("users"));
  if (data.length > 0) {
    return res.status(200).json({
      status: 200,
      message: "Users retrieved!",
      data: data,
    });
  }
  res.status(404).json({
    status: 404,
    message: "Could not retrieve users",
  });
};

module.exports = { getUsers };
