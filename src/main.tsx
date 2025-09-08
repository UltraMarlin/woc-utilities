import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./globals.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DownloadView } from "./pages/DownloadView.tsx";
import { DevView } from "./pages/DevView.tsx";
import { SpecificDownloadView } from "./pages/SpecificDownloadView.tsx";
import { Home } from "./pages/Home.tsx";
import { YoutubeDescriptions } from "./pages/YoutubeDescriptions.tsx";
import { YoutubeThumbnails } from "./pages/YoutubeThumbnails.tsx";
import { IntroductionImages } from "./pages/IntroductionImages.tsx";
import { SocialsPostImages } from "./pages/SocialsPostImages.tsx";
import { WidgetsHome } from "./pages/WidgetsHome.tsx";
import { WidgetPointsOverlay } from "./pages/WidgetPointsOverlay.tsx";

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
          <Route path="yt-descriptions" element={<YoutubeDescriptions />} />
          <Route path="yt-thumbnails" element={<YoutubeThumbnails />} />
          <Route path="introductions" element={<IntroductionImages />} />
          <Route path="social-posts" element={<SocialsPostImages />} />
          <Route path="widgets" element={<WidgetsHome />} />
          <Route
            path="widgets/points-overlay"
            element={<WidgetPointsOverlay />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
