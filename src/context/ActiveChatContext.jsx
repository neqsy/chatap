import { createContext, useState } from "react";

export const ActiveChatContext = createContext();

export const ActiveChatContextProvider = ({ children }) => {
  const [activeChat, setActiveChat] = useState({});

  return (
    <ActiveChatContext.Provider value={{ activeChat, setActiveChat }}>
      {children}
    </ActiveChatContext.Provider>
  );
};