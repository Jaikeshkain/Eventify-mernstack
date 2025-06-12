import axios from 'axios';

const API_URL = 'http://localhost:5000';

const CreateEventAPI = async (formData:FormData,token:string) => {
    try {
        const response = await axios.post(`${API_URL}/api/events/create-event`, formData,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to create event");
    }
};

interface EventFilters {
  search?: string;
  eventType?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  location?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}


const GetEventsAPI = async (filters?: EventFilters) => {
  try {
    const response = await axios.get(`${API_URL}/api/events`, {
      params: filters,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch events");
  }
};



// Get events by organizer
const GetEventsByOrganizerAPI = async (
  organizerId: string,
  token: string,
  filters?: EventFilters
) => {
  try {
    const response = await axios.get(`${API_URL}/api/events/organizer/${organizerId}`,{
        params: filters, // ✅ Axios will serialize this into query string
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Standard Bearer token usage
        },
      }
    );

    return response.data;
  } catch (error: any) {
    // ✅ Provide more debugging information if needed
    console.error("Error fetching organizer events:", error?.response?.data);
    throw new Error(error?.response?.data?.message || "Failed to fetch events");
  }
};

// Get event by id
const GetEventByIdAPI=async(id:string)=>{
  try {
    const response=await axios.get(`${API_URL}/api/events/${id}`)
    return response.data;
  } catch (error:any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch event");
  }
}

//delete an event
const DeleteEventAPI=async(id:string,token:string)=>{
  try {
    const response=await axios.delete(`${API_URL}/api/events/delete-event/${id}`,{headers:{Authorization:`Bearer ${token}`}})
    return response.data;
  } catch (error:any) {
    throw new Error(error?.response?.data?.message || "Failed to delete event");
  }
}

//edit event images
const EditEventImagesAPI = async ({id,token,newImages,keepImages}:{id:string,token:string,newImages:File[],keepImages:string[]}) => {
  try {
    const formData = new FormData();
    formData.append("keepImages", JSON.stringify(keepImages));
    newImages.forEach((file) => formData.append("newImages", file));

    const response = await axios.put(
      `${API_URL}/api/events/edit-event-images/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to edit event images");
  }
};

//edit event
const EditEventAPI=async(id:string,token:string,body:any)=>{
  try {
    const response=await axios.put(`${API_URL}/api/events/edit-event/${id}`,body,{headers:{Authorization:`Bearer ${token}`}})
    return response.data;
  } catch (error:any) {
    throw new Error(error?.response?.data?.message || "Failed to edit event");
  }
}

//get upcoming events
const GetUpcomingEventsAPI=async()=>{
  try {
    const response=await axios.get(`${API_URL}/api/events/upcoming-events`)
    return response.data;
  } catch (error:any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch upcoming events");
  }
}

export { CreateEventAPI, GetEventsAPI, GetEventsByOrganizerAPI, GetEventByIdAPI, DeleteEventAPI, EditEventImagesAPI, API_URL, EditEventAPI, GetUpcomingEventsAPI };
