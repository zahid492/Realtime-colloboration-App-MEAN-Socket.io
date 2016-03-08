module.exports = function(router, app, io) {
    var modelsSite = require('../models/site');
          //get total summary for Home Page
    router.route('/statistics/summary')
        .get(function(req, res) {
          var agg = [
            {$group: {
              _id: "$status",
               total: {$sum: 1}
            }}

          ];

          modelsSite.Site.aggregate(agg, function(err, logs){
            if (err) { return res.json(err); }
            
           
            return res.json(logs);
          });
    });
};