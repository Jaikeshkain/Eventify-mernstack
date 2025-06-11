"use client";

import { useEffect, useState } from "react";
// import Image from "next/image";
import { useNavigate, Link, useParams } from "react-router-dom";
// import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Alert } from "@/components/ui/alert";
import Slider from "react-slick";
import {
  FaBed,
  FaBath,
  FaRuler,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaLocationArrow,
  FaMoneyBillWave,
  FaTicketAlt,
  FaUsers,
} from "react-icons/fa";
import { BiBuildingHouse } from "react-icons/bi";

// Import slick carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DeleteEventAPI, GetEventByIdAPI } from "@/services/EventService";
import AlertMessage from "@/components/project/AlertMessage";
import LoadingSpinner from "@/components/project/LoadingSpinner";
import { format } from "date-fns";
import { MdCategory, MdOutlinePanoramaPhotosphereSelect } from "react-icons/md";
import { Button } from "@/components/ui/button";
import CustomAlertDialog from "@/components/project/AlertDialog";
import CustomAlertMessageDialog from "@/components/project/AlertMessageDialog";
import DeleteEvent from "@/components/project/Events/DeleteEvent";

export default function EventDetailsClient() {
  const { id } = useParams();
  const [showFullscreenSlider, setShowFullscreenSlider] = useState(false);
  const {userData,token}=useAuth()
  const navigate=useNavigate()
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
          arrows: false
        }
      }
    ]
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["event", id],
    queryFn: () => GetEventByIdAPI(id as string)
  });

  const mutation=useMutation({
    mutationFn:(id:string)=>DeleteEventAPI(id,token as string),
    mutationKey:["delete-event",id],
  })

  const handleDeleteEvent = () => {
    mutation.mutateAsync(data?.event?._id).then(()=>{
      <CustomAlertMessageDialog title="Event deleted successfully" description="Event deleted successfully" type="success" pathname="/events"/>
    }).catch((error:any)=>{
      <CustomAlertMessageDialog title="Error" description={error?.message} type="error" pathname="/events"/>
    }).finally(()=>{
      navigate("/events")
    })
  };

  return (

    
    <div className="max-w-7xl mx-auto px-4 py-8">
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
          <div className="relative mb-12">
            <div className="bg-gradient-to-r from-[#050b2c] to-[#0a1854] rounded-3xl p-8 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {data?.event?.title}
              </h1>
              <div className="flex flex-wrap gap-6">
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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <div
                  className="relative cursor-pointer"
                  onClick={() => data?.event?.images?.length > 1 && setShowFullscreenSlider(true)}
                >
                  {data?.event?.images?.length > 1 ? (
                  <Slider {...sliderSettings} className="event-slider">
                    {data?.event?.images?.map((image: any, index: number) => (
                      <div key={index} className="relative aspect-[16/9]">
                        <img
                          src={image.url}
                          alt={`${data?.event?.title} - Image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </Slider>
                  ) : (
                    <img
                      src={data?.event?.images[0]?.url}
                      alt={data?.event?.title}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
              </div>

              {/* Event Details */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-[#050b2c]/5 to-[#0a1854]/5 rounded-2xl p-6 text-center">
                    <MdOutlinePanoramaPhotosphereSelect className="text-[#ffa509] text-3xl mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-[#050b2c] mb-1">
                      Event Type
                    </h3>
                    <p className="text-gray-600">{data?.event?.type}</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#050b2c]/5 to-[#0a1854]/5 rounded-2xl p-6 text-center">
                    <MdCategory className="text-[#ffa509] text-3xl mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-[#050b2c] mb-1">
                      Category
                    </h3>
                    <p className="text-gray-600">{data?.event?.category}</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#050b2c]/5 to-[#0a1854]/5 rounded-2xl p-6 text-center">
                    <FaUsers className="text-[#ffa509] text-3xl mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-[#050b2c] mb-1">
                      Capacity
                    </h3>
                    <p className="text-gray-600">
                      {data?.event?.capacity || "Unlimited"}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#050b2c]/5 to-[#0a1854]/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FaMoneyBillWave className="text-[#ffa509] text-2xl" />
                      <span className="text-gray-600">Ticket Price</span>
                    </div>
                    <span className="text-2xl font-bold text-[#ffa509]">
                      ${data?.event?.price?.toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-6">
                    <h3 className="text-2xl font-bold text-[#050b2c] mb-4">
                      About This Event
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {data?.event?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-10">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-[#050b2c] mb-2">
                      Get Your Tickets
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Don't miss out on this amazing event!
                    </p>
                    <button onClick={()=>navigate(`/events/${data?.event?._id}/ticket-purchase`)} className="w-full bg-gradient-to-r from-[#050b2c] to-[#0a1854] text-white py-4 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
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
                <div className="bg-white mt-4 space-y-4 border border-gray-200/50 gap-4 rounded-3xl shadow-lg p-6 fixed">
                  <Button onClick={()=>navigate(`/events/${data?.event?._id}/edit`)} className="w-full bg-gradient-to-r from-[#ffa509] to-[#ffa509] text-white py-4 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    Edit Event
                  </Button>
                  <DeleteEvent id={data?.event?._id as string} addName="Delete Event"/>
                </div>
              )}
            </div>
          </div>

          {/* Fullscreen Image Modal */}
          {showFullscreenSlider && (
            <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
              <button
                onClick={() => setShowFullscreenSlider(false)}
                className="absolute top-6 right-6 text-white/90 hover:text-white transition-colors"
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
                <Slider {...sliderSettings} className="full-screen-slider">
                  {data?.event?.images?.map((image: any, index: number) => (
                    <div key={index} className="relative h-[75vh]">
                      <img
                        src={image.url}
                        alt={`${data?.event?.title} - Image ${index + 1}`}
                        className="object-contain"
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
  );
}
