/* global describe it */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _distCompilerServerWithPolyfill = require('../../dist/compiler.server.with-polyfill');

var _distCompilerServerWithPolyfill2 = _interopRequireDefault(_distCompilerServerWithPolyfill);

var _havanaEvent = require('havana-event');

var _havanaEvent2 = _interopRequireDefault(_havanaEvent);

var expect = _chai2['default'].expect;

var event = new _havanaEvent2['default']();

var compiler = new _distCompilerServerWithPolyfill2['default']({
  'event': event,
  'reporting': {
    'level': 0,
    'reporter': console.log
  }
});

describe('Static', function () {
  describe('_', function () {
    it('should be private', function () {
      expect(compiler).to.not.have.property('_');
    });
  });

  describe('event', function () {
    it('should be private', function () {
      expect(compiler).to.not.have.property('event');
    });
  });

  describe('reporting', function () {
    it('should be private', function () {
      expect(compiler).to.not.have.property('reporting');
    });
  });

  describe('component.render', function () {
    it('should be published when a response handler publishes a components.compile event', function (done) {
      var token = event.subscribe('component.render', function () {
        event.unsubscribe(token);
        done();
      });

      event.publish('components.compile', {
        'components': [{
          'component': 'page',
          'id': 1,
          'state': 'not rendered'
        }]
      });
    });

    it('should be published when a component renderer publishes a component.rendered event but not all components are rendered', function (done) {
      var token = event.subscribe('component.render', function () {
        event.unsubscribe(token);
        done();
      });

      event.publish('component.rendered', {
        'componentId': 2,
        'data': {
          'components': [{
            'children': [2],
            'component': 'page',
            'id': 1,
            'state': 'not rendered'
          }, {
            'component': 'header',
            'id': 2,
            'parent': 1,
            'state': 'rendered'
          }]
        }
      });
    });
  });

  describe('components.compiled', function () {
    it('should be published when a component renderer publishes a component.rendered event and all components are rendered', function (done) {
      var token = event.subscribe('components.compiled', function () {
        event.unsubscribe(token);
        done();
      });

      event.publish('component.rendered', {
        'componentId': 1,
        'data': {
          'components': [{
            'component': 'page',
            'id': 1,
            'state': 'rendered'
          }]
        }
      });
    });
  });

  describe('isRendered()', function () {
    it('should return true if all components have a state value of rendered', function () {
      var isRendered = compiler.isRendered({
        'components': [{
          'component': 'page',
          'id': 1,
          'state': 'rendered'
        }]
      });

      expect(isRendered).to.be['true'];
    });

    it('should return true if all components with ids in componentIds have a state value of rendererd', function () {
      var isRendered = compiler.isRendered({
        'componentIds': [2],
        'components': [{
          'children': [2],
          'component': 'page',
          'id': 1,
          'state': 'not rendered'
        }, {
          'component': 'header',
          'id': 2,
          'parent': 1,
          'state': 'rendered'
        }]
      });

      expect(isRendered).to.be['true'];
    });
  });

  describe('getResponseContent()', function () {
    it('should concatenate component content', function () {
      var responseContent = compiler.getResponseContent([{
        'content': 'hello '
      }, {
        'content': 'world'
      }]);

      expect(responseContent).to.equal('hello world');
    });
  });
});