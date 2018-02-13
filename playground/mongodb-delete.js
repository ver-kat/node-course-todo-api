const {MongoClient, ObjectID} = require('mongodb');

// const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017', (error, client) => {
    if(error) {
        return console.log('Unable to connect to db server');
    }
    console.log('Connected to db server');
    var db = client.db('TodoApp');

    // db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) => {
    //     console.log(result);
    // })

    // db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
    //     console.log(result);
    // })
    
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // })

    db.collection('Users').deleteMany({location: 'The pillow'}).then((result) => {
        console.log(result);
    })

    db.collection('Users').deleteOne({name: 'Vern'}).then((result) => {
        console.log(result);
    })
    
    db.collection('Users').findOneAndDelete({_id : new ObjectID('5a82226d79aa31a6de0e9403')}).then((result) => {
        console.log(result);
    })


//     db.collection('Users').find({
//         name: 'Zeus'
//     }).toArray().then((docs) => {
//         console.log('Users named Zeus');
//         console.log(JSON.stringify(docs, undefined, 2));
// }, (error) => {
//     console.log("Unable to fetch Todos", error)
// });

    //db.close();
});