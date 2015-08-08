# Havana component compiler

[![Build Status](https://travis-ci.org/colinmeinke/havana-component-compiler.svg?branch=master)](https://travis-ci.org/colinmeinke/havana-component-compiler)

A component compiler.

Havana component compiler works with an HTML response
handler such as
[Havana component handler](https://github.com/colinmeinke/havana-component-handler)
or a library with an interchangeable API. When a response
handler publishes a `components.compile` event Havana
component compiler will iterate over the components array
and in turn publish a `component.render` event for each
component. It is Havana component compilers job to do this in
the correct order, waiting until all child components have
been rendered before attempting to render the parent
component.

[Havana component renderer](https://github.com/colinmeinke/havana-component-renderer)
or a library with an interchangeable API consume the
`component.render` events. On render completion of each
component the component renderer will publish a
`component.rendered` event containing the rendered HTML
string. Once a `component.rendered` event has been published
for each component Havana component compiler will concatenate
the HTML strings and then publish the `components.compiled`
event for consumption by the response handler.

## How to install

```
npm install havana-component-compiler
```

## How to use

```javascript
import ComponentCompiler from 'havana-component-compiler';
import ComponentHandler from 'havana-component-handler';
import Event from 'havana-event';
import Router from 'havana-router';
import Server from 'havana-server';

const event = new Event();

const reporting = {
  'level': 2, 
  'reporter': console.log,
};

const server = new Server({
  'event': event,
  'reporting': reporting,
});

new Router({
  'event': event,
  'reporting': reporting,
  'routes': [
    {
      'url': '/',
      'method': 'GET',
      'components': [
        {
          'component': 'page',
          'properties': {
            'content': 'Hello world',
          },
        },
      ],
    },
  ],
});

new ComponentCompiler({
  'event': event,
  'reporting': reporting,
});

// Add a component renderer here

new ComponentHandler({
  'event': event,
  'reporting': reporting,
});

server.listen( 3000 );
```

## Event list

Events take the form of
[Havana event](https://github.com/colinmeinke/havana-event)
or a library with an interchangeable API.

### Publish

- `component.render`: Signifies that Havana component
  compiler requires a component renderer to render a
  component object into an HTML string.
- `components.compiled`: Signifies that all components have
  been rendered and concatenated into an HTML string for
  consumption by a response handler.

### Subscribe

- `components.compile`: Allows a response handler to notify
  Havana component compiler that it requires a components
  array rendered to an HTML string.
- `component.rendered`: Allows a component renderer to notify
  Havana component compiler that it has completed rendering
  a component.

## ES2015+

Havana component compiler is written using ES2015+ syntax.

However, by default this module will use an ES5
compatible file that has been compiled using
[Babel](https://babeljs.io).

Havana component compiler currently requires the 
[Babel polyfill](https://babeljs.io/docs/usage/polyfill).
In the `dist` directory there are two files, the default
`compiler.js` and `compiler.with-polyfill.js`
that includes the Babel browser polyfill.