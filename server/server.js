require('./config/config');

const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyparser = require('body-parser');

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyparser.json());

app.get('/users/me', authenticate, (request, response) => {
    response.send(request.user);
});

app.post('/users', (request, response) => {
    var body = _.pick(request.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        response.header('x-auth', token).send(user);
    }).catch((error) => {
        response.status(400).send(error);
    });
});

app.post('/users/login', (request, response) => {
    var body = _.pick(request.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user)=> {
        return user.generateAuthToken().then((token) => {
            response.header('x-auth', token).send(user);
        });
    }).catch((error) => {
        response.status(400).send();
    });
});

app.post('/todos', authenticate, (request, response) => {
    var todo = new Todo({
        text: request.body.text,
        _creator: request.user._id
    });
    todo.save().then((document) => {
        response.send(document);
    }, (error) => {
        response.status(400).send(error);
    });
    console.log(request.body);
});

app.get('/todos', authenticate, (request, response) => {
    Todo.find({
        _creator: request.user._id
    }).then((todos) => {
        response.send({todos});
    }, (error) =>{
        response.status(400).send(error);
    });
});

app.get('/todos/:id', authenticate, (request, response) => {
    var id = request.params.id;

    if(!ObjectID.isValid(id)) {
        return response.status(404).send();
    };  
    
    Todo.findOne({
        _id: id,
        _creator: request.user._id
    }).then((todo) => {
        if(!todo){
            response.status(404).send();
        }
        response.send({todo});
    }).catch((error) => {
        response.status(400).send();
    });
});

app.delete('/todos/:id', authenticate, (request, response) => {
    var id = request.params.id;
    
    if(!ObjectID.isValid(id)) {
        return response.status(404).send();
    };  
    
    Todo.findOneAndRemove({
        _id: id,
        _creator: request.user._id
    }).then((todo) => {
        if(!todo){
            response.status(404).send();
        }
        response.send({todo: todo});
        //response.status(200).send();
    }).catch((error) => {
        response.status(400).send();
    });
});

app.patch('/todos/:id', authenticate, (request, response) => {
    var id = request.params.id;
    var body = _.pick(request.body, ['text', 'completed']);
    
    if(!ObjectID.isValid(id)) {
        return response.status(404).send();
    };  
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findOneAndUpdate({
        _id: id,
        _creator: request.user._id
    }, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return response.status(404).send;
        }
        response.send({todo});
    }).catch((error) => {
        response.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (request, response) => {
    request.user.removeToken(request.token).then(() => {
        response.status(200).send();
    }, () => {
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