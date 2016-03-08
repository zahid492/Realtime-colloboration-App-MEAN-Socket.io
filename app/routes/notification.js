var jsonwebtoken = require('jsonwebtoken');
var secretKey = "secretKey";
module.exports = function(router, app, io) {
    var model = require('../models/site');
    var User = require('../models/user');
    var modelNotification = require('../models/notification');
    router.route('/notification/:userId')
    //get notification
        .get(function(req, res) {
            modelNotification.Notifications.find({
                    user: req.params.userId
                }).limit(10).populate('user', '_id name role').populate('notificationCreatedBy', '_id name image')
                .exec(function(err, site) {
                    if (err)
                        return res.json(err);
                    return res.json(site);
                });
        })

        //change status that of unread to read
    .put(function(req, res) {
        var unreadNotifications = [];
        modelNotification.getNotifications(req.params.userId).then(function(notifs) {
            unreadNotifications = notifs;
            unreadNotifications.map(function(notif) {
                notifIdList = notif._id;
                modelNotification.Notifications.update({
                    '_id': {
                        '$in': notifIdList
                    }
                }, {
                    '$set': {
                        'read': true
                    }
                }, {
                    'multi': true
                }).exec().then(function(err, result) {
                    if (err)
                        return res.json(err);
                    return res.json(result);
                });
            });
        });
    });
};