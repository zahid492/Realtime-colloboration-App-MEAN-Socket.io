var jsonwebtoken = require('jsonwebtoken');
var secretKey = "secretKey";

               //create token by JWT (JSON WEB TOKEN)
function createToken(user) {
    var token = jsonwebtoken.sign({
        id: user._id,
        username: user.username,
        name:user.name,
        role: user.role
    }, secretKey, {
        expirtesInMinute: 1440
    });
    return token;
}
module.exports = function(router, app, io) {
    //Importing user model
    var User = require('../models/user');
    //Define the route as /user, when called it must be like xxx:xxx/api/user
    router.route('/user')
    // get all the users (accessed at GET http://localhost:8080/api/user)
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    })
    // Here we can create a user (accessed at POST http://localhost:8080/api/user)
    .post(function(req, res) {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;
        user.role = req.body.role;
        user.designation = req.body.designation;
        var token = createToken(user);
        //Every mongoose Schema has a save method						
        user.save(function(err, newUser) {
            if (err)
                return res.json(err);
            //res means response, so the API will send a response with a message;
            io.emit('userAction:add', {
                message: 'suucess_add',
                data: newUser
            });
            return res.json({
                success: true,
                message: 'User has been created!',
                token: token
            });
        });
    });
      // get singles  users (accessed at GET http://localhost:8080/api/user/xxx)
    router.route('/user/:userId')
    .get(function(req, res) {
        User.findById(req.params.userId, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
      // update singles  users (accessed at GET http://localhost:8080/api/user/xxx)
    .put(function(req, res) {
        User.findById(req.params.userId, function(err, user) {
            if (err)
                res.send(err);
            //The user retrieved from the database is "updated"
            user.name = req.body.name;
            user.role = req.body.role;
            user.designation = req.body.designation;
            user.status = req.body.status;
            user.save(function(err) {
                if (err)
                    return res.json(err);
                //socket action when edit complete that refresh UI in  client side
                io.emit('userAction:edit', {
                    message: 'suucess_add',
                    user: [user]
                });
                return res.json({
                    success: true,
                    message: 'User has been created!'
                });
            });
        });
    })
    // delete singles  users (accessed at GET http://localhost:8080/api/user/xxx)
    .delete(function(req, res) {
        User.remove({
            _id: req.params.userId
        }, function(err, user) {
            if (err)
                return res.json(err);
            //socket action when delete complete that refresh UI in  client side
            io.emit('userAction:delete', {
                message: 'suucess_delete',
                data: req.params.userId
            });
            return res.json({
                message: 'User successfully deleted'
            });
        });
    });
        //check unique user in db
    router.route('/user/username/:username')
    .get(function(req, res) {
        User.find({username:req.params.username}, function(err, user) {
            if (err)
                return res.json(err);
           return  res.json(user);
        });
    });
    //login action
    router.route('/login')
        .post(function(req, res) {
            User.findOne({
                username: req.body.username,status:1
            }).select('name username password status role createDate image').exec(function(err, user) {
                if (err) throw err;
                if (!user) {
                    return res.json({
                        message: "User doenst exist"
                    });
                } else if (user) {
                    var validPassword = user.comparePassword(req.body.password);
                    if (!validPassword) {
                        return res.json({
                            message: "Invalid Password"
                        });
                    } else {
                        ///// token
                        var token = createToken(user);
                        var data = {};
                        data._id = user._id;
                        data.role=user.role;
                        data.name=user.name;
                        return res.json({
                            success: true,
                            message: "Successfuly login!",
                            token: token,
                            data: data
                        });
                    }
                }
            });
        });

//multiple delete
    router.route('/user/multipledelete')
        .post(function(req, res) {
            var data = req.body;
          User.remove({
                _id: {
                    $in: data
                }
            }, function(err, site) {
                if (err)
                return res.json(err);
                io.emit('chart','reload_data');
                io.emit('userAction:multipleDelete', {
                    message: 'suucess_delete',
                    data: data
                });
                return res.json({
                    message: 'Successfully deleted'
                });
            });
        });


    router.use(function(req, res, next) {
        var token = req.body.token || req.headers['x-access-token'];
        // check if token exist
        if (token) {
            jsonwebtoken.verify(token, secretKey, function(err, decoded) {
                if (err) {
                    res.status(403).send({
                        success: false,
                        message: "Failed to authenticate user"
                    });
                } else {
                    //
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(403).send({
                success: false,
                message: "No Token Provided"
            });
        }
    });
/*    router.get('/login', function(req, res) {
        res.json("hello World");
    });*/
};