# Sources, Tutorials, and Other Links
A running list of sources, tutorials, and other links that may be of great use during project development.

## Table of Contents
- [Angular](#angular)
  * [Set-up and CLI usage](#set-up-and-cli-usage)
  * [General tutorials](#general-tutorials)
  * [Using Angular with Node.js](#using-angular-with-nodejs)
  * [Using Angular with Firebase](#using-angular-with-firebase)
- [Express JS](#express-js)
  * [Routing](#routing)
  * [NPM packages](#npm-packages)
    + [Session packages](#session-packages)
  * [Miscellaneous tutorials](#miscellaneous-tutorials)
  * [Miscellaneous](#miscellaneous)
- [Firebase](#firebase)
  * [Using Firebase with Node.js](#using-firebase-with-nodejs)
  * [Using Firebase with Angular](#using-firebase-with-angular)
  * [NPM packages](#npm-packages-1)

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
  * [Angular 6 Url Parameters](https://medium.com/better-programming/angular-6-url-parameters-860db789db85)
  * [Activated Route](https://angular.io/guide/router#activated-route)
    + These are good references if you need URL parameters in Angular
- [Managing Data](https://angular.io/start/data)
  * This is a good starting point for how we can use data from the backend and load it into Angular HTML pages on the frontend.
- [HTTP](https://angular.io/tutorial/toh-pt6)
  * This is a page from the tutorial, but I think this may be a really helpful page for when we are sendng data from Angular to the backend. Kai overcomplicated it during 307, so the methods described here may make it a little more manageable.
- [HttpClient](https://angular.io/guide/http)
  * A little more about what the HTTP feature (in the Heroes tutorial) is and what it can be used for.
- [Services](https://angular.io/tutorial/toh-pt4)
  * These are good for passing data between unrelated classes. Because apparently components should fetch/save data directly (?). The fetching and such should be done through a service, and that service can pass the data on to the desired component(s).
- [User Input](https://angular.io/guide/user-input)
  * This is a good source for linking HTML elements to user actions in Angular. Ie. on a button click/key stroke, perform a certain action.

### Using Angular with Node.js
- [MEAN App with Angular 2 and the Angular CLI](https://scotch.io/tutorials/mean-app-with-angular-2-and-the-angular-cli)
  * A simple step-by-step tutorial showing how Angular can work with a Node.js backend. This example doesn't use Firebase.

### Using Angular with Firebase
- [angularfire Installation and Setup](https://github.com/angular/angularfire/blob/master/docs/install-and-setup.md)
- [Documents in AngularFirestore](https://github.com/angular/angularfire/blob/master/docs/firestore/documents.md)
- [Angular + Firebase + Typescript — Step by step tutorial](https://medium.com/factory-mind/angular-firebase-typescript-step-by-step-tutorial-2ef887fc7d71)
  * A simple step-by-step tutorial showing how Firebase and Angular can be incorporated within the same application. This example uses the *real-time* database.
- [Firebase Firestore and Angular TODO List Application](https://medium.com/@coderonfleek/firebase-firestore-and-angular-todo-list-application-d0fe760f6bca)
  * Another simple tutorial showing how Firebase and Angular can be used together.

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
