const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

module.exports = (app) => {

    app.post('/api/account/signup', (req, res, next) => {
        const { body } = req;
        const {
            firstName,
            lastName,
            password
        } = body;
        let {
            email
        } = body;

        if (!firstName || firstName.length < 5 || firstName.length > 25) {
            return res.send({
                success: false,
                message: 'Error: First name cannot be blank.'
            });
        }
        if (!lastName || lastName.length < 5 || lastName.length > 25) {
            return res.send({
                success: false,
                message: 'Error: Last name cannot be blank.'
            });
        }
        if (!email || email.length < 8 || email.length > 50) {
            return res.send({
                success: false,
                message: 'Error: Email cannot be blank.'
            });
        }
        if (!password) {
            return res.send({
                success: false,
                message: 'Error: Password cannot be blank.'
            });
        }

        email = email.toLowerCase();

        User.find({
            email
        }, (err, previousUsers) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error.'
                });
            } else if (previousUsers.length > 0) {
                return res.send({
                    success: false,
                    message: 'Error: Account already exist.'
                });
            }
            const newUser = new User();

            newUser.email = email;
            newUser.firstName = firstName;
            newUser.lastName = lastName;
            newUser.password = newUser.generateHash(password);
            newUser.save((err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Server error.'
                    });
                }
                return res.send({
                    success: true,
                    message: 'Signed up.'
                });
            });
        });
    });

    app.post('/api/account/signin', (req, res, next) => {
        const { body } = req;
        const {
            password
        } = body;
        let {
            email
        } = body;

        if (!email) {
            return res.send({
                success: false,
                message: 'Error: Email cannot be blank.'
            });
        }
        if (!password) {
            return res.send({
                success: false,
                message: 'Error: Password cannot be blank.'
            });
        }

        email = email.toLowerCase();

        User.find({
            email
        }, (err, users) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Server error.'
                });
            }
            if (users.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid.'
                });
            }

            const user = users[0];
            if (!user.validPassword(password)) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid.'
                });
            }

            let userSession = new UserSession();
            userSession.userId = user._id;
            userSession.save((err, doc) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Server error.'
                    });
                }

                return res.send({
                    success: true,
                    message: 'Valid sign in',
                    token: doc._id
                });
            });
        });
    });

    app.get('/api/account/verify', (req, res, next) => {
        const { query } = req;
        const { token } = query;

        UserSession.find({
            _id: token,
            isDeleted: false
        }, (err, session) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Session error'
                });
            }

            if (session.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                });
            } else {
                return res.send({
                    success: true,
                    message: 'Good'
                });
            }
        });
    });

    app.get('/api/account/logout', (req, res, next) => {
        const { query } = req;
        const { token } = query;

        UserSession.findOneAndUpdate({
            _id: token,
            isDeleted: false
        }, {
                $set: { isDeleted: true }
            }, null, (err, session) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Session error'
                    });
                }

                return res.send({
                    success: true,
                    message: 'Good'
                });
            });
    });

    app.get('/api/users', (req, res, next) => {
        User.find({
            email: {
                $ne: 'new@new.new'
            }
        }).exec((err, users) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Can not get users'
                });
            }

            for (let i = 0; i < users.length; i++) {
                res.write(JSON.stringify({
                    firstNames: users[i].firstName,
                    lastNames: users[i].lastName,
                    emails: users[i].email
                }) + '\r\n');
            }
            return res.end(JSON.stringify({
                success: true,
                message: 'Data sended'
            }));
        });
    });

    app.get('/api/getusers', (req, res, next) => {
        User.findById(
            req.query.id, (err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error: Can not get user by id'
                    });
                }

                return res.send({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    id: user._id
                });
            });
    });
};