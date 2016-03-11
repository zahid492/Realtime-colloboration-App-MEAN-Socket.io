<h4>Realtime Telecom Industry Colloboration applicaton(Mini Domain)</h4>

This project inspired by facebook specially comment and notification system developed by MEAN(Mongo,Express Js,Angular JS,Node JS) & Socket.io.

<b>Little Description:</b>
Admin can assigned a new job to a engineer and respective engineer get job assigned notification.If any issue of the assigned job ,engineers of a telecom company can collaborate there task to the others engineer,they post task(site) specific issue and thread of an specific task(site) ,may have some discuss on this topics. And when engineer get a job they change job status(Complete,Implementation,Hault). Finally some socket always run in the backend if any change of data then it affects on other Engineers realtimely, when someone comment on a post then all related member of that post found a notification like as facebook.

<a href="http://telecom-zahid492.rhcloud.com/">Check out the live example!</a>


<b>SEEVER-SIDE:</b>

This is a simple Nodejs API, using MongoDB for persistence, and use mongoose wrapper. Gulp for task automation and mocha for API testing.


Installation

1.Clone the repository: git clone https://github.com/zahid492/Realtime-colloboration-App-MEAN-Socket.io.git</br>
2.Install the NodeJS dependencies: npm install.</br>
3.Install the Bower dependencies: bower install.</br>
4.After that, change the mongodb Uri in database config object at app/config/db.js</br>
5.Run the api: node server.js.</br>
6.Run the gulp default task: gulp. This will build any changes made automatically, and JSHint task setup that watch api error and show in terminal</br>
      http://localhost:8888.</br>

Testing:
Simple tests were provided, but soon I'll make them better.
To test the API (since its started) run:

	mocha
	
<b>Modules & Packages</b>
     </br>
    <a href="http://expressjs.com/">Express</a> </br>
    <a href="https://github.com/expressjs/body-parser">Body Parser</a </br>
    <a href="https://github.com/felixge/node-formidable">Formidable(File uploading)</a> </br>
    <a href="https://www.npmjs.com/package/mongodb">Mongodb</a> </br>
    <a href="https://www.npmjs.com/package/mongoose">Mongoose(Mongodb wrapper)</a> </br>
    <a href="https://www.npmjs.com/package/morgan">Morgan(Log)</a> </br>
    <a href="https://www.npmjs.com/package/socket.io">Socket.io</a> </br>
    <a href="https://www.npmjs.com/package/underscore">Underscore</a> </br>
    <a href="https://www.npmjs.com/package/bcrypt-nodejs">Bcrypt Node Js(Hashing Password)</a> </br>
    <a href="https://www.npmjs.com/package/json-web-token">Jsonwebtoken(JSON Web Token (JWT) is a compact token format intended for space)</a> </br>
    <a href="https://www.npmjs.com/package/gulp">Gulp(Task Runner)</a> </br>
    <a href="https://www.npmjs.com/package/chakram">Chakram(Testing)</a> </br>
    <a href="https://www.npmjs.com/package/jshint">Jshint(Watch error)</a> </br>


	
	



