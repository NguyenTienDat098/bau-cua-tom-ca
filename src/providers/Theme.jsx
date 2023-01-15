import { createContext, useMemo, useState } from "react";
export const ThemeContext = createContext();

function Theme({ children }) {
  const [theme, setTheme] = useState("dark");
  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export default Theme;
