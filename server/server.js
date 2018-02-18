const {ObjectID} = require('mongodb');
var express = require('express');
var bodyparser = require('body-parser');

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyparser.json());

app.post('/todos', (request, response) => {
    var todo = new Todo({
        text: request.body.text
    });
    todo.save().then((document) => {
        response.send(document);
    }, (error) => {
        response.status(400).send(error);
    });
    console.log(request.body);
});

app.get('/todos', (request, response) => {
    Todo.find().then((todos) => {
        response.send({todos});
    }, (error) =>{
        response.status(400).send(error);
    });
});

app.get('/todos/:id', (request, response) => {
    var id = request.params.id;

    if(!ObjectID.isValid(id)) {
        return response.status(404).send();
    };  
    
    Todo.findById(id).then((todo) => {
        if(!todo){
            response.status(404).send();
        }
        response.send({todo});
    }).catch((error) => {
        response.status(400).send();
    });
});

app.delete('/todos/:id', (request, response) => {
    var id = request.params.id;
    
    if(!ObjectID.isValid(id)) {
        return response.status(404).send();
    };  
    
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            response.status(404).send();
        }
        response.send({todo: todo});
        //response.status(200).send();
    }).catch((error) => {
        response.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};

// var newUser = new User({
//     email: 'email'
// });

// newUser.save().then((document) => {
//     console.log('Saved user', document)
// }, (error) => {
//     console.log(error, "Unable to save user");
// });

// var newTodo = new Todo({
//     text: 'Clean kitchen',
//     // completed: false,
//     // completedAt: new Date().getDate()
// });

// newTodo.save().then((document) => {
//     console.log('Saved todo', document)
// }, (error) => {
//     console.log(error, "Unable to save todo");
// });