import { usePointsWidget } from "../hooks/usePointsWidget";
import { PointsPanel } from "../components/pointsOverlay/PointsPanel";

export const WidgetPointsOverlay = () => {
  const { data: pointsWidgetEntries, status: pointsWidgetStatus } =
    usePointsWidget();

  if (pointsWidgetStatus !== "success") return "Loading...";

  return (
    <div className="flex w-[3200px] justify-around gap-8 px-4 pt-8">
      {pointsWidgetEntries.map((entry) => (
        <PointsPanel
          key={entry.id}
          name={entry.name}
          points={entry.points}
          accentColor={entry.accent_color}
        />
      ))}
    </div>
  );
};
