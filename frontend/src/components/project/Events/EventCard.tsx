'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaRegClock, FaLink, FaLocationArrow } from 'react-icons/fa';
import { BiBuildingHouse } from 'react-icons/bi';
import { MdAccessTimeFilled, MdDateRange } from "react-icons/md";
import { format } from 'date-fns';

// Import slick carousel styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function EventCard({ event }: { event: any }) {
  const [showCarousel, setShowCarousel] = useState(false);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <>
      <div className="group relative bg-white rounded-[20px] shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* Image Section */}
        <div
          className="relative cursor-pointer overflow-hidden"
          onClick={() => event.images.length > 1 && setShowCarousel(true)}
        >
          {event.images.length > 1 ? (
            <Slider {...sliderSettings} className="property-slider h-full">
              {event.images.map((image: any, index: number) => (
                <div key={index} className="relative">
                  <img
                    src={image.url}
                    alt={`${event.title} - Image ${index + 1}`}
                    className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <img
              src={event.images[0]?.url}
              alt={event.title}
              className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-110"
            />
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Bottom Info */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1.5 bg-[#050b2c]/95 text-white rounded-full text-sm font-medium flex items-center gap-1.5">
              <BiBuildingHouse className="h-4 w-4" />
              {event.type}
            </span>
            <span className="px-3 py-1.5 bg-[#ffa509]/95 text-white rounded-full text-sm font-medium flex items-center gap-1.5">
              <FaRegClock className="h-4 w-4" />
              New
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Title and Price */}
          <div className="mb-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-xl font-bold text-[#050b2c] line-clamp-1 flex-1">
                {event.title}
              </h3>
              <span className="text-2xl font-bold text-[#ffa509] whitespace-nowrap">
                ${(event.price || 0).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-600 flex items-center text-sm">
              <FaLocationArrow className="mr-1.5 text-[#ffa509]" />
              {event.location.venue}
            </p>
            <p className="text-gray-600 flex items-center text-sm">
              {event.location.address && (
                <>
                  <FaMapMarkerAlt className="mr-1.5 text-[#ffa509]" />
                  <span className="text-[#ffa509] hover:text-[#ffa509]">
                    {event.location.address}
                  </span>
                </>
              )}
            </p>
            <p className="text-gray-600 flex items-center text-sm">
              {event.location.link && (
                <>
                  <FaLink className="mr-1.5 text-[#ffa509]" />
                  <a
                    href={event.location.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ffa509] cursor-pointer underline hover:text-[#ffa509]"
                  >
                    Event Link
                  </a>
                </>
              )}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
            <div className="flex flex-col items-center text-center">
              <FaBed className="h-6 w-6 text-[#ffa509] mb-1" />
              <span className="text-lg font-semibold text-[#050b2c]">
                {event.capacity}
              </span>
              <span className="text-xs text-gray-500">Capacity</span>
            </div>
            <div className="flex flex-col items-center text-center border-x border-gray-100 px-2">
              <MdAccessTimeFilled className="h-6 w-6 text-[#ffa509] mb-1" />
              <span className="text-lg font-semibold text-[#050b2c]">
                {event.time}
              </span>
              <span className="text-xs text-gray-500">Time</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <MdDateRange className="h-6 w-6 text-[#ffa509] mb-1" />
              <span className="text-lg font-semibold text-[#050b2c]">
                {format(new Date(event.date), "MMM d, yyyy")}
              </span>
              <span className="text-xs text-gray-500">Date</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4">
            <Link
              to={`/events/${event._id}`}
              className="w-full bg-gradient-to-r from-[#050b2c] to-[#0a1854] text-white py-3 rounded-xl text-center font-medium hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
            >
              View Details
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Full Screen Carousel Modal */}
      {showCarousel && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowCarousel(false)}
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
              {event.images.map((image: string, index: number) => (
                <div key={index} className="relative h-[75vh]">
                  <img
                    src={image}
                    alt={`${event.title} - Image ${index + 1}`}
                    className="object-contain"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </>
  );
}
