import { useQuery } from "@tanstack/react-query";
import { getOrganizerTickets } from "@/services/TicketService";
import { useAuth } from "@/context/AuthContext";

export const useOrganizerTickets = ({ page, search, status, eventId, limit }: { page: number, search: string, status: string, eventId: string, limit: number }) => {
    const {token}=useAuth()
    if(!token){
        return {
            data: null,
            isLoading: false,
            error: null,
        }
    }
  return useQuery({
    queryKey: ["organizer-tickets", page, search, status, eventId],
    queryFn: () => getOrganizerTickets(page, search, status, eventId, limit, token),
  });
};
