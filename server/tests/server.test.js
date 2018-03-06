const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, users, populateTodos, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((response) => {
            //expect(response.headers['x-auth']).toExist();
            //expect(response.headers['x-auth']).to.be.a('string');
        })
        .end((error, result) => {
            if(error){
                return done(error);
            }
            User.findById(users[1]._id).then((user) => {
                // expect(user.tokens[0]).toInclude({
                //     access: 'Auth',
                //     token: result.headers['x-auth']
                // });
                done();
            }).catch((error) => done(error));
        });
    });
    it('should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email + '1',
            password: users[1].password
        })
        .expect(400)
        .expect((response) => {
            //expect(response.headers['x-auth']).toNotExist();
        })
        .end((error, result) => {
            if(error){
                return done(error);
            }
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((error) => done(error));
        });
    });
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((response) => {
                expect(response.body.text).toBe(text);
            })
            .end((error, response) => {
                if(error) {
                    return done(error);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((error) => done(error));
            })
    });

    it('should not create todo with invalid data', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((error, response) => {
            if(error) {
                return done(error);
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((error) => done(error));
        });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((response) => {
            expect(response.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((response) => {
            expect(response.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    })
    it('should return a 404 if todo not found', (done) => {
        var hexID = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hexID}`)
        .expect(404)
        .end(done);
    })
    it('should return 404 for non-object ids', (done) => {
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);
    })
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexID = todos[1]._id.toHexString();
        request(app)
        .delete(`/todos/${hexID}`)
        .expect(200)
        .expect((response) => {
            expect(response.body.todo._id).toBe(hexID);
        }).end((error, response) => {
            if(error) {
                return done(error);
            }
            Todo.findById(hexID).then((todo) => {
                expect(todo).toBe(null);
                done();
            }).catch((error) => done(error));
        });
    });
    it('should return a 404 if todo not found', (done) => {
        var hexID = new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${hexID}`)
        .expect(404)
        .end(done);
    })
    it('should return 404 for non-object ids', (done) => {
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
    })
});

    describe('PATCH /todos/:id', () => {
        it('should update the todo', (done) => {
            var hexID = todos[0]._id.toHexString();
            var text = 'test todo text';
            var completed = true;
            request(app)
            .patch(`/todos/${hexID}`)
            .send({text, completed})
            .expect(200)
            .expect((response) => {
                expect(response.body.todo._id).toBe(hexID);
                expect(response.body.todo.text).toBe(text);
                expect(response.body.todo.completed).toBe(true);
                //expect(response.body.todo.completedAt).toBeA('number');
            }).end(done);
        });
        it('should clear completedAt when todo is not completed', (done) => {
            var hexID = todos[1]._id.toHexString();
            var text = 'test todo text 2';
            var completed = false;
            var completedAt = null;
            request(app)
            .patch(`/todos/${hexID}`)
            .send({text, completed, completedAt})
            .expect(200)
            .expect((response) => {
                expect(response.body.todo._id).toBe(hexID);
                expect(response.body.todo.text).toBe(text);
                expect(response.body.todo.completed).toBe(false);
                expect(response.body.todo.completedAt).toBe(null);
            }).end(done);

        });
});
describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((response) => {
            expect(response.body._id).toBe(users[0]._id.toHexString());
            expect(response.body.email).toBe(users[0].email);
        })
        .end(done);
    });
    it('should return a 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((response) => {
            expect(response.body).toEqual({});
        })
        .end(done);
    });
});
describe('POST /users', () => {
    it('should create a user', (done) => {
        email = 'example@example.com';
        password = '123abc';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((response) => {
            // expect(response.headers['x-auth']).toBeA('string');
            // expect(response.body._id).toBeA('string');
            expect(response.body.email).toBe(email);
        })
        .end((error) => {
            if(error) {
                return done(error);
            }
            User.findOne({email}).then((user) => {
                //expect(user).toBe(!null);
                //expect(user.password).toBe(!password);
                done();
            }).catch((error) => done(error));
        });
    });
    it('should return a return validation errors if request invalid', (done) => {
        email = '';
        password = '';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
    });
    it('should not create a user if email is in use', (done) => {
        email = 'andrew@example.com';
        password = 'abc123';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
    });
});