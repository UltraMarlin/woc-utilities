import { Link } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";

const links = [
  {
    href: "/schedule-images",
    label: "Schedule Images",
  },
  {
    href: "/youtube",
    label: "Youtube",
  },
];

export const Home = () => {
  return (
    <PageContainer>
      <div className="flex flex-col gap-4 rounded-lg bg-neutral-200 p-4">
        {links.map((link) => (
          <Link
            to={link.href}
            key={link.href}
            className="w-fit text-2xl underline hover:decoration-2"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </PageContainer>
  );
};
