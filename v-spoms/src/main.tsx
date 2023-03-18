import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  //<React.StrictMode> - Causes componentDidMount to be called twice in develop environment. Uncomment in prod.
    <App />
  //</React.StrictMode>
);
