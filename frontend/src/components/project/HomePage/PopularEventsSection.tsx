import { useQuery } from "@tanstack/react-query";
import { GetEventsAPI } from "@/services/EventService";
import TicketingPlatformCards from "./TicketingPlatformCards";
import LoadingSpinner from "../LoadingSpinner";


export default function PopularEventsSection() {
  const {
    data: popularEvents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["popularEvents"],
    queryFn: () =>
      GetEventsAPI({ sortBy: "attendees", order: "desc", limit: 6 }),
  });

  if (isLoading)
    return (
      <LoadingSpinner/>
    );
  if (error)
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load events.
      </div>
    );

  return <TicketingPlatformCards events={popularEvents?.events} />;
}
