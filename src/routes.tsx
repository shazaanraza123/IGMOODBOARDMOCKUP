import { Navigate, Route, Routes } from "react-router-dom";
import { About } from "./screens/About";
import { Board } from "./screens/Board";
import { Brief } from "./screens/Brief";
import { Feed } from "./screens/Feed";
import { FindSimilar } from "./screens/FindSimilar";
import { Ideas } from "./screens/Ideas";
import { Saved } from "./screens/Saved";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="/board/:id/similar" element={<FindSimilar />} />
      <Route path="/board/:id/ideas" element={<Ideas />} />
      <Route path="/board/:id" element={<Board />} />
      <Route path="/brief" element={<Brief />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
