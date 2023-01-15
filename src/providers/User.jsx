import { createContext, useMemo, useState } from "react";
export const UserContext = createContext();

function User({ children }) {
  const [user, setUser] = useState();
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default User;
