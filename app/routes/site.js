var jsonwebtoken = require('jsonwebtoken');
var secretKey = "secretKey";
module.exports = function(router, app, io) {
    var modelsSite = require('../models/site');
    var User = require('../models/user');
    var modelNotification = require('../models/notification');


    router.route('/site')
         //get all sites with populate data
    .get(function(req, res) {
        modelsSite.Site.find().select('-posts').populate('assignedBy', '_id name status').populate('assignedTo', '_id name status')
            .exec(function(err, sites) {
                if (err)
                    return res.json(err);
                return res.json(sites);
            });
    })
    // Here we can create a site (accessed at POST http://localhost:8080/api/site)
    
    .post(function(req, res) {
        var site = new modelsSite.Site();
        site.siteName = req.body.siteName;
        site.siteCode = req.body.siteCode;
        site.e1Code = req.body.e1Code;
        site.bsc = req.body.bsc;
        site.description = req.body.description;
        site.assignedBy = req.decoded.id;
        site.assignedTo = req.body.assignedTo;
        site.save(function(err, newSite) {
            if (err)
                return res.json(err);
            ////notification when admin assigned a job someone
            var notification = new modelNotification.Notifications();
            notification.user = site.assignedTo;
            notification.notificationCreatedBy=req.decoded.id;
            notification.desc = "assigned a new job to you";
            notification.siteId = newSite._id;
            notification.read = false;
            notification.type = 'site_assigned';
            notification.save(function(err, newNotification) {
                if (err)
                    return res.json(err);
            });


        modelsSite.Site.findById(newSite._id).select('-posts').populate('assignedBy', '_id name status').populate('assignedTo', '_id name status').exec(function(err, newSiteData) {


            io.emit('siteAction:add', {
                message: 'suucess_add',
                data: newSiteData
            });
        });
            io.emit('chart','reload_data');   //socket action that refresh chart/home page
            return res.json({
                message: 'Site created!',
                data: newSite
            });
        });
    });
    router.route('/site/:siteId')
    //get single site data
    .get(function(req, res) {
        modelsSite.Site.findById(req.params.siteId).populate('assignedBy', '_id name status').populate('assignedTo', '_id name status').populate('posts.author', '_id name image').populate('posts.comments.author', '_id name image')
            .exec(function(err, site) {
                if (err)
                    return res.json(err);
                return res.json(site);
            });
    })
    //update single site
    .put(function(req, res) {
            modelsSite.Site.findById(req.params.siteId, function(err, site) {
                if (err)
                    return res.json(err);
                // var site = new Site();   
                site.siteName = req.body.siteName;
                site.siteCode = req.body.siteCode;
                site.e1Code = req.body.e1Code;
                site.bsc = req.body.bsc;
                site.description = req.body.description;
                site.assignedBy = req.decoded.id;
                site.assignedTo = req.body.assignedTo;
                site.status = req.body.status;
                site.createDate = req.body.createDate;
                site.save(function(err) {
                    if (err)
                        return res.json(err);
                    modelsSite.Site.findById(req.params.siteId).populate('assignedBy').populate('assignedTo')
                        .exec(function(err, site) {
                            if (err)
                                return res.json(err);
                            io.emit('siteAction:edit', {
                                site: [site]
                            }); // broadcast updated
                        });
                    var notification ={};
                    notification.user = site.assignedTo;
                    notification.notificationCreatedBy=req.decoded.id;
                    notification.desc = "Edit a job that have assigned to you";
                    notification.siteId = site._id;
                    notification.read = false;
                    notification.type = 'site_assigned';
                    notification.createDate = Date.now();
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
                    return res.json({
                        message: 'Site updated!'
                    });
                });
            });
        })

//delete site
        .delete(function(req, res) {
            modelsSite.Site.remove({
                _id: req.params.siteId
            }, function(err, site) {
                if (err)
                    return res.json(err);
                io.emit('siteAction:delete', {
                    message: 'suucess_delete',
                    data: req.params.siteId
                });
                 io.emit('chart','reload_data');
                return res.json({
                    message: 'Successfully deleted'
                });
            });
        });
        //import site from CSV
    router.route('/site/import')
        .post(function(req, res) {
            var data = req.body;
            for (var i = 0; i < data.length; i++) {
                var sites = [];
                var site = new modelsSite.Site();
                site.siteName = data[i].siteName;
                site.siteCode = data[i].siteCode;
                site.e1Code = data[i].e1Code;
                site.bsc = data[i].bsc;
                modelsSite.Site.findOneAndUpdate({
                    'e1Code': site.e1Code,
                    'siteCode': site.siteCode
                }, {
                    $setOnInsert: site
                }, {
                    upsert: true,
                    new: true
                }, function(err, numberAffected, rawResponse) { // insert item into db
                    if (err) 
                        return res.json(err);
                        
                          
                        return res.json({message: 'Import done.......'});
                    
                });
            }
            
            io.emit('siteAction:import', 'suucess_import'); //socket action on Import that refresh UI
        });
//multiple delete
    router.route('/site/multipledelete')
        .post(function(req, res) {
            var data = req.body;
            modelsSite.Site.remove({
                _id: {
                    $in: data
                }
            }, function(err, site) {
                if (err)
                return res.json(err);
                io.emit('chart','reload_data');
                io.emit('siteAction:multipleDelete', {
                    message: 'suucess_delete',
                    data: data
                });
                return res.json({
                    message: 'Successfully deleted'
                });
            });
        });
};