import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type BidwarResults = {
  results: {
    id: number;
    status: "active" | "inactive" | "results";
    bidwar_name: string;
    bidwar_description: string;
    bidwar_name_en: string | null;
    bidwar_description_en: string | null;
    options: Record<string, number>;
  }[];
  id: number;
};

export const useBidwarResults = () => {
  return useQuery({
    queryKey: ["bidwar_results"],
    queryFn: async () => {
      const { data } = await axios.get<{ data: BidwarResults }>(
        `${import.meta.env.VITE_API_BASE_URL}/items/bidwar_results`
      );
      return data.data;
    },
    staleTime: 15 * 1000,
    refetchInterval: 15 * 1000,
    refetchIntervalInBackground: true,
  });
};
