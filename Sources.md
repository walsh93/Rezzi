# Sources, Tutorials, and Other Links
A running list of sources, tutorials, and other links that may be of great use during project development.

## Table of Contents
- [Angular](##Angular)
  * [Set-up and CLI usage](###Set-up-and-CLI-usage)
  * [General tutorials](###General-tutorials)
  * [Using Angular with Firebase](###Using-Angular-with-Firebase)
- [Express JS](##Express-JS)
  * [Routing](###Routing)
  * [NPM packages](###NPM-packages)
    + [Session packages](####Session-packages)
  * [Miscellaneous tutorials](###Miscellaneous-tutorials)
  * [Miscellaneous](###Miscellaneous)
- [Firebase](##Firebase)
  * [Using Firebase with Node.js](###Using-Firebase-with-Node.js)
  * [Using Firebase with Angular](###Using-Firebase-with-Angular)
  * [NPM packages](###NPM-packages-1)

-----
## Angular
This probably won't cover everything, but here are some links that I think may be helpful for Sprint 1. There is a full tutorial on the Angular website ([Tour of Heroes App and Tutorial](https://angular.io/tutorial)) that goes through making a basic application, components, implementing routes, and using data between TypeScript and HTML files. It doesn't hook the app up to a server, but in terms of learning raw Angular, it covers a lot of the basics that we'll probably use to construct the core of the website.

Note: For `ng serve` and `ng build`, we can configure the commands so we just have to run one command and the project is automatically built before the server runs. Still just thought these may be useful sources.

### Set-up and CLI usage
- [Setting up the Local Environment and Workspace](https://angular.io/guide/setup-local)
- [CLI Overview and Command Reference](https://angular.io/cli)
- [ng build](https://angular.io/cli/build)
  * I believe we use `ng build` when we want to update our static pages. So once we make edits to a page, in order for the server to have access to those updated pages, we must run `ng build` before running the server, otherwise, the server will render the files created at last build.
- [ng serve](https://angular.io/cli/serve)
  * I believe we use `ng serve` when we don't really need the server to run, but we want to see what our pages look like. From what I remember, if you run `ng serve` or something, you should be able to see the webpage change dynamically as you make changes to it, which could be really useful during the page creation phase(s).

### General tutorials
- [Angular 8 Tutorial - 4 - Components](https://www.youtube.com/watch?v=16rQyEQtpyQ)
  * Video tutorial showing how to create and use Angular components
- [Routing](https://angular.io/start/routing)
  * Routing in Angular is separate from routing in Node.js, so we have to make sure that the Angular routes corresponding to our Node routes.
- [Managing Data](https://angular.io/start/data)
  * This is a good starting point for how we can use data from the backend and load it into Angular HTML pages on the frontend.
- [HTTP](https://angular.io/tutorial/toh-pt6)
  * This is a page from the tutorial, but I think this may be a really helpful page for when we are sendng data from Angular to the backend. Kai overcomplicated it during 307, so the methods described here may make it a little more manageable.

### Using Angular with Firebase
- [Angular + Firebase + Typescript — Step by step tutorial](https://medium.com/factory-mind/angular-firebase-typescript-step-by-step-tutorial-2ef887fc7d71)
  * A simple step-by-step tutorial showing how Firebase and Angular can be incorporated within the same application. This example uses the *real-time* database.

-----
## Express JS
Node.js web framework, mostly used for routing, implementing HTTP requests (GET, POST, etc.), and handling user sessions.

### Routing
- [Basic routing](https://expressjs.com/en/starter/basic-routing.html)
  * Simple routing/handling various HTTP requests.
- [Serving static files in Express](https://expressjs.com/en/starter/static-files.html)
  * Allow express to access the webpages, images, and other files we use in our application.
- [Routing](https://expressjs.com/en/guide/routing.html)
  * Goes into a little more detail on how to route using RegEx expressions on URL paths, handle parameters (URL segments), and implement route handlers (good for checking user credentials as they try to access a new page).
  * Also shows how to create and use Routers, which are especially useful for breaking up the server so we don't have one 2000-line server file.
- [Writing middleware for use in Express apps](https://expressjs.com/en/guide/writing-middleware.html)
- [Using middleware](https://expressjs.com/en/guide/using-middleware.html)
  * The above two links go more in-depth on what middleware in Express is and how to use it. This could helpful for when we design callback functions and/or other functions we want to execute on certain paths.
- [Handle GET and POST Request in Express 4](https://codeforgeek.com/handle-get-post-request-express-4/)

### NPM packages
- [express](https://www.npmjs.com/package/express)
- [body-parser](https://www.npmjs.com/package/body-parser)

#### Session packages
As of now (Feb. 3, 2020), we have not decided on a session package to implement in the server. Below are the current candidates:

- [express-session npm package](https://www.npmjs.com/package/express-session)
- [client-sessions npm package](https://www.npmjs.com/package/client-sessions)
  * This is what some of the group used in 307 and 408
- [js-cookie npm package](https://www.npmjs.com/package/js-cookie)
- [cookie npm package](https://www.npmjs.com/package/cookie)

### Miscellaneous tutorials
- [Using template engines with Express](https://expressjs.com/en/guide/using-template-engines.html)

### Miscellaneous
- [Best Essential Packages for Nodejs Application Development](https://medium.com/@Jessicawlm/best-essential-packages-for-nodejs-application-development-46a2ca817fa0)

---
## Firebase
This includes stuff about the corresponding NPM packages, database usage, cloud functions, etc.

### Using Firebase with Node.js
- [Add the Firebase Admin SDK to Your Server](https://firebase.google.com/docs/admin/setup)
  * We need to set up admin functionality so our web app/server has access to the Firebase database, cloud functions, and other Firebase functionality we decide to implement.
- [Add data to Cloud Firestore](https://firebase.google.com/docs/firestore/manage-data/add-data)
  * Includes adding brand new data, overwriting data, and updating data.
- [Delete data from Cloud Firestore](https://firebase.google.com/docs/firestore/manage-data/delete-data)
- [Get data with Cloud Firestore](https://firebase.google.com/docs/firestore/query-data/get-data)
  * This source is good for cases where you know the document ID you want, so all you need to do is tell the database to get that ID.
- [Perform simple and compound queries in Cloud Firestore](https://firebase.google.com/docs/firestore/query-data/queries)
  * This source is good for cases where we know something about the document we want (like an email, status, etc.), but we don't know the ID, we want to get all the documents that match a certain criteria, etc.

### Using Firebase with Angular
- [Angular + Firebase + Typescript — Step by step tutorial](https://medium.com/factory-mind/angular-firebase-typescript-step-by-step-tutorial-2ef887fc7d71)
  * A simple step-by-step tutorial showing how Firebase and Angular can be incorporated within the same application. This example uses the *real-time* database.

### NPM packages
- [firebase npm package](https://www.npmjs.com/package/firebase)
- [firebase-admin npm package](https://www.npmjs.com/package/firebase-admin)
  * This package is needed to we can do Firebase stuff in the server.
