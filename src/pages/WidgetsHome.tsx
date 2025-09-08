import { Link } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";

const links = [
  {
    href: "/widgets/points-overlay",
    label: "Points Overlay",
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
