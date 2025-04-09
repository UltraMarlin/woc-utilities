import cn from "classnames";

export type ExampleComponentProps = {
  className?: string;
  headline: string;
};

export const ExampleComponent = ({
  headline,
  className,
}: ExampleComponentProps) => {
  return (
    <div
      className={cn(
        "size-[1440px] origin-top-left bg-gradient-to-tr from-blue-400 to-pink-600 p-4 text-white",
        className
      )}
    >
      <h1 className="mb-4 text-center text-4xl font-bold">{headline}</h1>
      <p>Hallo</p>
      <ul className="mb-8 text-2xl">
        <li>Erstens</li>
        <li>Zweitens</li>
        <li>Drittens</li>
      </ul>
      <p>More Info</p>
    </div>
  );
};
