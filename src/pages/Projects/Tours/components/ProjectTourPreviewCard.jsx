import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TourPreviewViewer from "./TourPreviewViewer";

const ProjectTourPreviewCard = ({ to, title, previewImageUrl }) => {
  const cardRef = useRef(null);
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const target = cardRef.current;
    if (!target) {
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsInViewport(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      {
        threshold: 0.3,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Link to={to} className="mx-auto block w-full max-w-[23.5rem] no-underline">
      <article
        ref={cardRef}
        className="h-full overflow-hidden rounded-md border border-slate-200 bg-white p-2.5 shadow-sm ring-1 ring-inset ring-transparent transition-colors duration-200 hover:ring-sky-200"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <TourPreviewViewer imageUrl={previewImageUrl} inViewport={isInViewport} />
        </div>
        <p className="mt-2 text-sm font-medium leading-tight text-slate-900 sm:text-base">{title}</p>
      </article>
    </Link>
  );
};

export default ProjectTourPreviewCard;
