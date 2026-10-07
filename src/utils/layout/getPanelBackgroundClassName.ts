import cn from "classnames";

export const getPanelBackgroundClassName = (theme: "light" | "dark") =>
  cn({
    "bg-yellow26/75": theme === "light",
    "bg-purpleDark26/90": theme === "dark",
  });
