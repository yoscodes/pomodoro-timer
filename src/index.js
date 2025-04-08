import React from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import logger from "redux-logger";
import "./index.css";
import App from "./App";
import reducer from "./reducers";

// Redux Toolkitを使用してstoreを作成
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    if (process.env.NODE_ENV === "development") {
      // 開発環境でのみloggerミドルウェアを使用
      return getDefaultMiddleware().concat(logger);
    }
    return getDefaultMiddleware();
  },
});

// React 18以降では、createRootを使用
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
