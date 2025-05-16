import { Link } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";

const links = [
  {
    href: "/schedule-images",
    label: "Schedule Images",
  },
  {
    href: "/yt-descriptions",
    label: "Youtube Descriptions (WIP)",
  },
  {
    href: "/yt-thumbnails",
    label: "Youtube Thumbnails (WIP)",
  },
];

export const Home = () => {
  return (
    <PageContainer isHome>
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
