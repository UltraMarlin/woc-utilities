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
      className="flex w-full max-w-[440px] flex-col items-center rounded-t-3xl bg-[currentColor] py-4 text-5xl text-[--accentColor]"
      style={{ "--accentColor": accentColor }}
    >
      <div className="mb-4 font-semibold text-[color-mix(in_oklab,currentColor,black_60%)]">
        {name}
      </div>
      <div className="w-[180px] bg-[color-mix(in_oklab,currentColor,white_70%)] px-6 py-3 text-center text-[3.5rem]">
        <span className="font-bold text-[color-mix(in_oklab,currentColor,black_50%)]">
          {points}
        </span>
      </div>
    </div>
  );
};
