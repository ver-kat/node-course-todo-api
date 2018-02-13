const {MongoClient, ObjectID} = require('mongodb');

// const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017', (error, client) => {
    if(error) {
        return console.log('Unable to connect to db server');
    }
    console.log('Connected to db server');
    var db = client.db('TodoApp');
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (error, result) => {
    //     if(error) {
    //         return console.log('Unable to insert todo', error);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });


    // db.collection('Users').insertOne({
    //     name: 'Vern',
    //     age: 44,
    //     location: 'Utah'
    // }, (error, result) => {
    //     if(error) {
    //         return console.log('Unable to insert user', error);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // client.close();
});