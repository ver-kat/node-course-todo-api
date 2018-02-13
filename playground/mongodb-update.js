const {MongoClient, ObjectID} = require('mongodb');

// const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017', (error, client) => {
    if(error) {
        return console.log('Unable to connect to db server');
    }
    console.log('Connected to db server');
    var db = client.db('TodoApp');

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID("5a83404b79aa31a6de0edec3")
    }, {
        $set: {
            name: 'Bob'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID("5a83120679aa31a6de0edb31")
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // })

    //db.close();
});