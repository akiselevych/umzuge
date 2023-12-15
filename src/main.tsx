// Libs
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "reduxFolder/store";
// Styles
import "./styles/index.scss";
// Components
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import App from "./components/App/App";
import Login from "pages/Login/Login";
import Page404 from "pages/Page404/Page404";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </DndProvider>
  </Provider>
);
