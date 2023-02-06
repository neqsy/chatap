import React from 'react';
import { shallow, mount } from 'enzyme';
import { Chat } from '../components//Chat/Chat.js';
import { AuthContext } from "../../context/AuthContext";
import Message from "../Message/Message";

const messages = [
  {
    sentBy: 'user1',
    sentAt: '2022-01-01',
    content: 'Hello'
  },
  {
    sentBy: 'user2',
    sentAt: '2022-01-02',
    content: 'Hi there'
  }
];

const authContext = {
  currentUser: {
    uid: 'user1'
  }
};

describe('<Chat />', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<Chat messages={messages} />);
    expect(wrapper).toBeTruthy();
  });

  it('should display all messages', () => {
    const wrapper = shallow(<Chat messages={messages} />);
    expect(wrapper.find(Message).length).toBe(2);
  });

  it('should pass correct message type to each Message component', () => {
    const wrapper = mount(
      <AuthContext.Provider value={authContext}>
        <Chat messages={messages} />
      </AuthContext.Provider>
    );
    expect(wrapper.find(Message).at(0).props().type).toBe('MY');
    expect(wrapper.find(Message).at(1).props().type).toBe('USERS');
  });
});