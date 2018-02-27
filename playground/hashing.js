const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(password, salt, (error, hash) => {
        console.log(hash);
    });
});

var hashedPassword = "$2a$10$Ia7.nj/kHzkmcz2ohMmqJ.K3ggliN3sYfkXWPblU./yYMRZjil1O.";

bcrypt.compare(password, hashedPassword, (error, result) => {
    console.log(result);
});

// var data = {
//     id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log('Token:', token);

// var verified = jwt.verify(token, '123abc');
// console.log('Decoded:', verified)


// var message = 'I am user number 3';
// var hash = SHA256('message').toString();

// console.log('Message:', message);
// console.log('Hash:', hash);

// var data = {
//     id: 4
// }
// var token = {
//     data: data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data changed, do not trust');
// }