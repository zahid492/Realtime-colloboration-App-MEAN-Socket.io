 var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NotificationSchema = new Schema({
  'user': {
    'type': Schema.Types.ObjectId,
    'ref': 'User'
  },  
  'notificationCreatedBy': {
    'type': Schema.Types.ObjectId,
    'ref': 'User'
  },
  'desc': String,
  'read': Boolean,
  'siteId':{
    'type': Schema.Types.ObjectId,
    'ref': 'Site'
  },
  'postId':{
    'type': Schema.Types.ObjectId,
    'ref': 'Post'
  },
  'type':String,
  'createDate': {
    'type': Date,
    'default': Date.now
  }
});

var Notifications = mongoose.model('Notifications', NotificationSchema);



//  fetch the unread notifications 
function getNotifications(id) {
    return Notifications.find({'user':id,'read': false})
        .sort('createdTimestamp')
        .populate('user')
        .exec();
}

/* Queries the db to fetch the other 10 older notifications*/
// function getOldNotifications(date) {
//     return Notifications.find({'createdTimestamp': {'$lt': date}})
//         .sort('-createdTimestamp')
//         .limit(10)
//         .populate('user')
//         .exec();
// }

module.exports = {
    'Notifications':Notifications,
    'getNotifications': getNotifications
};




