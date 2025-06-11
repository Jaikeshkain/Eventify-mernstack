import axios from "axios";
import { API_URL } from "./EventService";

export const getOrganizerTickets = async (
  page = 1,
  search = "",
  status: string,
  eventId: string,
  token: string,
) => {
  try{
  const params: any = { page, search };
  if (status) params.status = status;
  if (eventId) params.eventId = eventId;

  const res = await axios.get(`${API_URL}/api/tickets/get-tickets-by-organizer`, { params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to get tickets");
  }
};


//get tickets for attendee
export const getTicketsForAttendee = async (token: string) => {
  try {
    const res = await axios.get(`${API_URL}/api/tickets/get-tickets-by-attendee`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }catch(error:any){
    throw new Error(error?.response?.data?.message || "Failed to get tickets");
  }
};

//get ticket by id
export const getTicketByIdAPI = async (ticketId: string) => {
  try {
    const res = await axios.get(`${API_URL}/api/tickets/get-ticket-by-id/${ticketId}`);
    return res.data;
  }catch(error:any){
    throw new Error(error?.response?.data?.message || "Failed to get ticket");
  }
};
