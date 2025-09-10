export type PointsPanelProps = {
  name: string;
  points: number;
  accentColor: string;
};

export const PointsPanel = ({
  name,
  points,
  accentColor,
}: PointsPanelProps) => {
  return (
    <div
      className="flex w-full max-w-[440px] flex-col items-center rounded-lg border-4 border-[color-mix(in_oklab,currentColor,white_40%)] bg-gradient-to-tr from-[currentColor] to-[color-mix(in_oklab,currentColor,white_25%)] pb-4 pt-2 text-5xl text-[--accentColor]"
      style={{ "--accentColor": accentColor }}
    >
      <div className="mb-2 font-semibold text-[color-mix(in_oklab,currentColor,black_60%)]">
        {name}
      </div>
      <div className="w-[180px] rounded-md bg-[color-mix(in_oklab,currentColor,white_60%)] px-6 py-1 text-center text-[3.5rem]">
        <span className="font-bold text-[color-mix(in_oklab,currentColor,black_50%)]">
          {points}
        </span>
      </div>
    </div>
  );
};
