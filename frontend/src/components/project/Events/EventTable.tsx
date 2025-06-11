import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { BarChart2, Calendar, DollarSign, Edit, MapPin, Ticket, Users } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CustomAlertDialog from "../AlertDialog";
import { useMutation } from "@tanstack/react-query";
import { DeleteEventAPI } from "@/services/EventService";
import CustomAlertMessageDialog from "../AlertMessageDialog";
import { useAuth } from "@/context/AuthContext";
import DeleteEvent from "./DeleteEvent";


const EventTable = ({event,getStatusBadge}:{event:any,getStatusBadge:any}) => {
  const {token}=useAuth();
  const navigate=useNavigate();
      
 
    return (
              <TableRow key={event._id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#ffa509]" />
                    {format(new Date(event.date), "MMM d, yyyy")} {event.time}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#ffa509]" />
                    {event.location.venue}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-[#ffa509]" />
                    {event.ticketsSold || 0}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#ffa509]" />$
                    {event.revenue || 0}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(event.status)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" className="hover:text-blue-500" size="icon" asChild>
                      <Link
                        to={`/events/${event._id}/edit`}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" className="hover:text-blue-500" size="icon" asChild>
                      <Link
                        to={`/dashboard/events/${event._id}/analytics`}
                        title="Analytics"
                      >
                        <BarChart2 className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" className="hover:text-blue-500" size="icon" asChild>
                      <Link
                        to={`/dashboard/events/${event._id}/attendees`}
                        title="Attendees"
                      >
                        <Users className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteEvent id={event._id} addName=""/>
                  </div>
                </TableCell>
              </TableRow>
              
    );
}
export default EventTable