<h4>Realtime Telecom Industry Colloboration applicaton(Mini Domain)</h4>

This project inspired by facebook specially comment and notification system developed by MEAN(Mongo,Express Js,Angular JS,Node JS) & Socket.io.

Little Description:
Admin can assigned a new job to the engineers. Engineers of a telecom company can collaborate there task to the others engineer,they post task(site) specific issue and thread of an specific task(site) ,may have some discuss on this topics. And when engineer get a job they change job status(Complete,Implementation,Hault). Finally some socket always run in the backend if any change of data then it affects on other Engineers realtimely, when someone comment on a post then all related member of that post found a notification like as facebook.

NODE-API

This is a simple Nodejs API, using MongoDB for persistence, and use mongoose wrapper. Gulp for task automation and mocha for API testing.


How to use:
Clone the repo and run: 

	npm install

After that, change the mongodb Uri in database config object at app/config/db.js

Finally, run:

	node server.js

And you can start making requests to the defined routes. :D


Testing:
Simple tests were provided, but soon I'll make them better.
To test the API (since its started) run:

	mocha

Task automation:
A JSHint task was provided and it can be started with

	gulp


