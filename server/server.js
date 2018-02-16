var express = require('express');
var bodyparser = require('body-parser');

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

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
    })
});

app.listen(3000, () => {
    console.log('Started on port 3000');
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