
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const user1ID = new ObjectID();
const user2ID = new ObjectID();

const users = [{
    _id: user1ID,
    email: 'andrew@example.com',
    password: 'user1pass',
    tokens: [{
        access: 'Auth',
        token: jwt.sign({_id: user1ID, access: 'Auth'}, 'abc123').toString()
    }]
}, {
    _id: user2ID,
    email: 'bob@example.com',
    password: 'user2pass'
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 222
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {todos, users, populateTodos, populateUsers};