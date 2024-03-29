# Developer Notes

## `ng serve` dynamic page edits
If you run `ng serve`, you can open up local host at the specified port and see live changes you make to components.

## Running the project
If you are working with HTML and want to see the dynamic changes, you can use `ng serve`. If you want to see the update HTML stuff work with the server, you can use `npm start`. If you just edited stuff on the server and want to make sure it works and you DIDN'T update the Angular/HTML stuff, you can use `node server.js`.

## NPM dependencies
If you add any, be sure to use the `--save` tag so it gets saved to package.json. That way, everyone else can get those packages by running `npm install`.

## Routing
Components are automatically added to app.module.ts, but you may have to manually add them to app-routing.module.ts. That is where all of our paths and such will be defined.

## Router outlet in app.component.html
Angular is pretty much a single-page application where the root page (I think it's technically the index.html page, but for simplicity we'll say it's app.component.html) is ultimately a "parent" page that can swap components in and out through the router-outlet (I'm calling it RO) tag. So when the pages are made static during an `ng build`, it will be as if any code that is in a component's HTML file is substituted in where that RO is. That said, when working with component HTML files, you don't need to redefine the `doctype` or `body` tag or any of that because the RO is already encased in those tags. However, anything outside of the RO (so, if we add anything to app.component.html) will not be rotated in and out with routing, and will then appear on every single page. So things like a navigation bar, our logo, or other things we want to keep consistent, may be good things to put here.

## Routers
When defining the URLs in the routers, they are relative to the links you put in server.js. For instance, if you say `app.use('/link', router)`, and then in the router.js file you put `router.get('/nerp')...`, then this router's GET request will respond to the URL .../link/nerp.

## HttpClient, Services, and general HTTP requests
When making simple requests that don't require fetching/handling data, then you can just make a direct HTTP call. However, if you are using data (ie. requesting data from the database), then you should use a service to act as a middle man for the data.