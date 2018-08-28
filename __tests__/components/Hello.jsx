import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prefer-stateless-function
class Hello extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.store.getState();
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  componentDidMount() {
    const { store } = this.props;

    this.unsubscribe = store.subscribe(updatedState => {
      this.setState(updatedState);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleOnClick() {
    const { store } = this.props;
    store.dispatch({ type: 'INCREMENT' });
  }

  render() {
    const { text } = this.props;
    const { value } = this.state;
    return (
      <div>
        <h1>{`Hello ${text}`}</h1>
        <h2>{value}</h2>
        <button type="button" onClick={this.handleOnClick}>
          click me
        </button>
      </div>
    );
  }
}

Hello.propTypes = {
  text: PropTypes.string.isRequired,
  store: PropTypes.shape({
    dispatch: PropTypes.func,
    getState: PropTypes.func,
    subscribe: PropTypes.func
  }).isRequired
};

export default Hello;
