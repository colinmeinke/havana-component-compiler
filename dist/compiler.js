'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ = new WeakMap();

var Compiler = (function () {
  function Compiler(config) {
    _classCallCheck(this, Compiler);

    var props = {
      'event': config.event,
      'reporting': config.reporting
    };

    _.set(this, props);

    this.init();
  }

  _createClass(Compiler, [{
    key: 'init',
    value: function init() {
      var _this = this;

      var _$get = _.get(this);

      var event = _$get.event;
      var reporting = _$get.reporting;

      event.subscribe('components.compile', function (data) {
        _this.renderComponents(data);
      });

      event.subscribe('component.rendered', function (data) {
        if (_this.isRendered({
          'components': data.data.components
        })) {
          if (reporting.level > 1) {
            reporting.reporter('-- Components compiled');
          }

          data.data.content = _this.getResponseContent(data.data.components);

          event.publish('components.compiled', data.data);
        } else {
          _this.renderComponents(data.data);
        }
      });
    }
  }, {
    key: 'renderComponents',
    value: function renderComponents(data) {
      var _$get2 = _.get(this);

      var event = _$get2.event;
      var reporting = _$get2.reporting;

      for (var i = 0, l = data.components.length; i < l; i++) {
        var component = data.components[i];

        if (component.state === 'not rendered') {
          if (!component.children || this.isRendered({
            'components': data.components,
            'componentIds': component.children
          })) {
            if (reporting.level > 1) {
              reporting.reporter('-- Render component');
            }

            component.state = 'rendering';

            event.publish('component.render', {
              'data': data,
              'componentId': component.id
            });
          }
        }
      }
    }
  }, {
    key: 'isRendered',
    value: function isRendered(data) {
      for (var i = 0, l = data.components.length; i < l; i++) {
        if (!data.componentIds || data.componentIds.indexOf(data.components[i].id) !== -1) {
          if (data.components[i].state !== 'rendered') {
            return false;
          }
        }
      }

      return true;
    }
  }, {
    key: 'getResponseContent',
    value: function getResponseContent(components) {
      var content = '';

      for (var i = 0, l = components.length; i < l; i++) {
        if (!components[i].parent) {
          content += components[i].content;
        }
      }

      return content;
    }
  }]);

  return Compiler;
})();

exports['default'] = Compiler;
module.exports = exports['default'];