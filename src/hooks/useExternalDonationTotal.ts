import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type ExternalDonationTotal = {
  donated_amount_in_cents: number;
  id: number;
};

export const useExternalDonationTotal = () => {
  return useQuery({
    queryKey: ["external_donation_total"],
    queryFn: async () => {
      const { data } = await axios.get<{ data: ExternalDonationTotal }>(
        `${import.meta.env.VITE_API_BASE_URL}/items/external_donation_total`
      );
      return data.data;
    },
    staleTime: 5 * 1000,
    refetchInterval: 5 * 1000,
    refetchIntervalInBackground: true,
  });
};
