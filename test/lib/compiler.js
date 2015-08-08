/* global describe it */

import chai from 'chai';
import ComponentCompiler from '../../dist/compiler.with-polyfill';
import Event from 'havana-event';

const expect = chai.expect;

const event = new Event();

let compiler = new ComponentCompiler({
  'event': event,
  'reporting': {
    'level': 0,
    'reporter': console.log,
  },
});

describe( 'Static', () => {
  describe( '_', () => {
    it( 'should be private', () => {
      expect( compiler ).to.not.have.property( '_' );
    });
  });

  describe( 'event', () => {
    it( 'should be private', () => {
      expect( compiler ).to.not.have.property( 'event' );
    });
  });

  describe( 'reporting', () => {
    it( 'should be private', () => {
      expect( compiler ).to.not.have.property( 'reporting' );
    });
  });

  describe( 'component.render', () => {
    it( 'should be published when a response handler publishes a components.compile event', done => {
      const token = event.subscribe( 'component.render', () => {
        event.unsubscribe( token );
        done();
      });

      event.publish( 'components.compile', {
        'components': [
          {
            'component': 'page',
            'id': 1,
            'state': 'not rendered',
          },
        ],
      });
    });

    it( 'should be published when a component renderer publishes a component.rendered event but not all components are rendered', done => {
      const token = event.subscribe( 'component.render', () => {
        event.unsubscribe( token );
        done();
      });

      event.publish( 'component.rendered', {
        'componentId': 2,
        'data': {
          'components': [
            {
              'children': [ 2 ],
              'component': 'page',
              'id': 1,
              'state': 'not rendered',
            },
            {
              'component': 'header',
              'id': 2,
              'parent': 1,
              'state': 'rendered',
            },
          ],
        },
      });
    });
  });

  describe( 'components.compiled', () => {
    it( 'should be published when a component renderer publishes a component.rendered event and all components are rendered', done => {
      const token = event.subscribe( 'components.compiled', () => {
        event.unsubscribe( token );
        done();
      });

      event.publish( 'component.rendered', {
        'componentId': 1,
        'data': {
          'components': [
            {
              'component': 'page',
              'id': 1,
              'state': 'rendered',
            },
          ],
        },
      });
    });
  });

  describe( 'isRendered()', () => {
    it( 'should return true if all components have a state value of rendered', () => {
      const isRendered = compiler.isRendered({
        'components': [
          {
            'component': 'page',
            'id': 1,
            'state': 'rendered',
          },
        ],
      });

      expect( isRendered ).to.be.true;
    });

    it( 'should return true if all components with ids in componentIds have a state value of rendererd', () => {
      const isRendered = compiler.isRendered({
        'componentIds': [ 2 ],
        'components': [
          {
            'children': [ 2 ],
            'component': 'page',
            'id': 1,
            'state': 'not rendered',
          },
          {
            'component': 'header',
            'id': 2,
            'parent': 1,
            'state': 'rendered',
          },
        ],
      });

      expect( isRendered ).to.be.true;
    });
  });

  describe( 'getResponseContent()', () => {
    it( 'should concatenate component content', () => {
      const responseContent = compiler.getResponseContent([
        {
          'content': 'hello ',
        },
        {
          'content': 'world',
        },
      ]);

      expect( responseContent ).to.equal( 'hello world' );
    });
  });
});
