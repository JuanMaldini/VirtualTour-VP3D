import ProjectTourPreviewCard from "./Tours/components/ProjectTourPreviewCard";

const projectTours = [
  {
    title: "TEK016-Cisco",
    to: "/TEK016Cisco",
    previewImageUrl: "/projects/TEK016-Cisco/TEK016-Cisco-View01.jpg",
  },
];

const Projects = () => (
  <div className="flex min-h-full w-full flex-1 flex-col bg-gray-900 px-4 py-6 sm:px-6">
    <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 lg:grid-cols-3">
      {projectTours.map((tour) => (
        <ProjectTourPreviewCard
          key={`${tour.to}-${tour.title}-${tour.previewImageUrl}`}
          to={tour.to}
          title={tour.title}
          previewImageUrl={tour.previewImageUrl}
        />
      ))}
    </div>
  </div>
);

export default Projects;
