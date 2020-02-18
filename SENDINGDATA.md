# Guide for general data transfer from frontend to backend (or backend to frontend)

This will hopefully elaborate on how sending and receiving data happens and what needs to happen in terms of function calls and HTTP requests.

## Frontend to backend (ie. the easier one)
Coming soon! For now, just reference `app/sign-in/sign-in-form` component. The Typescript file directly makes the http call to the backend, and the service is not needed.

## Backend to frontend (ie. the harder one)

This is when a component needs data from the backend (like the server or the database). The diagram for this can be seen in `./images/backfrontdata.png`, but hopefully the stuff below can elaborate on that image. While we can probably technically avoid using the `service` file, but Angular documentation "heavily recommends against" that. So we're using the `service`. Here's how!

Note: the simplest version of this (and will probably be used on most of the pages we will make) is the `getSession()` function in the `service.ts` file. You can follow the calls and data transfer through `home.component.ts`, `rezzi.service.ts`, and `/server/service/getSession.js` (there are other places this is used, I am just pointing out one of them).

1. The component's TypeScript file needs to call a `service` function, let's call it `getUsers()` for sake of the argument (and because I know we'll need that eventually), which will be defined in `rezzi.service.ts` (that's step 2). Since you need the service module, you need to add `private rezziService: RezziService` to the component's constructor. The function in the TypeScript file will need to make the call to `getUsers()`, and because the `service` functions are asynchronous, the TypeScript function will have a `.then()` statement that receives the data returned from the backend (more on this later). It will probably look something like this:
```typescript
this.rezziService.getUsers().then((data_from_backend) => {
  // user data_from_backend...
});
```
2. The function being called by the component, let's call it `getUsers()` for sake of the argument (and because I know we'll need that eventually), is defined in `rezzi.service.ts`. All this really needs to do is make the HTTP request to the desired link (which will be defined in the next step or so), and because HTTP requests are asynchronous, it needs a promise handler and a `.then()` block in order to obtain and do stuff with the data. All the service really has to do with the data is return it. Taking the `getUsers()` example, let's say we make a server link at `/get-users`. The function will look like this in the `service` file:
```typescript
getUsers(): Promise<any> {
  return this.http.get('/get-users').toPromise().then((data_from_backend) => {
    return data_from_backend;
  });
}
```
3. Like when you're making a new route, you need to make a "route" (endpoint) for `getUsers()`, otherwise the service's request will never get a response. Make a new file, let's say `get-users.js` in the `/server/service` directory. Everything in that file will be a lot like what "regular" routing files look like. This is where the queries to the database will happen, so the bulk of it will probably look something like this:
```javascript
... // necessary imports and such

router.get('/', checkCookie, function(request, response) {
  db.collection('users').get().then((snapshot) => {
    /**
     * You may not want to send the entire Firestore document object, you may just
     * want to extract a few fields from each user document. That is what I'm
     * doing in this example, but you can keep as many or as few fields as you would
     * like. If you want to send everything in the document, then you can just send
     * the entire variable `snapshot` back to the frontend. 
     */

    let users = []
    snapshot.forEach((user) => {
      const data = user.data()
      const user = {
        fname: data.firstName,
        lname: data.lastName
      }
      users.push(user)
    }
    response.status(http.ok).json({ users: users })  // will be accessed as data_from_backend in prev code blocks
  }).catch((error) => {
    console.log('Error getting documents', error)
    response.status(http.conflict).json(null)
  })
})

module.exports = router
```
4. You also need to put this route and the respective URL in the `server.js`, just like with normal routes.
```javascript
const getusers = require('./server/routes/get-users')
app.use('/get-users', getusers)
```
5. As it is so far, the component makes a call to the service, which makes a request to the backend. The backend is returning a list of users to the service. The service then returns that data to the component, which can use/display/etc. the data. So now, looking at the first code block, `data_from_backend` is now the array of users you created in `get-users.js` and you can access the properties like a normal object (because the `const user` we made in `get-users` was in an object structure). NOTE! When the response json-ed the users array, it gave the key `users` with the value as the array, so you have to use the `.users` property on `data_from_backend`. You might not have to put a key in the response JSON; just `json(users)` so then `data_from_backend` is the array itself. Not 100% sure, though. But I digress:
```typescript
this.rezziService.getUsers().then((data_from_backend) => {
  // data_from_backend.users = users[]
  // first_users_last_name = data_from_backend.users[0].lname
});
```


Hope that was helpful! Sorry if it sounds really redundant at times, I just figured too much detail is better than not enough in this case. If anything isn't clear or something isn't correct, let me know! Thanks. :)
