import createStore from '../src/createStore';
import { combineReducers } from '../src';

describe('createStore', () => {
  const INCREMENT = 'INCREMENT';

  const reducer = (state = { value: 0 }, action) => {
    if (action.type === INCREMENT) {
      return {
        value: state.value + 1
      };
    }
    return state;
  };

  describe('contructor', () => {
    test('should return an object when called with correct parameters', () => {
      expect(typeof createStore(reducer)).toBe('object');
    });

    test('should throw an error when called with incorrect reducer', () => {
      expect(() => createStore()).toThrow(Error);
    });
  });

  describe('getState', () => {
    test('should initialize empty state object by default', () => {
      const store = createStore(reducer);
      expect(JSON.stringify(store.getState())).toBe(JSON.stringify({}));
    });

    test('should initialize state with provided value', () => {
      const defaultState = { value: 100 };
      const store = createStore(reducer, defaultState);
      expect(JSON.stringify(store.getState())).toBe(
        JSON.stringify(defaultState)
      );
    });
  });

  describe('dispatch', () => {
    let store;
    beforeEach(() => {
      const defaultState = { value: 0 };
      store = createStore(reducer, defaultState);
    });

    test('should correctly increment value in reducer when called once with relevant action', () => {
      store.dispatch({ type: INCREMENT });
      expect(store.getState().value).toBe(1);
    });

    test('should increment value in reducer when called multiple times with relevant action', () => {
      store.dispatch({ type: INCREMENT });
      store.dispatch({ type: INCREMENT });
      expect(store.getState().value).toBe(2);
    });

    test('should not increment value in reducer when called with irrelevant action', () => {
      store.dispatch({ type: 'foo' });
      expect(store.getState().value).toBe(0);
    });

    test('should throw an error when called with invalid action', () => {
      expect(() => createStore()).toThrow(Error);
    });
  });

  describe('dispatch over multiple reducers', () => {
    let store;
    const SET_NAME = 'SET_NAME';
    const SET_AGE = 'SET_AGE';

    const reducerA = (state = { name: '' }, action) => {
      if (action.type === SET_NAME) {
        return {
          name: action.value
        };
      }

      return state;
    };

    const reducerB = (state = { log: [] }, action) => {
      if (action.type === SET_NAME) {
        return {
          log: state.log.concat(action.value)
        };
      }

      return state;
    };

    const reducerC = (state = { name: 'Martin', age: 30 }, action) => {
      if (action.type === SET_AGE) {
        return {
          ...state,
          age: action.value
        };
      }

      return state;
    };

    beforeEach(() => {
      store = createStore(
        combineReducers({ a: reducerA, b: reducerB, c: reducerC })
      );
    });

    test('should update value in reducers that reacts to given action', () => {
      store.dispatch({ type: SET_NAME, value: 'Peter' });
      const state = store.getState();
      expect(state.a.name).toBe('Peter');
      expect(state.b.log).toEqual(expect.arrayContaining(['Peter']));
      expect(state.c.name).not.toBe('Peter');
    });
  });

  describe('subscribe', () => {
    let store;
    const INITIAL_STATE = {
      value: 100
    };
    beforeEach(() => {
      store = createStore(reducer, INITIAL_STATE);
    });

    test('should return a function when subscriber is called', () => {
      expect(typeof store.subscribe(jest.fn())).toBe('function');
    });

    test('should invoke passed callback with freshly calculated state after dispatch was called', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      store.subscribe(callback1);
      store.subscribe(callback2);

      store.dispatch({ type: INCREMENT });

      expect(callback1).toBeCalledWith(
        expect.objectContaining({
          value: 101
        })
      );

      expect(callback2).toBeCalledWith(
        expect.objectContaining({
          value: 101
        })
      );
    });

    test('should not invoke unsubscribed callback', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const unsubscribe1 = store.subscribe(callback1);
      const unsubscribe2 = store.subscribe(callback2);

      unsubscribe1();
      store.dispatch({ type: INCREMENT });
      unsubscribe2();

      expect(callback1).not.toBeCalledWith(
        expect.objectContaining({
          value: 101
        })
      );

      expect(callback2).toBeCalledWith(
        expect.objectContaining({
          value: 101
        })
      );
    });
  });
});
