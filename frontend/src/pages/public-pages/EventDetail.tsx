import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaLocationArrow,
  FaMoneyBillWave,
  FaTicketAlt,
  FaUsers,
} from "react-icons/fa";

// Slick carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { GetEventByIdAPI } from "@/services/EventService";
import AlertMessage from "@/components/project/AlertMessage";
import LoadingSpinner from "@/components/project/LoadingSpinner";
import { format } from "date-fns";
import { MdCategory, MdOutlinePanoramaPhotosphereSelect } from "react-icons/md";
import { Button } from "@/components/ui/button";
import DeleteEvent from "@/components/project/Events/DeleteEvent";
import DelayedPage from "@/components/project/auth/DelayPage";


export default function EventDetailsClient() {
  const { id } = useParams();
  const [showFullscreenSlider, setShowFullscreenSlider] = useState(false);
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["event", id],
    queryFn: () => GetEventByIdAPI(id as string),
  });


  return (
    <DelayedPage delay={2000}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {isError ? (
          <AlertMessage
            type="error"
            message={(error?.message as string) || "Something went wrong"}
          />
        ) : isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Hero Section */}
            <div className="relative mb-10">
              <div className="bg-gradient-to-r from-[#050b2c] to-[#0a1854] rounded-2xl p-6 md:p-8 text-white">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
                  {data?.event?.title}
                </h1>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 text-sm sm:text-base">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#ffa509]" />
                    <span>
                      {format(new Date(data?.event?.date), "MMMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-[#ffa509]" />
                    <span>{data?.event?.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#ffa509]" />
                    <span>{data?.event?.location?.venue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left/Main Section */}
              <div className="lg:col-span-2 space-y-8">
                {/* Image Gallery */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div
                    className="relative cursor-pointer"
                    onClick={() =>
                      data?.event?.images?.length > 1 &&
                      setShowFullscreenSlider(true)
                    }
                  >
                    {data?.event?.images?.length > 1 ? (
                      <Slider {...sliderSettings} className="event-slider">
                        {data?.event?.images?.map(
                          (image: any, index: number) => (
                            <div key={index} className="relative aspect-video">
                              <img
                                src={image.url}
                                alt={`Image ${index + 1}`}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )
                        )}
                      </Slider>
                    ) : (
                      <div className="aspect-video">
                        <img
                          src={data?.event?.images[0]?.url}
                          alt={data?.event?.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Detail Boxes */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-[#050b2c]/5 to-[#0a1854]/5 rounded-xl p-5 text-center">
                      <MdOutlinePanoramaPhotosphereSelect className="text-[#ffa509] text-3xl mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-[#050b2c] mb-1">
                        Event Type
                      </h3>
                      <p className="text-gray-600">{data?.event?.type}</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#050b2c]/5 to-[#0a1854]/5 rounded-xl p-5 text-center">
                      <MdCategory className="text-[#ffa509] text-3xl mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-[#050b2c] mb-1">
                        Category
                      </h3>
                      <p className="text-gray-600">{data?.event?.category}</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#050b2c]/5 to-[#0a1854]/5 rounded-xl p-5 text-center">
                      <FaUsers className="text-[#ffa509] text-3xl mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-[#050b2c] mb-1">
                        Capacity
                      </h3>
                      <p className="text-gray-600">
                        {data?.event?.capacity || "Unlimited"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-gradient-to-r from-[#050b2c]/5 to-[#0a1854]/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FaMoneyBillWave className="text-[#ffa509] text-2xl" />
                        <span className="text-gray-600">Ticket Price</span>
                      </div>
                      <span className="text-xl sm:text-2xl font-bold text-[#ffa509]">
                        ${data?.event?.price?.toLocaleString()}
                      </span>
                    </div>

                    <div className="pt-4 sm:pt-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#050b2c] mb-2 sm:mb-4">
                        About This Event
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        {data?.event?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right/Sidebar Section */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 lg:sticky lg:top-10">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-[#050b2c] mb-2">
                        Get Your Tickets
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Don&apos;t miss out on this amazing event!
                      </p>
                      <button
                        onClick={() =>
                          navigate(
                            `/events/${data?.event?._id}/ticket-purchase`
                          )
                        }
                        className="w-full bg-gradient-to-r from-[#050b2c] to-[#0a1854] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm"
                      >
                        <FaTicketAlt />
                        Book Now
                      </button>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="text-lg font-semibold text-[#050b2c] mb-4">
                        Event Location
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <FaLocationArrow className="text-[#ffa509] mt-1" />
                          <div>
                            <p className="font-medium">
                              {data?.event?.location?.venue}
                            </p>
                            <p className="text-gray-600">
                              {data?.event?.location?.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {data?.event?.organizer === userData?._id && (
                  <div className="bg-white mt-4 space-y-4 border border-gray-200/50 rounded-2xl shadow-lg p-6 hidden lg:block fixed right-8 w-72 z-30">
                    <Button
                      onClick={() =>
                        navigate(`/events/${data?.event?._id}/edit`)
                      }
                      className="w-full bg-[#ffa509] text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      Edit Event
                    </Button>
                    <DeleteEvent
                      id={data?.event?._id as string}
                      addName="Delete Event"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Fullscreen Image Modal */}
            {showFullscreenSlider && (
              <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center px-2 sm:px-4 py-6">
                <button
                  onClick={() => setShowFullscreenSlider(false)}
                  className="absolute top-6 right-6 text-white/90 hover:text-white"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="w-full max-w-5xl">
                  <Slider {...sliderSettings}>
                    {data?.event?.images?.map((image: any, index: number) => (
                      <div key={index} className="relative h-[75vh]">
                        <img
                          src={image.url}
                          alt={`Image ${index + 1}`}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DelayedPage>
  );
}
