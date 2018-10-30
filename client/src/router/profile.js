import Profile from "@/components/profile/profile";

import { getDefaultComponents } from "./helper";

export default [
  {
    path: "/profile",
    ...getDefaultComponents(Profile)
  }
];
