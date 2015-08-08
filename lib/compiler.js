const _ = new WeakMap();

class Compiler {
  constructor ( config ) {
    const props = {
      'event': config.event,
      'reporting': config.reporting,
    };

    _.set( this, props );

    this.init();
  }

  init () {
    const { event, reporting } = _.get( this );

    event.subscribe( 'components.compile', data => {
      this.renderComponents( data );
    });

    event.subscribe( 'component.rendered', data => {
      if ( this.isRendered({
        'components': data.data.components,
      })) {
        if ( reporting.level > 1 ) {
          reporting.reporter( '-- Components compiled' );
        }

        data.data.content = this.getResponseContent( data.data.components );

        event.publish( 'components.compiled', data.data );
      } else {
        this.renderComponents( data.data );
      }
    });
  }

  renderComponents ( data ) {
    const { event, reporting } = _.get( this );

    for ( let i = 0, l = data.components.length; i < l; i++ ) {
      let component = data.components[ i ];

      if ( component.state === 'not rendered' ) {
        if ( !component.children || this.isRendered({
          'components': data.components,
          'componentIds': component.children,
        })) {
          if ( reporting.level > 1 ) {
            reporting.reporter( '-- Render component' );
          }

          component.state = 'rendering';

          event.publish( 'component.render', {
            'data': data,
            'componentId': component.id,
          });
        }
      }
    }
  }

  isRendered ( data ) {
    for ( let i = 0, l = data.components.length; i < l; i++ ) {
      if ( !data.componentIds || data.componentIds.indexOf( data.components[ i ].id ) !== -1 ) {
        if ( data.components[ i ].state !== 'rendered' ) {
          return false;
        }
      }
    }

    return true;
  }

  getResponseContent ( components ) {
    var content = '';

    for ( let i = 0, l = components.length; i < l; i++ ) {
      if ( !components[ i ].parent ) {
        content += components[ i ].content;
      }
    }

    return content;
  }

}

export default Compiler;
