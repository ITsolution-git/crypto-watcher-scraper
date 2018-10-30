import ViewFile from "@/components/file/view_file";
import ViewRawFile from '@/components/file/view_raw_file';

import { getDefaultComponents } from "./helper";

export default [
  {
    path: "/projects/:projectId/file/:fileId",
    ...getDefaultComponents(ViewFile)
  },
  {
    path: "/projects/:projectId/rawfile/:fileId",
    ...getDefaultComponents(ViewRawFile)
  }
];
