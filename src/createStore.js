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

const validateCallback = callback => {
  if (Object.prototype.toString.call(callback) !== '[object Function]') {
    throw new Error('Please provide a callback function.');
  }
};

export default (reducer, initialState = {}) => {
  validateReducer(reducer);
  let state = initialState;
  let subscribers = [];

  return {
    dispatch(action) {
      validateAction(action);
      state = reducer(state, action);
      subscribers.forEach(cb => cb(state));
    },

    getState() {
      return state;
    },

    subscribe(callback) {
      validateCallback(callback);
      subscribers.push(callback);

      return () => {
        subscribers = subscribers.filter(s => s !== callback);
      };
    }
  };
};
