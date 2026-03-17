import { useEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FaLocationDot } from "react-icons/fa6";
import { IoInformationCircleOutline } from "react-icons/io5";
import bowser from "bowser";
import "../style.css";
import "../../../components/InfoCardModal/InfoCardModal.css";
import MarzipanoTopBar from "../components/MarzipanoTopBar";
import InfoCardModal from "../../../components/InfoCardModal/InfoCardModal";
import TourLoadSnackbar from "../components/TourLoadSnackbar";
import ViewControlButtons from "../components/ViewControlButtons";
import {
  buildTourAssetManifest,
  preloadTourAssetsWithProgress,
} from "../utils/tourAssetLoading";

// Generated from /playground
// Info hotspot images — replace blob URLs with real asset paths before deploying:
const infoHotspotImg_s2_h0 = "/projects/TEK016-Cisco/WB/Cisco Webex Board Pro 55 Floor stand.jpg"; // /projects/clientes/cliente/Cisco Webex Board Pro 55 Floor stand.jpg
const infoHotspotImg_s3_h0 = "/projects/TEK016-Cisco/WB/Cisco 8875 phone.jpg"; // /projects/clientes/cliente/Cisco 8875 phone.jpg
const infoHotspotImg_s1_h0 = "/projects/TEK016-Cisco/WB/Cisco 8875 phone.jpg"; // /projects/clientes/cliente/Cisco 8875 phone.jpg

// Relative positions (0..1) over floorplan image.
export const floorplanScenePositions = [
  { id: "scene-1", x: 0.5, y: 0.5 },
  { id: "scene-2", x: 0.5, y: 0.5 },
  { id: "scene-3", x: 0.5, y: 0.5 },
  { id: "scene-4", x: 0.5, y: 0.5 },
];

export const data = {
  scenes: [
    {
      id: "scene-1",
      name: "scene-1",
      imageUrl: "/projects/TEK016-Cisco/TEK016-Cisco-View01.jpg", // original file: TEK016-Cisco-View01.jpg
      equirectWidth: 4000,
      initialViewParameters: {
        pitch: 0,
        yaw: 0,
        fov: 110,
      },
      linkHotspots: [
        { yaw: 62.448729, pitch: -19.091481, target: "scene-2" },
        { yaw: -30.805296, pitch: -23.965281, target: "scene-3" },
      ],
      infoHotspots: [
      ],
    },
    {
      id: "scene-2", 
      name: "scene-2",
      imageUrl: "/projects/TEK016-Cisco/TEK016-Cisco-View02.jpg", // original file: TEK016-Cisco-View02.jpg
      equirectWidth: 4000,
      linkHotspots: [
        { yaw: -46.48106, pitch: -20.922145, target: "scene-1" },
        { yaw: 72.407732, pitch: -21.562644, target: "scene-4" },
      ],
      infoHotspots: [
        { yaw: -68.572587, pitch: -10.81987, title:   "titlé", text: "", showImage: true, imageUrl: infoHotspotImg_s1_h0 },
      ],
    },
    {
      id: "scene-3",
      name: "scene-3",
      imageUrl: "/projects/TEK016-Cisco/TEK016-Cisco-View03.jpg", // original file: TEK016-Cisco-View03.jpg
      equirectWidth: 4000,
      linkHotspots: [
        { yaw: -130.506397, pitch: -27.315622, target: "scene-1" },
        { yaw: 122.89165, pitch: -18.392499, target: "scene-4" },
      ],
      infoHotspots: [
        { yaw: -17.654822, pitch: 3.412943, title: "tele", text: "", showImage: true, imageUrl: infoHotspotImg_s2_h0 },
      ],
    },
    {
      id: "scene-4",
      name: "scene-4",
      imageUrl: "/projects/TEK016-Cisco/TEK016-Cisco-View04.jpg", // original file: TEK016-Cisco-View04.jpg
      equirectWidth: 4000,
      linkHotspots: [
        { yaw: -118.840023, pitch: -22.266233, target: "scene-2" },
        { yaw: -33.788245, pitch: -17.393323, target: "scene-3" },
      ],
      infoHotspots: [
        { yaw: -96.196475, pitch: -4.927095, title: "telefono", text: "", showImage: true, imageUrl: infoHotspotImg_s3_h0 },
      ],
    }
  ],
  name: "TEK016Cisco",
  floorplanImageUrl: "",
  settings: {
    mouseViewMode: "drag",
    autorotateEnabled: false,
    fullscreenButton: true,
    viewControlButtons: false,
  },
};

