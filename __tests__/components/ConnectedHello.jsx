import React from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../src/binding';

// eslint-disable-next-line react/prefer-stateless-function
class Hello extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    const { dispatch } = this.props;
    dispatch({ type: 'INCREMENT' });
  }

  render() {
    const { text, value } = this.props;
    return (
      <div>
        <h1>{`Hello ${text}`}</h1>
        <h2>{value}</h2>
        <button type="button" name={text} onClick={this.handleOnClick}>
          click me
        </button>
      </div>
    );
  }
}

Hello.propTypes = {
  text: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state /* , props */) => ({
  value: state.value
});

export default connect(mapStateToProps)(Hello);
