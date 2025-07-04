import { useEffect, useState } from "react";
import EventCard from "@/components/project/Events/EventCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaHome,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBuilding,
  FaSearch,
  FaSort,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { GetEventsAPI } from "@/services/EventService";
import { RxReset } from "react-icons/rx";
const ITEMS_PER_PAGE = 9;
const EVENT_TYPES = ["in-person", "virtual"];

export default function EventsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      eventType: searchParams.get("eventType") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      location: searchParams.get("location") || "",
      sortBy: searchParams.get("sortBy") || "createdAt",
      order: searchParams.get("order") || "desc",
    });

    setCurrentPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

const { data, isLoading, error } = useQuery({
  queryKey: ["all-events", filters, currentPage],
  queryFn: () =>
    GetEventsAPI({
      ...filters,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    }),
});

const events = data?.events || [];
const totalPages = data?.pagination?.totalPages || 1;

const handleFilterChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  const updatedFilters = { ...filters, [name]: value };
  setFilters(updatedFilters);
  setCurrentPage(1);

  const params = new URLSearchParams(
    Object.entries({ ...updatedFilters, page: "1" })
      .filter(([_, v]) => v !== "")
      .map(([k, v]) => [k, String(v)])
  );
  navigate(`?${params.toString()}`);
};



  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Optional: Update URL with new filters using navigate()
    const params = new URLSearchParams(
      Object.entries({ ...filters, page: "1" })
        .filter(([_, v]) => v !== "")
        .map(([k, v]) => [k, String(v)])
    );
    navigate(`?${params.toString()}`);
  };

const handlePageChange = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages) {
    setCurrentPage(newPage);
    const params = new URLSearchParams(
      Object.entries({ ...filters, page: newPage.toString() })
        .filter(([_, v]) => v !== "")
        .map(([k, v]) => [k, String(v)])
    );
    navigate(`?${params.toString()}`);
  }
};

const handleResetFilters = () => {
  setFilters({
    search: "",
    eventType: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    sortBy: "createdAt",
    order: "desc",
  });
  setCurrentPage(1);
  const params = new URLSearchParams(
    Object.entries({ ...filters, page: "1" })
      .filter(([_, v]) => v !== "")
      .map(([k, v]) => [k, String(v)])
  );
  navigate(`?${params.toString()}`);
  navigate("/events");
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050b2c] to-[#0a1854] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header Section */}
        <div className="relative mb-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[#ffa509]/10 rounded-3xl backdrop-blur-sm"></div>

          <div className="relative px-6 py-12 md:py-20 lg:py-24 rounded-3xl overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-[#ffa509]/20 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#ffa509]/20 to-transparent rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="relative max-w-4xl mx-auto text-center space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Discover Your Perfect Event
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
                Your journey to finding the ideal event starts here
              </p>

              {/* Quick Search Form */}
              <div className="max-w-3xl mx-auto mt-8">
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col md:flex-row gap-4"
                >
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Enter location, event type, or keywords..."
                      className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-5 py-4 text-white placeholder-gray-400 focus:border-[#ffa509] focus:ring-[#ffa509] backdrop-blur-lg"
                    />
                    <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#ffa509] text-white px-8 py-4 rounded-xl hover:bg-[#ff9100] transition-colors duration-200 flex items-center justify-center gap-2 font-semibold whitespace-nowrap"
                  >
                    <FaSearch className="text-lg" />
                    Search Now
                  </button>
                </form>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ffa509]">200+</div>
                  <div className="text-gray-300">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ffa509]">150+</div>
                  <div className="text-gray-300">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ffa509]">50+</div>
                  <div className="text-gray-300">Locations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ffa509]">24/7</div>
                  <div className="text-gray-300">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
            <FaHome className="text-[#ffa509]" />
            Available Events
          </h1>

          <form onSubmit={handleSearch}>
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 shadow-xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Search Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                    <FaSearch className="text-[#ffa509]" />
                    Search
                  </label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search events..."
                    className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 focus:border-[#ffa509] focus:ring-[#ffa509] text-white placeholder-gray-400"
                  />
                </div>

                {/* Property Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                    <FaBuilding className="text-[#ffa509]" />
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    value={filters.eventType}
                    onChange={handleFilterChange}
                    className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 focus:border-[#ffa509] focus:ring-[#ffa509] text-white"
                  >
                    <option className="text-black" value="">
                      All Event Types
                    </option>
                    {EVENT_TYPES.map((type) => (
                      <option className="text-black" key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#ffa509]" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Enter location..."
                    className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 focus:border-[#ffa509] focus:ring-[#ffa509] text-white placeholder-gray-400"
                  />
                </div>

                {/* Price Range Filters */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                      <FaMoneyBillWave className="text-[#ffa509]" />
                      Min Price
                    </label>
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Enter minimum price"
                      className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 focus:border-[#ffa509] focus:ring-[#ffa509] text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                      <FaMoneyBillWave className="text-[#ffa509]" />
                      Max Price
                    </label>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Enter maximum price"
                      className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 focus:border-[#ffa509] focus:ring-[#ffa509] text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Sort Options */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
                    <FaSort className="text-[#ffa509]" />
                    Sort By
                  </label>
                  <div className="flex gap-4">
                    <select
                      name="sortBy"
                      value={filters.sortBy}
                      onChange={handleFilterChange}
                      className="flex-1 bg-white/10 border border-gray-600 rounded-lg px-4 py-2 focus:border-[#ffa509] focus:ring-[#ffa509] text-white"
                    >
                      <option value="createdAt">Date Added</option>
                      <option value="price">Price</option>
                      <option value="title">Title</option>
                    </select>
                    <select
                      name="order"
                      value={filters.order}
                      onChange={handleFilterChange}
                      className="flex-1 bg-white/10 border border-gray-600 rounded-lg px-4 py-2 focus:border-[#ffa509] focus:ring-[#ffa509] text-white"
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center mt-6">
                <button
                  type="submit"
                  className="bg-[#ffa509] text-white px-8 py-3 rounded-lg hover:bg-[#ff9100] transition-colors duration-200 flex items-center gap-2 font-semibold"
                >
                  <FaSearch />
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={() => handleResetFilters()}
                  className="bg-[#ffa509] text-white px-8 py-3 rounded-lg hover:bg-[#ff9100] transition-colors duration-200 flex items-center gap-2 font-semibold"
                >
                  <RxReset className="text-lg font-bold" />
                  Reset Filters
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffa509] mx-auto"></div>
            <p className="text-white mt-4">Loading events...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-500/20 backdrop-blur-lg border border-red-500 text-red-100 px-6 py-4 rounded-lg inline-block">
              {error.message}
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event: any) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-6 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                currentPage === 1
                  ? "bg-gray-600/50 cursor-not-allowed text-gray-400"
                  : "bg-[#ffa509] hover:bg-[#ff9100] text-white transition-colors duration-200"
              }`}
            >
              <FaSortAmountUp className="rotate-90" />
              Previous
            </button>
            <span className="text-white font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                currentPage === totalPages
                  ? "bg-gray-600/50 cursor-not-allowed text-gray-400"
                  : "bg-[#ffa509] hover:bg-[#ff9100] text-white transition-colors duration-200"
              }`}
            >
              Next
              <FaSortAmountDown className="rotate-90" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
