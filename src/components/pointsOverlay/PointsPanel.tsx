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
      className="flex w-full max-w-[440px] flex-col items-center rounded-lg border-4 border-[color-mix(in_oklab,currentColor,white_50%)] bg-gradient-to-t from-current to-[color-mix(in_oklab,currentColor,white_35%)] pb-3 pt-2 text-5xl text-[--accentColor]"
      style={{ "--accentColor": accentColor }}
    >
      <div className="mb-4 font-semibold text-[color-mix(in_oklab,currentColor,black_60%)]">
        {name}
      </div>
      <div className="w-[180px] rounded-md bg-[color-mix(in_oklab,currentColor,white_60%)] px-6 pb-2 pt-1 text-center text-[3.25rem] shadow-[inset_0_0_5px_3px_color-mix(in_oklab,currentColor,#00000049_25%)]">
        <span className="font-bold text-[color-mix(in_oklab,currentColor,black_50%)]">
          {points}
        </span>
      </div>
    </div>
  );
};
