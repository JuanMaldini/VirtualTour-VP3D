import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound/NotFound";

import Projects from "../pages/Projects/Projects";

import Playground from "../pages/Projects/Tours/playground/playground";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Projects />} />

      {/*PLAYGROUND*/}
      <Route path="/playground" element={<Playground />} />

      {/*TOUR*/}

      {/*NOT FOUND*/}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
