import "./App.css";
import AppRoutes from "./routes/AppRoutes.jsx";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppRoutes />
          <ToastContainer />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
