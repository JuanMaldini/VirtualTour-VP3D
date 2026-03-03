import { useEffect, useRef, useState } from "react";

function loadMarzipanoScript() {
  if (window.Marzipano) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-marzipano="marzipano"]');
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }

      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Unable to load Marzipano script")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "/build/marzipano.js";
    script.async = true;
    script.dataset.marzipano = "marzipano";
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener("error", () => reject(new Error("Unable to load Marzipano script")), {
      once: true,
    });
    document.head.appendChild(script);
  });
}

const TourPreviewViewer = ({
  imageUrl,
  inViewport,
  autoRotate = true,
  yawSpeed = 0.03,
}) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const autorotateRef = useRef(null);
  const [isMarzipanoReady, setIsMarzipanoReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    loadMarzipanoScript()
      .then(() => {
        if (!isCancelled) {
          setIsMarzipanoReady(true);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setIsMarzipanoReady(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isMarzipanoReady || !containerRef.current || !imageUrl) {
      return undefined;
    }

    const Marzipano = window.Marzipano;
    if (!Marzipano) {
      return undefined;
    }

    const viewer = new Marzipano.Viewer(containerRef.current, {
      controls: {
        mouseViewMode: "drag",
      },
    });

    const source = Marzipano.ImageUrlSource.fromString(imageUrl);
    const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
    const limiter = Marzipano.RectilinearView.limit.traditional(
      4000,
      (120 * Math.PI) / 180,
      (120 * Math.PI) / 180,
    );
    const view = new Marzipano.RectilinearView(
      {
        yaw: 0,
        pitch: 0,
        fov: Math.PI / 2,
      },
      limiter,
    );

    const scene = viewer.createScene({
      source,
      geometry,
      view,
      pinFirstLevel: true,
    });
    scene.switchTo();

    const autorotate = Marzipano.autorotate({
      yawSpeed,
      targetPitch: 0,
      targetFov: Math.PI / 2,
    });

    viewerRef.current = viewer;
    autorotateRef.current = autorotate;

    if (autoRotate && inViewport) {
      viewer.startMovement(autorotate);
      viewer.setIdleMovement(3000, autorotate);
    }

    return () => {
      viewer.stopMovement();
      viewer.setIdleMovement(Infinity);
      viewer.destroy?.();
      viewerRef.current = null;
      autorotateRef.current = null;
    };
  }, [autoRotate, imageUrl, inViewport, isMarzipanoReady, yawSpeed]);

  useEffect(() => {
    const viewer = viewerRef.current;
    const autorotate = autorotateRef.current;

    if (!viewer || !autorotate) {
      return;
    }

    if (autoRotate && inViewport) {
      viewer.startMovement(autorotate);
      viewer.setIdleMovement(3000, autorotate);
      return;
    }

    viewer.stopMovement();
    viewer.setIdleMovement(Infinity);
  }, [autoRotate, inViewport]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-900">
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none select-none"
      />
    </div>
  );
};

export default TourPreviewViewer;
