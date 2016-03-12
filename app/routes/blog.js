var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var bcrypt = require('bcrypt-nodejs');
var mv = require('mv');
module.exports = function(router, app, io) {
    var User = require('../models/user');
    var modelsSite = require('../models/site');
    var modelNotification = require('../models/notification');

             //post add in site
    router.route('/blog/:siteId').post(function(req, res) {
        modelsSite.Site.findById(req.params.siteId, function(err, site) {
            if (err) {
                res.json({
                    'post': 'Error'
                });
            } else {
                // Let's add the new post
                var post = new modelsSite.Post({
                    postContent: req.body.postContent,
                    author: req.decoded.id,
                });
                site.posts.push(post);
                site.save(function(err) {
                    if (err) {
                        return res.json(err);
                    } else {
                        io.emit('actionBlogPostComment', 'done'); //socket action that refresh UI with update post

                        return res.json('post', {
                            'author': post.author,
                            'post': post
                        });
                    }
                });
            }
        });
    });

     //comment add in respective site and post
    router.route('/blog/:siteId/:postId/comment').post(function(req, res) {

        var comment = new modelsSite.Comment({
            commentContent: req.body.commentContent,
            author: req.decoded.id,
        });
        modelsSite.Site.findOneAndUpdate({
            _id: req.params.siteId,
            'posts._id': req.params.postId
        }, {
            $push: {
                'posts.$.comments': comment
            }
        }, function(err, data) {
            if (err) {
                return res.json(err);
            } else {
                
                var obj = _.find(data.posts, function(obj) {
                    return obj._id == req.params.postId;
                });
                var postNotificationArray = [];
                postNotificationArray.push({
                    id: obj.author
                });
                for (var i = 0; i < obj.comments.length; i++) {
                    postNotificationArray.push({
                        id: obj.comments[i].author
                    });
                }
                var uniques = _.map(_.groupBy(postNotificationArray, function(doc) {
                    return doc.id;
                }), function(grouped) {
                    return grouped[0];
                });
                var notificatiolist = [];
                for (var j = 0; j < uniques.length; j++) {
                    if (uniques[j].id != req.decoded.id) {
                        var notification = {};
                        notification.user = uniques[j].id;
                        notification.notificationCreatedBy=req.decoded.id;
                        notification.desc = "Comment a post that have related to you..";
                        notification.siteId = req.params.siteId;
                        notification.postId = req.params.postId;
                        notification.type = 'comment';
                        notification.read = false;
                        notification.createDate=Date.now();
                        modelNotification.Notifications.findOneAndUpdate({
                            siteId: notification.siteId,
                            user: notification.user,
                            read: false
                        }, notification, {
                            upsert: true,
                            new: true,
                            safe: true
                        }, function(err, newNotification) {
                            if (err) console.log(err);
                        });
                        notificatiolist.push({
                            id: uniques[j].id
                        });
                    }
                }

                io.emit('actionBlogPostComment', 'done'); //socket action that refresh UI with update comment
                return res.json({
                    result: data,
                    notificationlist: notificatiolist
                });
            }
        });
    });

       //comment delete
    router.route('/comment/:siteId/:postId/:commentId/')
    .delete(function(req, res) {

        modelsSite.Site.update({'_id': req.params.siteId,'posts._id':req.params.postId},{$pull: {'posts.$.comments': {'_id': req.params.commentId}}},function(err, data) {
            if (err) {
                return res.json(err);
            } else {
                

                io.emit('actionBlogPostComment', 'done'); //socket action that refresh UI with update data
                return res.json({
                    result: data,
                });
            }
        });
    })
    //comment edit
    .put(function(req, res) {
    
        modelsSite.Site.findById(req.params.siteId,function(err, data) {
            if (err) {
                return res.json(err);
            } else {


                for(var i=0;i<data.posts.length;i++){
                    for(var j=0;j<data.posts[i].comments.length;j++){
                       if(data.posts[i].comments[j]._id==req.params.commentId){
                        

        var comment = new modelsSite.Comment({
            commentContent: req.body.commentContent,
            author: req.decoded.id,
        });
                        data.posts[i].comments[j].commentContent=comment.commentContent;
                        data.save(function(err,result) {
                            if(err)
                                return res.json(err);
                            io.emit('actionBlogPostComment', 'done');  //socket action that refresh UI with update data
                            return res.json(result); 
                       });

    
                    }
                }
                
}

            }
        });
    });

        //post delete
    router.route('/post/:siteId/:postId/')
    .delete(function(req, res) {

        modelsSite.Site.update({'_id': req.params.siteId},{$pull: {'posts': {'_id': req.params.postId}}},function(err, data) {
            if (err) {
                return res.json(err);
            } else {
                

                io.emit('actionBlogPostComment', 'done');  //socket action that refresh UI with update data
                return res.json({
                    result: data,
                });
            }
        });
    })

     //post edit
        .put(function(req, res) {
    
        modelsSite.Site.findById(req.params.siteId,function(err, data) {
            if (err) {
                return res.json(err);
            } else {


                for(var i=0;i<data.posts.length;i++){
                       if(data.posts[i]._id==req.params.postId){

        var post = new modelsSite.Post({
            postContent: req.body.postContent
        });
                        data.posts[i].postContent=post.postContent;
                        data.save(function(err,result) {
                            if(err)
                                return res.json(err);
                            io.emit('actionBlogPostComment', 'done');
                            return res.json(result);
                       });

    
                    }
                
                
}

            }
        });
    });

        //profile data
    router.route('/profile/:userId/').get(function(req, res) {
        User.findById(req.params.userId, function(err, user) {
            if (err) return res.json(err);
            var data = {};
            modelsSite.Site.find({"posts.author":req.params.userId}, {
                "_id": -1,
                "posts": -1
            }).populate('posts.author', '_id name image').populate('posts.comments.author', '_id name image').exec(function(err, data) {
                if (err) {
                    return res.json(err);
                } else {


              for(var j=data.length-1;j>=0;j--){
                for(var i=data[j].posts.length-1;i>=0;i--){
                    //console.log(data[j].posts[i].author._id);
                   
                
                if(data[j].posts[i].author._id!=req.params.userId){
                   data[j].posts.splice(i,1);

                   
                }
              }

          }
                   data.splice(0, 0, {
                        "basic_info": user
                    });


                    return res.json(data);
                }
            });
        });
    });

      //change profille picture
    router.route('/uploadpic/:userId/').post(function(req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            var file = files.file;
            var username = fields.username;
            var tempPath = file.path;
            var extension = path.extname(file.name);
            var randomNo=Math.floor((Math.random() * 100) + 1);
            console.log("Random no"+randomNo);
            var targetPath = path.resolve('./client-side/app/img/user_image/' + req.params.userId+'_'+randomNo+extension);
            console.log(targetPath);
            fs.rename(tempPath, targetPath, function(err) {
                if (err) {
                    return res.json(err);
                }
                var image = req.params.userId +'_'+randomNo+extension;
              //  console.log(image);
                User.update({
                    _id: req.params.userId
                }, {
                    $set: {
                        'image': image
                    }
                }, function(err, data) {
                    if (err) {
                        return res.json({
                            'post': 'Error'
                        });
                    } else {

                        io.emit('ChangeprofilePictureAction','done');
                        return res.json({
                            'post': 'Sucess'
                        });
                    }
                });
            });
        });
    });
//Change password
    router.route('/updatepassword/:userId/').post(function(req, res) {
        var currentPassword = req.body.currentPassword;
        var newPassword = req.body.newPassword;
        var confirmNewPassword = req.body.confirmNewPassword;
        if (currentPassword && newPassword && confirmNewPassword) {
            if (newPassword == confirmNewPassword) {
                User.findOne({
                    _id: req.params.userId
                }).select('name username password').exec(function(err, user) {
                    var validPassword = user.comparePassword(currentPassword);
                    if (validPassword) {
                        // var currentPassword = bcrypt.hashSync(currentPassword); 
                        var check_confirm_new_password = bcrypt.hashSync(confirmNewPassword);
                        User.update({
                            _id: req.params.userId
                        }, {
                            $set: {
                                'password': check_confirm_new_password
                            }
                        }, function(err, data) {
                            if (err) {
                                return res.json({
                                    'post': 'Error'
                                });
                            } else {
                                return res.json({
                                    'message': 'Update done'
                                });
                            }
                        });
                    } else {
                        return res.json({message:"Update failed"});
                    }
                });
            } else {
                return res.json({message:"Password does not match"});
            }
        } else {
            return res.json({message:"Error in Update password"});
        }
  
    });
};