import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetEventsByOrganizerAPI } from "@/services/EventService";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { Search, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import EventTable from "@/components/project/Events/EventTable";

interface Filters {
  search: string;
  status: string;
  page: number;
  limit: number;
}

export default function MyEvents() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userData,token } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounce(searchText, 500);

  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
  });

  useEffect(() => {
    const updatedFilters = {
      ...filters,
      search: debouncedSearchText,
      page: 1,
    };
    setFilters(updatedFilters);
    updateUrlParams(updatedFilters);
  }, [debouncedSearchText]);

  const updateUrlParams = (updatedFilters: Filters) => {
    const params = new URLSearchParams(
      Object.entries(updatedFilters)
        .filter(([_, v]) => v !== "")
        .map(([k, v]) => [k, String(v)])
    );
    navigate(`?${params.toString()}`, { replace: true });
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["organizer-events", filters],
    queryFn: () =>
      GetEventsByOrganizerAPI(userData?._id, token as string, filters),
    enabled: !!userData?._id && !!token,
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "search") {
      setSearchText(value);
    }
  };

  const handleStatusChange = (value: string) => {
    if(value==="all"){
      value="";
    }
    const updatedFilters = {
      ...filters,
      status: value,
      page: 1,
    };
    setFilters(updatedFilters);
    updateUrlParams(updatedFilters);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      live: "bg-green-500/20 text-green-500",
      draft: "bg-yellow-500/20 text-yellow-500",
      ended: "bg-gray-500/20 text-gray-500",
      upcoming: "bg-blue-500/20 text-blue-500",
    };
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffa509]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load events</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#050b2c]">My Events</h1>
          <p className="text-gray-500">Manage and track your events</p>
        </div>
        <Link to="/create-event">
          <Button className="bg-[#ffa509] hover:bg-[#ff9100] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create New Event
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            name="search"
            placeholder="Search events..."
            value={searchText}
            onChange={handleFilterChange}
            className="pl-10"
          />
        </div>
        <Select name="status" value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Tickets Sold</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.events?.length > 0 ? (
              data?.events?.map((event: any) => (
                <EventTable
                  key={event._id}
                  event={event}
                  getStatusBadge={getStatusBadge}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <div className="text-gray-500 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>No events found</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
