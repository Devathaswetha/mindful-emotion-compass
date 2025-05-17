
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import MoodTracker from "@/pages/MoodTracker";
import Journal from "@/pages/Journal";
import Meditations from "@/pages/Meditations";
import Resources from "@/pages/Resources";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import LandingPage from "@/pages/LandingPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route element={<Layout />}>
        <Route path="/mood" element={<MoodTracker />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/meditations" element={<Meditations />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
