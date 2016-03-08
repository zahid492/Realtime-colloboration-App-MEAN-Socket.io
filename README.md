NODE-API

This is a simple Nodejs API, using MongoDB for persistence, Gulp for task automation and Chakram for API testing.


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


I am really interested in making this a slush generator soon.
