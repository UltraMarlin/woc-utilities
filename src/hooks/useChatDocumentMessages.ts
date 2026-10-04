import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type ChatDocumentMessage = {
  id: number;
  message: string | null;
};

export const useChatDocumentMessages = (limit?: number) => {
  return useQuery({
    queryKey: ["chat_document_messages", limit],
    queryFn: async () => {
      const { data } = await axios.get<{ data: ChatDocumentMessage[] }>(
        `${import.meta.env.VITE_API_BASE_URL}/items/chat_document_messages?fields=id,message&sort=-date_created&filter[status][_eq]=shown` +
          (limit ? `&limit=${limit}` : "")
      );
      return data.data;
    },
    staleTime: 5 * 1000,
    refetchInterval: 5 * 1000,
    refetchIntervalInBackground: true,
  });
};
