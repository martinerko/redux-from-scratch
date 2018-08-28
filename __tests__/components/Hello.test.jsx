import React from 'react';

import { shallow } from 'enzyme';
import Hello from './Hello';
import { createStore } from '../../src';

const INCREMENT = 'INCREMENT';
let store;

const reducer = (state = { value: 0 }, action) => {
  if (action.type === INCREMENT) {
    return {
      value: state.value + 1
    };
  }
  return state;
};

describe('Hello', () => {
  beforeEach(() => {
    store = createStore(reducer, { value: 100 });
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Hello text="world" store={store} />);
    expect(wrapper.find('h1').text()).toBe('Hello world');
  });

  it('listens to store changes', () => {
    const wrapper = shallow(<Hello text="world" store={store} />);
    expect(wrapper.find('h2').text()).toBe('100');
    store.dispatch({ type: INCREMENT });
    expect(wrapper.find('h2').text()).toBe('101');
  });

  it('updates store after clicking on button', () => {
    const wrapper = shallow(<Hello text="world" store={store} />);
    wrapper
      .find('button')
      .at(0)
      .simulate('click');

    expect(store.getState().value).toBe(101);
  });
});
