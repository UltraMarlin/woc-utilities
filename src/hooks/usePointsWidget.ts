import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type PointWidgetCMSEntry = {
  id: number;
  name: string | null;
  points: number | null;
  accent_color: string | null;
  active: boolean;
};

export type PointWidgetEntry = {
  id: number;
  name: string;
  points: number;
  accent_color: string;
  active: boolean;
};

export const usePointsWidget = () => {
  const rawQueryResult = useQuery({
    queryKey: ["points_widget"],
    queryFn: async () => {
      const { data } = await axios.get<{ data: PointWidgetCMSEntry[] }>(
        `${import.meta.env.VITE_API_BASE_URL}/items/points_widget?fields=id,name,points,accent_color,active&filter[active][_eq]=true`
      );
      return data.data;
    },
  });

  const pointsWidgetEntries: PointWidgetEntry[] =
    rawQueryResult.data?.filter(
      (entry): entry is PointWidgetEntry =>
        typeof entry.name === "string" &&
        typeof entry.points === "number" &&
        typeof entry.accent_color === "string"
    ) || [];

  return { ...rawQueryResult, data: pointsWidgetEntries };
};
