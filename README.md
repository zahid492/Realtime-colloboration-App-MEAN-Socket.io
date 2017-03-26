**Realtime Telecom Industry Colloboration applicaton(Mini Domain)

This project inspired by facebook specially comment and notification system developed by `MEAN(Mongo,Express Js,Angular JS,Node JS) & Socket.io.`

**Little Description** </br>
Admin can assigned a new job to a engineer and respective engineer get job assigned notification.If any issue of the assigned job ,engineers of a telecom company can collaborate there task to the others engineer,they post task(site) specific issue and thread of an specific task(site) ,may have some discuss on this topics. And when engineer get a job they change job status(Complete,Implementation,Hault). Finally some socket always run in the backend if any change of data then it affects on other Engineers realtimely, when someone comment on a post then just only all related member of that post found a notification like as facebook.




|   | Admin  | User1  |User2   |
|---|---|---|---|
| Username  | admin |  user1 | user2  |
| Password  |123123123   |123123123   |  123123123 |


I attached few credential,please connect all in at a time in different browser,then admin assigned job a user category then see in user browser a floating Notification like as facebook, and if any one comment on a specific site(inside site) then a notification sent to the all related person of that post. 


<a href="http://telecom-zahid492.rhcloud.com/">Check out the live example!</a>


<b>Server Side(Node JS,Express JS,Mongo DB):</b>

This is a simple Nodejs API, using MongoDB for persistence, and use mongoose wrapper. Gulp for task automation and mocha for API testing.


Installation

1.Clone the repository: `git clone https://github.com/zahid492/Realtime-colloboration-App-MEAN-Socket.io.git`</br>
2.Install the NodeJS dependencies: `npm install`.</br>
3.Install the Bower dependencies: `bower install`.</br>
4.After that, change the mongodb Uri in database config object at `app/config/db.js`</br>
5.Run the api: `node server.js`.</br>
6.Run the gulp default task: `gulp`. This will build any changes made automatically, and JSHint task setup that watch api error and show in terminal</br>
      `http://localhost:8080`.</br>

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
    
<b>Client Side(Angular JS):</b> </br>
Installation(For Development):</br>
 1.Change the root dircory & `cd client-side` </br>
 2.Using grunt task runner for the client side,it helps us to show JS error by JS hint,it's so powerful for minified HTML,CSS,JS and it also help us to production ready program. --</br>
 
 To run this program
 `grunt serve`(Development Phase) </br>
 `grunt serve:dist`(Production deployment) 
 
 <b>Modules & Packages</b> </br>
 <a href="https://github.com/angular-ui/ui-router">Ui-Router</a></br>
 <a href="https://github.com/asafdav/ng-csv">ngCsv</a></br>
 <a href="http://jtblin.github.io/angular-chart.js/">Chart.js</a></br> 
 <a href="https://github.com/btford/angular-socket-io">btford.socket-io</a></br> 
 <a href="https://github.com/urish/angular-moment">Angular Moment</a></br> 
 
 
 Testing:
 In future i try to some E2E testing by protractor sellenium webdriver.
 
 If you fell free to contact with me...`zahidcse09@gmail.com`
 
  
 



	
	



