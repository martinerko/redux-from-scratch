const validateAction = action => {
  if (Object.prototype.toString.call(action) !== '[object Object]') {
    throw new Error('Action must be an object.');
  }

  if (typeof action.type === 'undefined') {
    throw new Error('Action must have a type.');
  }
};

const validateReducer = reducer => {
  if (Object.prototype.toString.call(reducer) !== '[object Function]') {
    throw new Error('Reducer must be a function.');
  }
};

export default (reducer, initialState = {}) => {
  validateReducer(reducer);
  let state = initialState;

  return {
    dispatch(action) {
      validateAction(action);
      state = reducer(state, action);
    },
    getState() {
      return state;
    }
  };
};
