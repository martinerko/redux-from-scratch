const validateReducers = reducers => {
  if (Object.prototype.toString.call(reducers) !== '[object Object]') {
    throw new Error('Reducers must be an object.');
  }
};

export default reducers => {
  validateReducers(reducers);
  const entries = Object.entries(reducers);

  return (state, action) =>
    entries.reduce(
      (acc, [key, reducer]) => ({
        ...acc,
        [key]: reducer(acc[key], action)
      }),
      state
    );
};
