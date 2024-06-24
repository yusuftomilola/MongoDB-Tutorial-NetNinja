const { MongoClient } = require("mongodb");

let dbConnection;

const uri =
  "mongodb+srv://tomilolaaaaa:fOaUyTYl6xjzktcS@cluster0.pjcgedm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const localURI = "mongodb://localhost:27017/bookstore";

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
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
