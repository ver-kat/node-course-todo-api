const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}, (result) => {
//     console.log(result);
// });

Todo.findByIdAndRemove('5a88ba3379aa31a6de0f4dd6').then((todo) => {
    console.log(todo, 'removed');
});