import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Donation = {
  id: number;
  donated_amount_in_cents: number | null;
  donator_name: string | null;
  donation_comment: string | null;
};

export enum DonationSorting {
  HIGHEST = "-donated_amount_in_cents",
  NEWEST = "-date_created",
}

export const useDonations = (sorting?: DonationSorting, limit: number = 3) => {
  return useQuery({
    queryKey: ["donations", sorting],
    queryFn: async () => {
      const { data } = await axios.get<{ data: Donation[] }>(
        `${import.meta.env.VITE_API_BASE_URL}/items/donations?fields=id,donated_amount_in_cents,donator_name,donation_comment&limit=${limit}${sorting ? `&sort=${sorting}` : ""}${sorting === DonationSorting.HIGHEST ? "&filter[donated_amount_in_cents][_nnull]=true" : ""}&filter[hide_from_layout][_neq]=true`
      );
      return data.data;
    },
    staleTime: 5 * 1000,
    refetchInterval: 5 * 1000,
    refetchIntervalInBackground: true,
  });
};
