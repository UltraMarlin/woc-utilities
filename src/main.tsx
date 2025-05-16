import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./globals.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DownloadView } from "./pages/DownloadView.tsx";
import { DevView } from "./pages/DevView.tsx";
import { SpecificDownloadView } from "./pages/SpecificDownloadView.tsx";
import { Home } from "./pages/Home.tsx";
import { Youtube } from "./pages/Youtube.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="schedule-images" element={<DownloadView />} />
          <Route path="schedule-images/dev" element={<DevView />} />
          <Route
            path="schedule-images/specific"
            element={<SpecificDownloadView />}
          />
          <Route path="youtube" element={<Youtube />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
