import { createRoot } from "react-dom/client";
import React from 'react'

import WordleMain from "./pages/wordleMain";
import "./components/index.css";

const container = document.getElementById("app");
if (container) {
  createRoot(container).render(<WordleMain />);
} else {
  console.error("No root container found. Expected an element with id 'app'.");
}
