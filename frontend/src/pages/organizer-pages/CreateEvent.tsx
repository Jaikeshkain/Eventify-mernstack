import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaHome, FaLink, FaLocationArrow, FaMoneyBillWave, FaTimes, FaUpload } from 'react-icons/fa';
import { MdTitle, MdDescription, MdAccessTimeFilled, MdOutlineGroups3, MdCategory, MdOutlinePanoramaPhotosphereSelect, MdDateRange, MdMyLocation, MdOutlineSave } from 'react-icons/md';
import { useMutation } from '@tanstack/react-query';
import { CreateEventAPI } from '@/services/EventService';
import NotAdmin from '@/components/project/auth/NotAdmin';
import NotLogin from '@/components/project/auth/NotLogin';
import { SiEventbrite } from 'react-icons/si';
import CustomAlertMessageDialog from '@/components/project/AlertMessageDialog';

export default function CreateEvent() {

  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [alert,setAlert]=useState({title:"",description:"",type:"",pathname:""})
  const {userData,token}=useAuth()

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: {
      start: "",
      time: "",
    },
    location: {
      venue: "",
      address: "",
      link: "",
    },
    category: "",
    tags: "",
    images: [] as File[],
    type: "in-person",
    price: 0,
    capacity: 0,
  });

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => CreateEventAPI(formData,token as string),
    mutationKey: ['create-event'],
    onMutate:()=>{
      setLoading(true)
    },
    onSuccess:(data:any)=>{
      setLoading(false)
      setAlert({title:"Success",description:data.message,type:"success",pathname:"/events"})
    },
    onError:(error:any)=>{
      setLoading(false)
      setAlert({title:"Error",description:error.message,type:"error",pathname:"/events"})
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArr = Array.from(files);
      setEventData(prev => ({
        ...prev,
        images: fileArr as never[]
      }));
      const previews = fileArr.map(image => URL.createObjectURL(image));
      setPreviewUrls(previews as never[]);
    } else {
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previewUrls];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };
  
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  //status logic
  const formData = new FormData();
  formData.append('title', eventData.title);
  formData.append('description', eventData.description);
  formData.append('date', eventData.date.start);
  formData.append('time', eventData.date.time);
  eventData.images.forEach((image: File)=>{
    formData.append('images', image);
  })
  formData.append('category', eventData.category);
  formData.append('tags', eventData.tags);
  formData.append('type', eventData.type);
  formData.append('price', eventData.price.toString());
  formData.append('capacity', eventData.capacity.toString());
  formData.append('venue', eventData.location.venue);
  formData.append('address', eventData.location.address);
  formData.append('link', eventData.location.link);
  formData.append('status', "live");
  mutation.mutateAsync(formData)
};

