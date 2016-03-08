module.exports = function(router,app,io)
{
	//middleware for all routes
	router.use(function(req, res, next) {
		// do logging
		//console.log('Something is happening on Sites.');
		
		next();
	});

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.get('/', function(req, res) {
		res.json({ message: 'Welcome to the API Site:D!' });	
	});

	require('./routes/user')(router,app,io);
	require('./routes/site')(router,app,io);
	require('./routes/blog')(router,app,io);
	require('./routes/notification')(router,app,io);
	require('./routes/statistics')(router,app,io);
	// on routes that end in /api
	// ----------------------------------------------------
	
};