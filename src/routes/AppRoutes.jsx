import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound/NotFound";

import Projects from "../pages/Projects/Projects";

import Playground from "../pages/Projects/Tours/playground/playground";

import TEK016Cisco from "../pages/Projects/Tours/TEK016Cisco/TEK016Cisco";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Projects />} />

      {/*PLAYGROUND*/}
      <Route path="/playground" element={<Playground />} />

      {/*TOUR*/}
      <Route path="/TEK016Cisco" element={<TEK016Cisco />} />

      {/*NOT FOUND*/}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
