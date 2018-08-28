import React from 'react';
import PropTypes from 'prop-types';

const Context = React.createContext({
  store: undefined
});

export const Provider = args => {
  const { store, children } = args;
  return <Context.Provider value={store}>{children}</Context.Provider>;
};

export const connect = (
  mapStateToProps,
  mapDispatchToProps = () => ({})
) => Component => {
  class ConnectedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = this.resolveState(props.store.getState());
    }

    componentDidMount() {
      const { store } = this.props;
      // if mapStateToProps was provided, we will subscribe to store changes
      if (typeof mapStateToProps === 'function') {
        this.unsubscribe = store.subscribe(state => {
          const resolvedState = this.resolveState(state, true);
          this.setState(resolvedState);
        });
      }
    }

    componentWillUnmount() {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    resolveState(storeState, skipCheck = false) {
      const { store, ...ownProps } = this.props;
      let stateToProps = {};
      if (skipCheck || typeof mapStateToProps === 'function') {
        stateToProps = mapStateToProps(storeState, ownProps);
      }

      const resolvedState = {
        ...stateToProps,
        ...mapDispatchToProps(store.dispatch)
      };

      return resolvedState;
    }

    render() {
      const {
        store: { dispatch },
        ...ownProps
      } = this.props;

      return <Component {...ownProps} {...this.state} dispatch={dispatch} />;
    }
  }

  ConnectedComponent.propTypes = {
    store: PropTypes.shape({
      dispatch: PropTypes.func,
      getState: PropTypes.func,
      subscribe: PropTypes.func
    }).isRequired
  };

  return props => (
    <Context.Consumer>
      {store => <ConnectedComponent {...props} store={store} />}
    </Context.Consumer>
  );
};

export default {
  Provider,
  connect
};
