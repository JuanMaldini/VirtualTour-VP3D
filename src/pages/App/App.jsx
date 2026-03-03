import AppRoutes from "../../routes/AppRoutes";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";

function App() {
  const location = useLocation();

  useEffect(() => {
    const body = document.body;
    const cleanupClasses = [
      "multiple-scenes",
      "single-scene",
      "view-control-buttons",
      "desktop",
      "mobile",
      "no-touch",
      "touch",
      "tooltip-fallback",
      "fullscreen-enabled",
      "fullscreen-unavailable",
      "fullscreen-disabled",
    ];
    cleanupClasses.forEach((className) => body.classList.remove(className));

    const resetLink = document.querySelector('link[data-marzipano="reset"]');
    if (resetLink?.parentNode) {
      resetLink.parentNode.removeChild(resetLink);
    }
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex min-h-0 flex-1 flex-col w-full">
        <div className="flex min-h-0 flex-1 flex-col">
          <AppRoutes />
        </div>
      </div>
    </main>
  );
}

export default App;
