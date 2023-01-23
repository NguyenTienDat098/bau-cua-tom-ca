import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Theme from "./providers/Theme.jsx";
import User from "./providers/User.jsx";
import Notification from "./providers/Notification";
import Bet from "./providers/Bet";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <User>
    <Theme>
      <Notification>
        <Bet>
          <App />
        </Bet>
      </Notification>
    </Theme>
  </User>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
