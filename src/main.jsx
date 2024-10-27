import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastWrapper } from "keep-react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <ToastWrapper
      richColors={true}
      toastOptions={{
        classNames: {
          title: "text-body-3 font-medium",
          toast: "rounded-xl shadow-large",
          description: "text-body-4 font-normal",
        },
      }}
    />
  </StrictMode>
);
