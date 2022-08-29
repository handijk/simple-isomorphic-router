# simple-isomorphic-router

Simple isomorphic javascript router that is easily estendable.

- [Installation](#installation)
- [Usage](#usage)
- [Api](#api)

## Installation

```
npm i simple-isomorphic-router
```

## Usage

Match [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) instances to routes.
The only requirement for a route is that it has a `match` method that will return the parameters for a matching `URL` or null if there was no match.
The only provided route with this library is `PathToRegexpRoute` that uses the [path-to-regexp](https://github.com/pillarjs/path-to-regexp) library to match against route path- and hostnames and construct them from parameters.
To use `PathToRegexpRoute` run `npm i path-to-regexp` to install all dependencies.

```js
import { Router, PathToRegexpRoute } from 'simple-isomorphic-router';

const authorUrl = new URL('https://example.com/authors/123');
const bookUrl = new URL('https://example.com/books/123');
const router = new Router();
const route = new PathToRegexpRoute(
  {
    pathname: '/authors/:id',
  },
  { URLSearchParams }
);
router.addRoute(route);
console.log(router.match(authorUrl)); // -> { id: '123' }
console.log(router.match(bookUrl)); // -> null
```

`PathToRegexpRoute` also allows you to match on the hostname too.

```js
import { Router, PathToRegexpRoute } from 'simple-isomorphic-router';

const url = new URL('https://jkrowling.example.com/authors/123');
const router = new Router();
const route = new PathToRegexpRoute(
  {
    pathname: '/authors/:id',
    hostname: ':author.example.com',
  },
  { URLSearchParams }
);
router.addRoute(route);
console.log(router.match(url)); // -> { id: '123', author: 'jkrowling' }
```

Use `PathToRegexpRoute` to construct URL's.

```js
import { PathToRegexpRoute } from 'simple-isomorphic-router';

const route = new PathToRegexpRoute(
  {
    pathname: '/books/:id',
    hostname: ':author.example.com',
  },
  { URLSearchParams }
);
console.log(router.getPathname({ id: 123 })); // -> '/books/123'
console.log(router.getHostname({ author: 'roalddahl' })); // -> 'roalddahl.example.com'
console.log(router.getHref({ author: 'roalddahl', id: 123 })); // -> '//roalddahl.example.com/books/123'
```

All parts of an url can be passed to the the `PathToRegexpRoute` constructor.

```js
import { PathToRegexpRoute } from 'simple-isomorphic-router';

const route = new PathToRegexpRoute(
  {
    pathname: '/books/:id',
    hostname: ':author.example.com',
    hash: 'section3',
    port: 1234,
    protocol: 'https:',
    username: 'someuser',
    password: 'somesecret',
    searchParams: { page: 1 },
  },
  { URLSearchParams }
);
console.log(router.getHref({ author: 'roalddahl', id: 123 })); // -> 'https://roalddahl.example.com:1234/books/123?page=1#section3'
console.log(
  router.getHref(
    { author: 'roalddahl', id: 123 },
    { searchParams: { page: 2 }, replace: true }
  )
); // -> 'https://roalddahl.example.com:1234/books/123?page=2#section3'
```

To roll your own route logic you can extend the `Route` class that allows you to pass a list of matchers.

```js
import { Route } from 'simple-isomorphic-router';

class MyRoute extends Route {
  constructor() {
    super(
      {
        pathname,
        hostname,
        hash,
        port,
        protocol,
        username,
        password,
        searchParams,
      },
      {
        matchers: [
          (url) => {
            // some magic here that will match against the incoming url and return a parameters object in case of a match or null when there was no match
          },
        ],
        URLSearchParams,
      }
    );
  }
}
```

## API

### Router

The `Router` constructor takes no arguments

```js
const router = new Router();
```

#### addRoute(...routes)

Add one or more routes to match against. The only requirement for a route is that it has a `match` method that will get passed an `URL` instance and return the route parameters as an object or `null` when there is no match.

#### match(url: URL)

Can be passed an `URL` instance and returns all parameters found as an object or `null` if there was no match.

### Route

The `Route` constructor takes two arguments, the first is an object of url parts, the second is an options object containing a list of matchers and the global `URLSearchParams` object.

```js
const route = new Route(
  {
    pathname,
    hostname,
    hash,
    port,
    protocol,
    username,
    password,
    searchParams,
  },
  {
    matchers: [
      (url) => {
        // some magic here that will match against the incoming url and return a parameters object in case of a match or null when there was no match
      },
    ],
    URLSearchParams,
  }
);
```

Route methods take an optional `params` argument that is not used by default, but can be used by extending classes.

#### match(url: URL)

Matches the route against an `URL` and returns all parameters found as an object or `null` if there was no match

#### getPathname(params)

returns the route `pathname`

#### getHash(params)

returns the route `hash`

#### getHostname(params)

returns the route `hostname`

#### getPort(params)

returns the route `port`

#### getProtocol(params)

returns the route `protocol`

#### getUsername(params)

returns the route `username`

#### getPassword(params)

returns the route `password`

#### getSearchParams(searchParams = null, replace = false)

returns an [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) instance that will contain the route searchParams. Extended with the searchParams argument (searchParams get merged by default, pass `true` as second argument to replace any existing values)

#### getSearch(searchParams = null, replace = false)

returns the url parameter string based on the route searchParams extended with the searchParams argument, containing a `?` following the parameters of the URL.

#### getHref(params, { searchParams })

returns a full url href string based on the route parts.

### PathToRegexpRoute

The `PathToRegexpRoute` constructor takes two arguments just like the `Route constructor`, with the exception that matchers for the pathname and hostname are provided by default (any other matchers will be added) and that the options object also takes two extra properties; `compileOptions` and `matchOptions` which can be used to provide options to the `compile` and `match` methods of the [path-to-regexp library](https://github.com/pillarjs/path-to-regexp).

```js
const route = new PathToRegexpRoute(
  {
    pathname,
    hostname,
    hash,
    port,
    protocol,
    username,
    password,
    searchParams,
  },
  { URLSearchParams, compileOptions, matchOptions }
);
```
