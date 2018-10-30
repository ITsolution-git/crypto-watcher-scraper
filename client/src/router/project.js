import Projects from "@/components/projects/projects";
// import ViewProject from "@/components/projects/view_project";

import { getDefaultComponents } from "./helper";

export default [
  {
    path: "/projects",
    ...getDefaultComponents(Projects)
  },
  {
    path: "/projects/:projectId",
    ...getDefaultComponents(Projects)
  }
];
