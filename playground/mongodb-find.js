const {MongoClient, ObjectID} = require('mongodb');

// const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017', (error, client) => {
    if(error) {
        return console.log('Unable to connect to db server');
    }
    console.log('Connected to db server');
    var db = client.db('TodoApp');

    // db.collection('Todos').find({
    //         _id: new ObjectID('5a81c9f8aaecd8050402217e')
    //     }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (error) => {
    //     console.log("Unable to fetch Todos", error)
    // });

    // db.collection('Todos').find().count().then((count) => {
    // console.log(`Todos: ${count}`);

    db.collection('Users').find({
        name: 'Zeus'
    }).toArray().then((docs) => {
        console.log('Users named Zeus');
        console.log(JSON.stringify(docs, undefined, 2));
}, (error) => {
    console.log("Unable to fetch Todos", error)
});

    //db.close();
});