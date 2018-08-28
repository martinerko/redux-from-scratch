import combineReducers from '../src/combineReducers';

describe('combineReducers', () => {
  describe('constructor', () => {
    test('should return a function when called with an object', () => {
      expect(typeof combineReducers({})).toBe('function');
    });

    test('should throw an error when called without an object', () => {
      expect(() => combineReducers()).toThrow(Error);
    });

    describe('execution', () => {
      test('should return a function which when executed will call all combined reducers with relevant state and passed action', () => {
        const reducerA = jest.fn();
        const reducerB = jest.fn();
        const finalReducer = combineReducers({ a: reducerA, b: reducerB });

        const bData = { value: 1 };
        const state = { b: bData };
        const action = { type: 'INCREMENT' };
        finalReducer(state, action);

        expect(reducerA).toBeCalledWith(undefined, action);
        expect(reducerB).toBeCalledWith(bData, action);
      });
    });
  });
});
