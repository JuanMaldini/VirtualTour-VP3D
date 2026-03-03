import React from "react";
import { Link } from "react-router-dom";

const Projects = () => (
  <div className="flex min-h-full w-full flex-1 flex-col bg-gray-100 px-6 py-8">
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">

      <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">
          Virtual Tour
        </div>
        <div className="flex flex-col gap-1">
          <Link
            to="/apartment-1"
            className="w-fit text-base font-medium text-slate-900 no-underline transition-colors hover:text-slate-600"
          >
            TEK016-Cisco
          </Link>

        </div>
      </div>


    </div>
  </div>
);

export default Projects;
