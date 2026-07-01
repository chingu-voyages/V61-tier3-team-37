import React from "react";
import { createRoot } from "react-dom/client";


import wordleMain from "./pages/wordleMain";
import "./index.css";

const container = document.getElementById("app");

if (container) {
  createRoot(container).render(
    <React.StrictMode>
      {wordleMain()}
    </React.StrictMode>
  );
} else {
  console.error("No root container found. Expected an element with id 'app'.");
}
