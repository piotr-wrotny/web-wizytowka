import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";

const root = document.getElementById('root');
const cleanPath = window.location.pathname === '/' ? '/' : `${window.location.pathname.replace(/\/+$/, '')}/`;
const app = <React.StrictMode><App /></React.StrictMode>;
if (root.hasChildNodes() && root.dataset.page === cleanPath) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
