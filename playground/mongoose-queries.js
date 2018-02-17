const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5a870e1279aa31a6de0f0d86';

User.findById(id).then((user) => {
        if(!user){
            return console.log('Id not found');
        }
        console.log('Users', user);
    }).catch((error) => {
        console.log(error);
    });

// User.find({
//     _id: id
// }).then((users) => {
//     console.log('Users', users);
// });

// var id = 'aaa5a8705c821ec0c4e1440753b';

// if(!ObjectID.isValid(id)) {
//     console.log('Id not valid');
// };

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todos', todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo){
//         return console.log('Id not found');
//     }
//     console.log('Todos', todo);
// }).catch((error) => {
//     console.log(error);
// });