import { createContext } from "react";

export const MessageContext = createContext();
function Message({ children }) {
  return <MessageContext.Provider>{children}</MessageContext.Provider>;
}

export default Message;
