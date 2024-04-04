import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import store from "./store/index";
import App from "./App.tsx";
import { SocketProvider } from "./context/Socket";
import { NavigationProvider } from "./context/Navigation/index.tsx";

import "./main.css";
import { ModalProvider, Modal } from "./context/Modal/Modal.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ModalProvider>
        <NavigationProvider>
          <SocketProvider>
            <App />
            <Modal />
          </SocketProvider>
        </NavigationProvider>
      </ModalProvider>
    </Provider>
  </React.StrictMode>
);