const handleDraft = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  setLoading(true);

  //status logic
  const formData = new FormData();
  formData.append("title", eventData.title);
  formData.append("description", eventData.description);
  formData.append("date", eventData.date.start);
  formData.append("time", eventData.date.time);
  eventData.images.forEach((image: File) => {
    formData.append("images", image);
  });
  formData.append("category", eventData.category);
  formData.append("tags", eventData.tags);
  formData.append("type", eventData.type);
  formData.append("price", eventData.price.toString());
  formData.append("capacity", eventData.capacity.toString());
  formData.append("venue", eventData.location.venue);
  formData.append("address", eventData.location.address);
  formData.append("link", eventData.location.link);
  formData.append("status", "draft");
  mutation.mutateAsync(formData)
};


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement |HTMLSelectElement> ) => {
      const { name, value } = e.target;
      if(name.includes('.')){
        const [parent, child] = name.split('.');
        setEventData(prev => ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof typeof prev] as Record<string, any>),
            [child]: value
          }
        }));
      } else {
        setEventData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    };



  // const sampleProperties = {
  //   luxury: {
  //     title: 'Luxury Beachfront Villa',
  //     description: 'Beautiful beachfront villa with stunning ocean views. This modern property features high-end finishes, an infinity pool, and direct beach access. Perfect for those seeking a luxurious coastal lifestyle.',
  //     price: '1250000',
  //     location: 'Miami Beach, Florida',
  //     propertyType: 'House',
  //     features: {
  //       bedrooms: '4',
  //       bathrooms: '3.5',
  //       area: '3500',
  //       parking: true,
  //       furnished: true,
  //     },
  //     images: ['https://placehold.co/800x600/e2e8f0/1e293b.png?text=Luxury+Villa'],
  //     status: 'For Sale',
  //     address: {
  //       street: '123 Ocean Drive',
  //       city: 'Miami Beach',
  //       state: 'Florida',
  //       zipCode: '33139',
  //       country: 'United States',
  //     },
  //   },
  //   apartment: {
  //     title: 'Modern Downtown Apartment',
  //     description: 'Stylish urban apartment in the heart of downtown. Features modern amenities, open-concept living space, and spectacular city views. Walking distance to restaurants, shops, and public transit.',
  //     price: '450000',
  //     location: 'Downtown Chicago',
  //     propertyType: 'Apartment',
  //     features: {
  //       bedrooms: '2',
  //       bathrooms: '2',
  //       area: '1200',
  //       parking: true,
  //       furnished: false,
  //     },
  //     images: ['https://placehold.co/800x600/e2e8f0/1e293b.png?text=Modern+Apartment'],
  //     status: 'For Sale',
  //     address: {
  //       street: '456 City Center Ave',
  //       city: 'Chicago',
  //       state: 'Illinois',
  //       zipCode: '60601',
  //       country: 'United States',
  //     },
  //   },
  //   commercial: {
  //     title: 'Prime Retail Space',
  //     description: 'Prime commercial retail space in a high-traffic shopping district. Features large display windows, storage area, and modern utilities. Excellent opportunity for retail or restaurant business.',
  //     price: '850000',
  //     location: 'Seattle Business District',
  //     propertyType: 'Commercial',
  //     features: {
  //       bedrooms: '0',
  //       bathrooms: '2',
  //       area: '2500',
  //       parking: true,
  //       furnished: false,
  //     },
  //     images: ['https://placehold.co/800x600/e2e8f0/1e293b.png?text=Commercial+Space'],
  //     status: 'For Sale',
  //     address: {
  //       street: '789 Business Ave',
  //       city: 'Seattle',
  //       state: 'Washington',
  //       zipCode: '98101',
  //       country: 'United States',
  //     },
  //   },
  // };

    if(!userData){
    return <NotLogin/>
  }

  if(userData?.role!=="organizer"){
    return(
      <NotAdmin/>
    )
  }

  if(alert.title){
    return <CustomAlertMessageDialog title={alert.title} description={alert.description} type={alert.type} pathname={alert.pathname}/>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050b2c] to-[#0a1854] py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <SiEventbrite className="mr-3 text-[#ffa509]" />
            Add New Event
          </h1>
          <p className="text-gray-300">
            Fill in the details below to list your event
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {mutation.isError && (
            <div className="bg-red-900/50 border-l-4 border-red-500 p-4 rounded-xl backdrop-blur-lg">
              <p className="text-red-200">{mutation.error.message}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <MdTitle className="mr-2 text-[#ffa509]" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <MdTitle className="mr-2 text-[#ffa509]" />
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-white/5 border-2 border-[#ffa509]/20 text-white px-4 py-3 focus:outline-none focus:border-[#ffa509] transition-colors placeholder-gray-500"
                  placeholder="Enter property title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <MdCategory className="mr-2 text-[#ffa509]" />
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={eventData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-white/5 border-2 border-[#ffa509]/20 text-white px-4 py-3 focus:outline-none focus:border-[#ffa509] transition-colors placeholder-gray-500"
                  placeholder="Enter property category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <MdDescription className="mr-2 text-[#ffa509]" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full rounded-xl bg-white/5 border-2 border-[#ffa509]/20 text-white px-4 py-3 focus:outline-none focus:border-[#ffa509] transition-colors placeholder-gray-500"
                  placeholder="Describe your property"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-[#ffa509]" />
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={eventData.price}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-white/5 border-2 border-[#ffa509]/20 text-white px-4 py-3 focus:outline-none focus:border-[#ffa509] transition-colors placeholder-gray-500"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <MdOutlineGroups3 className="mr-2 text-[#ffa509]" />
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={eventData.capacity}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-white/5 border-2 border-[#ffa509]/20 text-white px-4 py-3 focus:outline-none focus:border-[#ffa509] transition-colors placeholder-gray-500"
                  placeholder="Enter capacity"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FaHome className="mr-2 text-[#ffa509]" />
              Event Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <MdOutlinePanoramaPhotosphereSelect className="mr-2 text-[#ffa509]" />
                  Event Type
                </label>
                <select
                  name="type"
                  value={eventData.type}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-white/5 border-2 border-[#ffa509]/20 text-white px-4 py-3 focus:outline-none focus:border-[#ffa509] transition-colors"
                >
                  <option className="text-black" value="virtual">
                    Virtual
                  </option>
                  <option className="text-black" value="in-person">
                    In-Person
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <MdDateRange className="mr-2 text-[#ffa509]" />
                  Event Date
                </label>
                <input
                  type="date"
                  name="date.start"
                  value={eventData.date.start}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-white/5 border-2 border-[#ffa509]/20 text-white px-4 py-3 focus:outline-none focus:border-[#ffa509] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Event Location */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FaHome className="mr-2 text-[#ffa509]" />
              Event Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <FaLocationArrow className="mr-2 text-[#ffa509]" />
                  Event Venue
                </label>
                <input
                  type="text"
                  name="location.venue"
                  value={eventData.location.venue}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/5 border-2 border-[#ffa509]/20 text-white px-4 py-3 focus:outline-none focus:border-[#ffa509] transition-colors"
                />
              </div>

              {eventData.type === "in-person" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <MdMyLocation className="mr-2 text-[#ffa509]" />
                    Event Address
                  </label>
                  <input
                    type="text"
                    name="location.address"
                    value={eventData.location.address}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-white/5 border-2 border-[#ffa509]/20 text-white px-4 py-3 focus:outline-none focus:border-[#ffa509] transition-colors"
                  />
                </div>
              )}
              {eventData.type === "virtual" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <FaLink className="mr-2 text-[#ffa509]" />
                    Event Link
                  </label>
                  <input
                    type="text"
                    name="location.link"
                    value={eventData.location.link}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-white/5 border-2 border-[#ffa509]/20 text-white px-4 py-3 focus:outline-none focus:border-[#ffa509] transition-colors"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <MdAccessTimeFilled className="mr-2 text-[#ffa509]" />
                  Event Time
                </label>
                <input
                  type="time"
                  name="date.time"
                  value={eventData.date.time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-white/5 border-2 border-[#ffa509]/20 text-white px-4 py-3 focus:outline-none focus:border-[#ffa509] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FaUpload className="mr-2 text-[#ffa509]" />
              Event Images
            </h2>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#ffa509]/20 border-dashed rounded-xl bg-white/5">
              <div className="space-y-2 text-center">
                <FaUpload className="mx-auto h-12 w-12 text-[#ffa509]" />
                <div className="flex text-sm text-gray-300">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-xl bg-[#ffa509] px-4 py-2 text-[#050b2c] font-bold hover:bg-[#ff9100] transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-[#ffa509] focus-within:ring-offset-2"
                  >
                    <span>Select images</span>
                    <input
                      id="file-upload"
                      name="images" // <-- must be exactly "file"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={loading}
                    />
                  </label>
                  <p className="pl-3 pt-2">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>

            {/* Preview selected images */}
            {previewUrls.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Selected image ${index + 1}`}
                      width={200}
                      height={150}
                      className="object-cover rounded-xl border-2 border-[#ffa509]/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {loading && (
              <div className="mt-4 text-sm text-[#ffa509] flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading images...
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 justify-end">
            <button
              type="submit"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
              }}
              className="px-8 py-4 bg-[#ffa509] text-[#050b2c] rounded-xl font-bold hover:bg-[#ff9100] transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaHome className="text-lg" />
              {loading ? "Creating Event..." : "Create Event"}
            </button>
            <button
              type="button"
              onClick={handleDraft}
              className="px-8 py-4 bg-[#ffa509] text-[#050b2c] rounded-xl font-bold hover:bg-[#ff9100] transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdOutlineSave className="text-lg" />
              Save as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

