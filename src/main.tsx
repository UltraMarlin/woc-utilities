import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./globals.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DownloadView } from "./pages/DownloadView.tsx";
import { DevView } from "./pages/DevView.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<DownloadView />} />
          <Route path="dev" element={<DevView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