const TEK016Cisco = () => {
  const rootRef = useRef(null);
  const [resolvedAssetUrls, setResolvedAssetUrls] = useState(null);
  const [loadProgress, setLoadProgress] = useState({
    visible: false,
    loadedBytes: 0,
    totalBytes: 0,
    completedFiles: 0,
    totalFiles: 0,
    hasError: false,
  });
  const [viewControlsContext, setViewControlsContext] = useState({
    viewer: null,
    Marzipano: null,
  });

  const degToRad = (deg) => (deg * Math.PI) / 180;
  const hotspotPitchSign = -1;
  const hasFloorplanImage =
    typeof data.floorplanImageUrl === "string" &&
    data.floorplanImageUrl.trim().length > 0;

  const assetUrls = useMemo(
    () => ({
      floorplan: hasFloorplanImage
        ? new URL(data.floorplanImageUrl, import.meta.url).href
        : "",
      close: new URL("../imgButtons/close.png", import.meta.url).href,
    }),
    [hasFloorplanImage],
  );

  useEffect(() => {
    setResolvedAssetUrls(assetUrls);
  }, [assetUrls]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    const body = document.body;
    const bodyClasses = [];
    if (data.scenes.length > 1) {
      bodyClasses.push("multiple-scenes");
    } else {
      bodyClasses.push("single-scene");
    }
    bodyClasses.forEach((className) => body.classList.add(className));
    body.classList.add("marzipano-navbar");

    const ensureLink = (href, id) => {
      const existing = document.querySelector(`link[data-marzipano="${id}"]`);
      if (existing) {
        return existing;
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.marzipano = id;
      document.head.appendChild(link);
      return link;
    };

    const loadScriptOnce = (src, id) =>
      new Promise((resolve, reject) => {
        const existing = document.querySelector(
          `script[data-marzipano="${id}"]`,
        );
        if (existing) {
          if (existing.dataset.loaded === "true") {
            resolve();
          } else {
            existing.addEventListener("load", resolve, { once: true });
            existing.addEventListener("error", reject, { once: true });
          }
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.dataset.marzipano = id;
        script.addEventListener(
          "load",
          () => {
            script.dataset.loaded = "true";
            resolve();
          },
          { once: true },
        );
        script.addEventListener("error", reject, { once: true });
        document.head.appendChild(script);
      });

    ensureLink("https://www.marzipano.net/demos/common/reset.css", "reset");

    let disposed = false;
    let preloadAbortController = null;
    let revokePreloadedUrls = () => {};
    const infoModals = [];

    const assetManifest = buildTourAssetManifest(data, assetUrls);
    setLoadProgress({
      visible: assetManifest.totalFiles > 0,
      loadedBytes: 0,
      totalBytes: 0,
      completedFiles: 0,
      totalFiles: assetManifest.totalFiles,
      hasError: false,
    });

    const init = async () => {
      preloadAbortController = new AbortController();
      const preloadPromise = preloadTourAssetsWithProgress({
        urls: assetManifest.allUrls,
        signal: preloadAbortController.signal,
        onProgress: (progress) => {
          if (disposed) {
            return;
          }
          setLoadProgress({
            visible: true,
            loadedBytes: progress.loadedBytes,
            totalBytes: progress.totalBytes,
            completedFiles: progress.completedFiles,
            totalFiles: progress.totalFiles,
            hasError: progress.hasError,
          });
        },
      });

      try {
        await Promise.all([
          preloadPromise,
          loadScriptOnce("/build/marzipano.js", "marzipano"),
          loadScriptOnce(
            "https://www.marzipano.net/demos/common/screenfull.js",
            "screenfull",
          ),
        ]);
      } catch (error) {
        if (!disposed) {
          setLoadProgress((previousState) => ({
            ...previousState,
            visible: false,
            hasError: true,
          }));
        }
        return;
      }

      const preloadResult = await preloadPromise;
      revokePreloadedUrls = preloadResult.revokeObjectUrls;

      const resolvePreloadedUrl = (url) => preloadResult.urlMap.get(url) || url;

      if (!disposed) {
        setResolvedAssetUrls((currentAssetUrls) => {
          if (!currentAssetUrls) {
            return currentAssetUrls;
          }
          return {
            ...currentAssetUrls,
            floorplan: resolvePreloadedUrl(currentAssetUrls.floorplan),
          };
        });
        setLoadProgress((previousState) => ({
          ...previousState,
          loadedBytes: preloadResult.loadedBytes,
          totalBytes: preloadResult.totalBytes,
          completedFiles: preloadResult.completedFiles,
          totalFiles: preloadResult.totalFiles,
          hasError: preloadResult.hasError,
          visible: false,
        }));
      }

      if (disposed) {
        revokePreloadedUrls();
        return;
      }

      const Marzipano = window.Marzipano;
      const screenfull = window.screenfull;

      if (!Marzipano) {
        return;
      }

      const panoElement = root.querySelector("#pano");
      const sceneNameElement = document.querySelector("#titleBar .sceneName");
      const sceneListElement = document.querySelector("#sceneList");
      const sceneElements = document.querySelectorAll(".scene[data-id]");
      const sceneListToggleElement = document.querySelector("#sceneListToggle");
      const sceneListCloseElement = document.querySelector(
        '.scene-list-close[data-action="close-scene-list"]',
      );
      const autorotateToggleElement =
        document.querySelector("#autorotateToggle");
      const fullscreenToggleElement =
        document.querySelector("#fullscreenToggle");

      if (!panoElement) {
        return;
      }

      if (window.matchMedia) {
        const mql = window.matchMedia(
          "(max-width: 500px), (max-height: 500px)",
        );
        const setMode = () => {
          if (mql.matches) {
            document.body.classList.remove("desktop");
            document.body.classList.add("mobile");
          } else {
            document.body.classList.remove("mobile");
            document.body.classList.add("desktop");
          }
        };
        setMode();
        mql.addListener(setMode);
      } else {
        document.body.classList.add("desktop");
      }

      document.body.classList.add("no-touch");
      window.addEventListener("touchstart", () => {
        document.body.classList.remove("no-touch");
        document.body.classList.add("touch");
      });

      if (bowser.msie && parseFloat(bowser.version) < 11) {
        document.body.classList.add("tooltip-fallback");
      }

      const viewerOpts = {
        controls: {
          mouseViewMode: data.settings.mouseViewMode,
        },
      };

      const viewer = new Marzipano.Viewer(panoElement, viewerOpts);
      setViewControlsContext({ viewer, Marzipano });

      const scenes = data.scenes.map((sceneData) => {
        const sceneImageUrl = resolvePreloadedUrl(sceneData.imageUrl);
        const source = Marzipano.ImageUrlSource.fromString(sceneImageUrl);
        const geometry = new Marzipano.EquirectGeometry([
          { width: sceneData.equirectWidth || 4000 },
        ]);

        const limiter = Marzipano.RectilinearView.limit.traditional(
          4000,
          (120 * Math.PI) / 180,
          (120 * Math.PI) / 180,
        );
        const initialViewParameters = sceneData.initialViewParameters || {};
        const view = new Marzipano.RectilinearView(
          {
            yaw: degToRad(initialViewParameters.yaw ?? 0),
            pitch: degToRad(initialViewParameters.pitch ?? 0),
            fov: degToRad(initialViewParameters.fov ?? 110),
          },
          limiter,
        );

        const scene = viewer.createScene({
          source,
          geometry,
          view,
          pinFirstLevel: true,
        });

        sceneData.linkHotspots.forEach((hotspot) => {
          const element = createLinkHotspotElement(hotspot);
          scene.hotspotContainer().createHotspot(element, {
            yaw: degToRad(hotspot.yaw),
            pitch: degToRad(hotspot.pitch * hotspotPitchSign),
          });
        });

        sceneData.infoHotspots.forEach((hotspot) => {
          const element = createInfoHotspotElement(hotspot);
          scene.hotspotContainer().createHotspot(element, {
            yaw: degToRad(hotspot.yaw),
            pitch: degToRad(hotspot.pitch * hotspotPitchSign),
          });
        });

        return {
          data: sceneData,
          scene,
          view,
        };
      });

      const autorotate = Marzipano.autorotate({
        yawSpeed: 0.03,
        targetPitch: 0,
        targetFov: Math.PI / 2,
      });
      let autorotateEnabled = Boolean(data.settings.autorotateEnabled);

      autorotateToggleElement?.addEventListener("click", toggleAutorotate);

      if (data.settings.fullscreenButton) {
        document.body.classList.add("fullscreen-enabled");
        if (screenfull?.enabled) {
          fullscreenToggleElement?.addEventListener("click", () => {
            screenfull.toggle();
          });
          screenfull.on("change", () => {
            if (screenfull.isFullscreen) {
              fullscreenToggleElement?.classList.add("enabled");
            } else {
              fullscreenToggleElement?.classList.remove("enabled");
            }
          });
        } else {
          document.body.classList.add("fullscreen-unavailable");
          fullscreenToggleElement?.setAttribute("disabled", "true");
          fullscreenToggleElement?.setAttribute("aria-disabled", "true");
        }
      } else {
        document.body.classList.add("fullscreen-disabled");
      }

      if (sceneListToggleElement) {
        sceneListToggleElement.onclick = toggleSceneList;
      }

      if (sceneListCloseElement && sceneListToggleElement) {
        sceneListCloseElement.onclick = () => {
          sceneListToggleElement.click();
        };
      }

      if (!document.body.classList.contains("mobile")) {
        showSceneList();
      } else {
        hideSceneList();
      }

      scenes.forEach((scene) => {
        const elements = document.querySelectorAll(
          `.scene[data-id="${scene.data.id}"]`,
        );
        elements.forEach((el) => {
          el.addEventListener("click", () => {
            switchScene(scene);
            if (document.body.classList.contains("mobile")) {
              hideSceneList();
            }
          });
        });
      });

      function sanitize(value) {
        return value
          .replace("&", "&amp;")
          .replace("<", "&lt;")
          .replace(">", "&gt;");
      }

      const getInitialViewParameters = (scene) => {
        const params = scene.data.initialViewParameters || {};
        return {
          yaw: degToRad(params.yaw ?? 0),
          pitch: degToRad(params.pitch ?? 0),
          fov: degToRad(params.fov ?? 110),
        };
      };

      let activeScene = null;

      function switchScene(scene) {
        stopAutorotate();
        const nextParameters = activeScene
          ? activeScene.view.parameters()
          : getInitialViewParameters(scene);
        scene.view.setParameters(nextParameters);
        scene.scene.switchTo();
        activeScene = scene;
        startAutorotate();
        updateSceneName(scene);
        updateSceneList(scene);
      }

      function updateSceneName(scene) {
        if (sceneNameElement) {
          sceneNameElement.innerHTML = sanitize(scene.data.name);
        }
      }

      function updateSceneList(scene) {
        for (let i = 0; i < sceneElements.length; i += 1) {
          const el = sceneElements[i];
          if (el.getAttribute("data-id") === scene.data.id) {
            el.classList.add("current");
          } else {
            el.classList.remove("current");
          }
        }
      }

      function showSceneList() {
        sceneListElement?.classList.add("enabled");
        sceneListToggleElement?.classList.add("enabled");
      }

      function hideSceneList() {
        sceneListElement?.classList.remove("enabled");
        sceneListToggleElement?.classList.remove("enabled");
      }

      function toggleSceneList() {
        sceneListElement?.classList.toggle("enabled");
        sceneListToggleElement?.classList.toggle("enabled");
      }

      function startAutorotate() {
        if (!autorotateEnabled) {
          return;
        }
        viewer.startMovement(autorotate);
        viewer.setIdleMovement(3000, autorotate);
      }

      function stopAutorotate() {
        viewer.stopMovement();
        viewer.setIdleMovement(Infinity);
      }

      function toggleAutorotate() {
        autorotateEnabled = !autorotateEnabled;
        if (autorotateEnabled) {
          autorotateToggleElement?.classList.add("enabled");
          startAutorotate();
        } else {
          autorotateToggleElement?.classList.remove("enabled");
          stopAutorotate();
        }
      }

      function createLinkHotspotElement(hotspot) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("hotspot", "link-hotspot");

        const icon = document.createElement("div");
        icon.classList.add("link-hotspot-icon");
        icon.innerHTML = renderToStaticMarkup(
          <FaLocationDot aria-hidden="true" focusable="false" />,
        );

        const rotation = hotspot.rotation ?? 0;
        icon.style.setProperty("--hotspot-rotation", `${rotation}rad`);

        wrapper.addEventListener("click", () => {
          const targetScene = findSceneById(hotspot.target);
          if (!targetScene) {
            return;
          }
          switchScene(targetScene);
        });

        stopTouchAndScrollEventPropagation(wrapper);

        const tooltip = document.createElement("div");
        tooltip.classList.add("hotspot-tooltip", "link-hotspot-tooltip");
        tooltip.innerHTML =
          findSceneDataById(hotspot.target)?.name || String(hotspot.target);

        wrapper.appendChild(icon);
        wrapper.appendChild(tooltip);

        return wrapper;
      }

      function createInfoHotspotElement(hotspot) {
        const wrapper = document.createElement("div");
        wrapper.classList.add(
          "hotspot",
          "info-hotspot",
          "playground-info-hotspot",
        );

        const header = document.createElement("div");
        header.classList.add("info-hotspot-header");

        const iconWrapper = document.createElement("div");
        iconWrapper.classList.add("info-hotspot-icon-wrapper");
        const icon = document.createElement("div");
        icon.classList.add("info-hotspot-icon");
        icon.innerHTML = renderToStaticMarkup(
          <IoInformationCircleOutline
            aria-hidden="true"
            focusable="false"
            style={{ width: "100%", height: "100%" }}
          />,
        );
        iconWrapper.appendChild(icon);

        const titleWrapper = document.createElement("div");
        titleWrapper.classList.add("info-hotspot-title-wrapper");
        const title = document.createElement("div");
        title.classList.add("info-hotspot-title");
        title.innerHTML = hotspot.title;
        titleWrapper.appendChild(title);

        header.appendChild(iconWrapper);
        header.appendChild(titleWrapper);

        wrapper.appendChild(header);

        const modal = document.createElement("div");
        modal.classList.add("playground-info-card-backdrop");
        modal.innerHTML = renderToStaticMarkup(
          <InfoCardModal
            title={hotspot.title}
            text={hotspot.text}
            showImage={hotspot.showImage}
            imageUrl={hotspot.imageUrl}
          />,
        );
        document.body.appendChild(modal);
        infoModals.push(modal);

        const toggle = () => {
          const shouldOpen = !modal.classList.contains("visible");
          infoModals.forEach((entry) => entry.classList.remove("visible"));
          if (shouldOpen) {
            modal.classList.add("visible");
          }
        };

        const closeModal = () => {
          modal.classList.remove("visible");
        };

        wrapper
          .querySelector(".info-hotspot-header")
          ?.addEventListener("click", toggle);
        modal.addEventListener("click", (event) => {
          if (event.target === modal) {
            closeModal();
          }
        });

        stopTouchAndScrollEventPropagation(wrapper);

        return wrapper;
      }

      function stopTouchAndScrollEventPropagation(element) {
        const eventList = [
          "touchstart",
          "touchmove",
          "touchend",
          "touchcancel",
          "pointerdown",
          "pointermove",
          "pointerup",
          "pointercancel",
          "wheel",
        ];
        for (let i = 0; i < eventList.length; i += 1) {
          element.addEventListener(eventList[i], (event) => {
            event.stopPropagation();
          });
        }
      }

      function findSceneById(id) {
        for (let i = 0; i < scenes.length; i += 1) {
          if (scenes[i].data.id === id) {
            return scenes[i];
          }
        }
        return null;
      }

      function findSceneDataById(id) {
        for (let i = 0; i < data.scenes.length; i += 1) {
          if (data.scenes[i].id === id) {
            return data.scenes[i];
          }
        }
        return null;
      }

      if (autorotateEnabled) {
        autorotateToggleElement?.classList.add("enabled");
      } else {
        autorotateToggleElement?.classList.remove("enabled");
        stopAutorotate();
      }

      switchScene(scenes[0]);
    };

    init();

    return () => {
      disposed = true;
      preloadAbortController?.abort();
      revokePreloadedUrls();
      setViewControlsContext({ viewer: null, Marzipano: null });
      const toggleEl = document.querySelector("#sceneListToggle");
      const closeEl = document.querySelector(
        '.scene-list-close[data-action="close-scene-list"]',
      );
      if (toggleEl) {
        toggleEl.onclick = null;
      }
      if (closeEl) {
        closeEl.onclick = null;
      }
      bodyClasses.forEach((className) => body.classList.remove(className));
      body.classList.remove("marzipano-navbar");
      infoModals.forEach((modal) => modal.remove());
    };
  }, [assetUrls]);

  return (
    <div ref={rootRef} className="sample-ai-root">
      <TourLoadSnackbar
        visible={loadProgress.visible}
        loadedBytes={loadProgress.loadedBytes}
        totalBytes={loadProgress.totalBytes}
        completedFiles={loadProgress.completedFiles}
        totalFiles={loadProgress.totalFiles}
        hasError={loadProgress.hasError}
      />
      <div className="marzipano-topbar-shell">
        <MarzipanoTopBar
          scenes={data.scenes}
          assetUrls={resolvedAssetUrls || assetUrls}
          showFloorplan={hasFloorplanImage}
          floorplanPositions={floorplanScenePositions}
        />
      </div>
      <div id="pano" />
      <ViewControlButtons
        rootRef={rootRef}
        viewer={viewControlsContext.viewer}
        Marzipano={viewControlsContext.Marzipano}
        enabled={data.settings.viewControlButtons}
      />
    </div>
  );
};

export default TEK016Cisco;
