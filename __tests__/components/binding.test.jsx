import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { shallow, mount } from 'enzyme';
import Hello from './Hello';
import ConnectedHello from './ConnectedHello';
import { createStore, Provider, connect } from '../../src';

const INCREMENT = 'INCREMENT';

const reducer = (state = { value: 0 }, action) => {
  if (action.type === INCREMENT) {
    return {
      value: state.value + 1
    };
  }
  return state;
};

describe('Component binding', () => {
  describe('when store is passed as a parameter', () => {
    let store;
    let wrapper;

    beforeEach(() => {
      store = createStore(reducer, { value: 100 });
      wrapper = shallow(<Hello text="world" store={store} />);
    });

    it('renders correctly', () => {
      expect(wrapper.find('h1').text()).toBe('Hello world');
    });

    it('listens to store changes', () => {
      expect(wrapper.find('h2').text()).toBe('100');
      store.dispatch({ type: INCREMENT });
      expect(wrapper.find('h2').text()).toBe('101');
    });

    it('updates store after clicking on button', () => {
      wrapper
        .find('button')
        .at(0)
        .simulate('click');

      expect(store.getState().value).toBe(101);
    });
  });

  describe('Provider', () => {
    let store;
    let wrapper;

    describe('when used with connect', () => {
      let WrappedComponent;
      let StatelessComponent;
      let mapStateToProps;
      let ConnectedComponent;
      beforeEach(() => {
        StatelessComponent = jest.fn(({ text, value }) => text + value);
        mapStateToProps = jest.fn(state => ({
          value: state.value
        }));
        ConnectedComponent = connect(mapStateToProps)(StatelessComponent);
        store = createStore(reducer, { value: 100 });
        WrappedComponent = (
          <Provider store={store}>
            <ConnectedComponent text="text" />
          </Provider>
        );
      });

      it('calls mapStateToProps with state and component params', () => {
        ReactDOMServer.renderToStaticMarkup(WrappedComponent);

        expect(mapStateToProps).toBeCalledWith(
          store.getState(),
          expect.objectContaining({
            text: 'text'
          })
        );
      });

      it('passes component and computed params into Connected component', () => {
        const dom = ReactDOMServer.renderToStaticMarkup(WrappedComponent);
        expect(dom).toBe('text100');
      });

      it('renders correctly', () => {
        wrapper = mount(
          <Provider store={store}>
            <ConnectedHello text="text" />
          </Provider>
        );
        expect(wrapper.find('h2').text()).toBe('100');
      });

      it('listens to store changes', () => {
        wrapper = mount(
          <Provider store={store}>
            <ConnectedHello text="text" />
          </Provider>
        );

        expect(wrapper.find('h2').text()).toBe('100');
        store.dispatch({ type: INCREMENT });
        expect(wrapper.find('h2').text()).toBe('101');
      });

      it('updates all connected components', () => {
        const wrapper1 = mount(
          <Provider store={store}>
            <ConnectedHello text="first" />
            <ConnectedHello text="second" />
          </Provider>
        );

        // we click on button in the first connected component
        wrapper1.find('button[name="first"]').simulate('click');
        wrapper1.find('button[name="second"]').simulate('click');
        // we expect changes from the store to be reflected in both components
        expect(
          wrapper1
            .find('h2')
            .at(0)
            .text()
        ).toBe('102');

        expect(
          wrapper1
            .find('h2')
            .at(1)
            .text()
        ).toBe('102');
      });
    });
  });
});
