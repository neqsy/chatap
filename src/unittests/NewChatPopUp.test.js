import React from "react";
import { shallow } from "enzyme";
import { NewChatPopUp } from "../components/NewChatPopUp/NewChatPopUp.js";
import { AuthContext } from "../../context/AuthContext";
import { addNewChat } from "../../services/ChatService";

jest.mock("../../services/ChatService", () => ({
  addNewChat: jest.fn(),
}));

describe("NewChatPopUp component", () => {
  let wrapper;
  let addNewChatMock;
  const authContext = {
    currentUser: {
      uid: "123",
    },
  };

  beforeEach(() => {
    addNewChatMock = jest.fn();
    wrapper = shallow(
      <NewChatPopUp
        modalShow={true}
        handleClose={jest.fn()}
      />,
      {
        context: {
          AuthContext,
        },
        disableLifecycleMethods: true,
      }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should set the error state when addNewChat throws an error", async () => {
    addNewChat.mockImplementation(() => {
      throw new Error("Error message");
    });
    wrapper.find("Form").simulate("submit", {
      preventDefault: jest.fn(),
      target: [
        {
          value: "Test chat",
        },
        {
          files: [
            {
              name: "test-image.jpg",
            },
          ],
        },
      ],
    });
    await Promise.resolve();
    expect(wrapper.state().error).toEqual("Error message");
  });

  it("should call addNewChat when the form is submitted", async () => {
    wrapper.find("Form").simulate("submit", {
      preventDefault: jest.fn(),
      target: [
        {
          value: "Test chat",
        },
        {
          files: [
            {
              name: "test-image.jpg",
            },
          ],
        },
      ],
    });
    await Promise.resolve();
    expect(addNewChat).toHaveBeenCalledWith(
      "Test chat",
      authContext.currentUser.uid,
      {
        name: "test-image.jpg",
      }
    );
  });
});