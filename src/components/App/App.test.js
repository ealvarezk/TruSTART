import React from 'react';
import { shallow } from 'enzyme';
import App from '.';

test('renders App properly', () => {
  const app = shallow(<App />);
  expect(app).toMatchSnapshot();
});
