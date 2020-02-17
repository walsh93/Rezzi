# Guide for adding a route

### Step 1
In `Rezzi/server/constants.js` add a url to the `url` json object with the name of the function you want to add followed by the url endpoint you want to call.
*Ex:* I want to add a `/get-channels` endpoint. I go to the url object and add:
```javascript
url: {
	...,
	get_channels: '/get-channels', // Added line
	...
}
```
### Step 2
In Rezzi/server.js add under the `// Routers, links to URLs` comment an `app.use(<endpoint>, <function>)` statement like the others there.
*Ex:* I'm adding the `/get-channels` endpoint, I go to to `Rezzi/server.js` and add:
```javascript
const getchannels = require('./server/routes/get-channel') // Exact route will be specified in step 3*
app.use(url.get_channels /* the url added in step 1 */, getchannels /* the const declared immediately above */)
```
### Step 3
Create a new file in `Rezzi/server/routes/` that is named the same as whatever you put in the `require` in step 2 (this is noted in the starred part of step 2). In this file you will create the code to actually handle the route. I would suggest copying the requires from the other files in `/routes` as most are useful and some are required. If the request type is post, use `router.post('/', function(request, response) {/* function code */})`. If it's get use `router.get('/', ...)` and so on.
*Ex:* I'm adding the get channels endpoint, I create a file named `Rezzi/server/routes/get-channel.js` (file name noted by the `*` in step 2) and then add the relevant code, usually:
```javascript
const express = require('express')
const router = express.Router()
...
/* other imports blah blah, some are probably necessary */
...

router.get('/', function(request, response) {
  const req = request.body;
  console.log("You got the channels! (But actually this did nothing)");
  console.log(req)
})

module.exports = router // Honestly have no clue if this line is needed or not, but it probably is
```
The reason the first argument after `.post` or `.get` in these examples is `'/'` is because you already specified the endpoint in step 2, although it might be helpful to use relative links here. For example if I wanted for some reason to do something special with the channels like change all of the data before I send it back, and I wanted to do this when the endpoint was `/get-channels/riley`, I would write (in `Rezzi/server/routes/get-channel.js)`) `router.get('/riley', ...)`.

The documentation for the service (expressjs) used is [here](https://expressjs.com/en/guide/routing.html). Read through it, but our implementation is a bit different, so view it through the lense of this guide. [This](https://expressjs.com/en/guide/using-middleware.html) page is more close to what we're doing and might provide some useful information.

I hope this helped everybody! Thanks to Kai for helping me out, go to her for questions please lol. (Also guys please review this to make sure it makes sense and is also importantly correct). Sending data back and accessing the database are two more complicated steps which hopefully we can add to this guide later, but for now this is a good basis I think.