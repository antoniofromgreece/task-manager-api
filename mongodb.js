//CRUD  create-read-update-delete
// const mongodb = require("mongodb");
const Db = require("mongodb/lib/db");
// const MongoClient = mongodb.MongoClient;
// const objectID = mongodb.objectID;
const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

const id = new ObjectID();
console.log(id);
console.log(id.getTimestamp());
console.log(id.toHexString().length);

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  { useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database");
    }

    console.log("Connected correctly");
    const db = client.db(databaseName);

    db.collection("users")
      .deleteMany({
        age: 27,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });

    // const updatePromise = db.collection("users").updateOne(
    //   {
    //     _id: new ObjectID("61de0899b5987c0f24cecd3f"),
    //   },
    //   {
    //     $set: {
    //       name: "Mike",
    //     },
    //   }
    // );
    // updatePromise
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // db.collection("users")
    //   .updateMany(
    //     {
    //       age: 26,
    //     },
    //     {
    //       $set: {
    //         age: 27,
    //       },
    //     }
    //   )
    //   .then((result) => {
    //     console.log(result.modifiedCount);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // db.collection("users").findOne(
    //   { _id: new ObjectID("61de8fea5b806924e005264f") },
    //   (error, user) => {
    //     if (error) {
    //       return console.log("Unable to fetch");
    //     }
    //     console.log(user);
    //   }
    // );

    // db.collection("users")
    //   .find({ age: 26 })
    //   .toArray((error, user) => {
    //     console.log(user);
    //   });

    // db.collection("users")
    //   .find({ age: 52 })
    //   .count((error, count) => {
    //     console.log(count);
    //   });

    // db.collection("users").insertOne(
    //   {
    //     _id: id,
    //     name: "Vikram",
    //     age: 26,
    //   },
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert user");
    //     }

    //     console.log(result.ops);
    //   }
    // );
    // db.collection("users").insertMany(
    //   [
    //     {
    //       name: "Jen",
    //       age: 28,
    //     },
    //     {
    //       name: "Gunther",
    //       age: 27,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert documents");
    //     }
    //     console.log(result.ops);
    //   }
    // );
  }
);
