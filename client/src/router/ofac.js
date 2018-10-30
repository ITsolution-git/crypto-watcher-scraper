import Ofac from "@/components/ofac/ofac";

import { getDefaultComponents } from "./helper";

export default [
  {
    path: "/ofac",
    ...getDefaultComponents(Ofac)
  }
];
