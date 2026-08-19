import { Link } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";

const links = [
  {
    href: "/streaming/points-overlay",
    label: "Points Overlay",
  },
  {
    href: "/streaming/obs-overlay",
    label: "OBS Overlay",
  },
  {
    href: "/streaming/obs-background",
    label: "OBS Background",
  },
  {
    href: "/streaming/obs-intermission",
    label: "OBS Intermission",
  },
];

export const WidgetsHome = () => {
  return (
    <PageContainer>
      <ul className="flex flex-col gap-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              to={link.href}
              className="text-2xl underline hover:decoration-2"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
};
