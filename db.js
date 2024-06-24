const { MongoClient } = require("mongodb");
require("dotenv").config();

let dbConnection;

const localURI = "mongodb://localhost:27017/bookstore";

const connection = process.env.MONGODB_URI || localURI;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(connection)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((error) => {
        console.log(error);
        return cb();
      });
  },
  getDb: () => dbConnection,
};
