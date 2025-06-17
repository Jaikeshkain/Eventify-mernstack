import { FaHome, FaLink, FaLocationArrow, FaMoneyBillWave, FaTimes, FaUpload } from "react-icons/fa";
import { MdAccessTimeFilled, MdCategory, MdDateRange, MdDescription, MdMyLocation, MdOutlineGroups3, MdOutlinePanoramaPhotosphereSelect, MdTitle } from "react-icons/md";
import { SiEventbrite } from "react-icons/si";
import { Button } from "@/components/ui/button";
import CustomAlertDialog from "@/components/project/AlertDialog";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EditEventAPI, EditEventImagesAPI, GetEventByIdAPI } from "@/services/EventService";
import CustomAlertMessageDialog from "@/components/project/AlertMessageDialog";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/project/LoadingSpinner";
import DeleteEvent from "@/components/project/Events/DeleteEvent";
import NotAdmin from "@/components/project/auth/NotAdmin";

const EditEvent = () => {

  const {id}=useParams()
const [existingImages, setExistingImages] = useState<any[]>([]);
const [newImages, setNewImages] = useState<File[]>([]);
const [previewUrls, setPreviewUrls] = useState<string[]>([]);

const [isLoadingData,setIsLoadingData]=useState(false)
const [alert,setAlert]=useState({title:"",description:"",type:"",pathname:""})


  const [eventData, setEventData] = useState({
    title: "",
    subtitle:"",
    category: "",
    description: "",
    price: "",
    capacity: "",
    type: "",
    date: "",
    time: "",
    location: {
      venue: "",
      address: "",
      link: "",
    },
  });

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setEventData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    } else {
      setEventData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const {data,isError,error,isLoading}=useQuery({
    queryKey:["event-id",id],
    queryFn:()=>GetEventByIdAPI(id as string),
    
  })

  useEffect(()=>{
    if(isLoading){
      setIsLoadingData(true)
    }
    if(isError){
      setIsLoadingData(false)
      setAlert({title:"Error",description:error.message,type:"error",pathname:"/dashboard/organizer/events"})
    }
    if(data?.event){
      setIsLoadingData(false)
      setEventData({
        title:data.event.title,
        subtitle:data.event.subtitle,
        category:data.event.category,
        description:data.event.description,
        price:data.event.price,
        capacity:data.event.capacity,
        type:data.event.type,
        date:data.event.date.split("T")[0],
        time:data.event.time,
        location:{
          venue:data.event.location.venue,
          address:data.event.location.address,
          link:data.event.location.link,
        }
      })
      setExistingImages(data.event.images);
    }
  },[data,isLoading,isError,error])

  //Edit event Logic
  const mutationEditEvent=useMutation({
    mutationFn:({id,body}:{id:string,body:any})=>EditEventAPI(id,token as string,body),
    mutationKey:["edit-event",id],
    onMutate:()=>{
      setIsLoadingData(true)
    },
    onSuccess:(data:any)=>{
      setIsLoadingData(false)
      setAlert({title:"Success",description:data.message,type:"success",pathname:"/dashboard/organizer/events"})
    },
    onError:(error:any)=>{
      setIsLoadingData(false)
      setAlert({title:"Error",description:error.message,type:"error",pathname:"/dashboard/organizer/events"})
    }
  })

  //Edit event submit
  const handleEditEventSubmit=()=>{
    if(!id) return
    mutationEditEvent.mutate({id,body:eventData})
  }
  
  //Image upload Logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);

  };

  //Remove existing image
  const removeExistingImage = (index: number) => {
  const updated = [...existingImages];
  updated.splice(index, 1);
  setExistingImages(updated);
  };

  //Remove new image
  const removeNewImage = (index: number) => {
  const updatedFiles = [...newImages];
  updatedFiles.splice(index, 1);

  const updatedPreviews = [...previewUrls];
  updatedPreviews.splice(index, 1);

  setNewImages(updatedFiles);
  setPreviewUrls(updatedPreviews);
  };

  const {token,userData}=useAuth()

  const mutation = useMutation({
    mutationFn: ({
      id,
      newImages,
      keepImages,
    }: {
      id: string;
      newImages: File[];
      keepImages: string[];
    }) => EditEventImagesAPI({id, token: token as string, newImages,keepImages}),
    mutationKey:["edit-event-images",id],
    onMutate:()=>{
      setIsLoadingData(true)
    },
    onSuccess:(data:any)=>{
      setIsLoadingData(false)
      setAlert({title:"Success",description:data.message,type:"success",pathname:"/dashboard/organizer/events"})
    },
    onError:(error:any)=>{
      setIsLoadingData(false)
      setAlert({title:"Error",description:error.message,type:"error",pathname:"/dashboard/organizer/events"})
    }
  });

  //Image submit
  const handleImageSubmit = () => {
    if (!id) return;

    const keepImages = existingImages.map((img) => img.publicId);
    mutation.mutate({
      id,
      newImages,
      keepImages,
    })
  };

  if(isLoadingData){
    return <LoadingSpinner/>
  }
  if(alert.title){
    return <CustomAlertMessageDialog title={alert.title} description={alert.description} type={alert.type} pathname={alert.pathname}/>
  }

    if (userData?.role !== "organizer") {
      return <NotAdmin/>;
    }
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050b2c] to-[#0a1854] py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <SiEventbrite className="mr-3 text-[#ffa509]" />
            Edit Existing Event
          </h1>
          <p className="text-gray-300">
            Edit the details below to update your event
          </p>
        </div>

        <form className="max-w-4xl mx-auto space-y-8">
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
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <MdTitle className="mr-2 text-[#ffa509]" />
                  Sub Title
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={eventData.subtitle}
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
                <select
                  name="category"
                  value={eventData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-white/5 border-2 border-[#ffa509]/20 text-white px-4 py-3 focus:outline-none focus:border-[#ffa509] transition-colors"
                >
                  <option className="text-black" value="Music">
                    Music
                  </option>
                  <option className="text-black" value="Game">
                    Game
                  </option>
                  <option className="text-black" value="Launch Event">
                    Launch Event
                  </option>
                  <option className="text-black" value="Technology">
                    Technology
                  </option>
                  <option className="text-black" value="Art">
                    Art
                  </option>
                  <option className="text-black" value="Sports">
                    Sports
                  </option>
                  <option className="text-black" value="Food">
                    Food
                  </option>
                  <option className="text-black" value="Business">
                    Business
                  </option>
                  <option className="text-black" value="Education">
                    Education
                  </option>
                </select>
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
                  placeholder="Describe your event"
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

          {/* Event Details */}
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
                  name="date"
                  value={eventData.date}
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
                  name="time"
                  value={eventData.time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-white/5 border-2 border-[#ffa509]/20 text-white px-4 py-3 focus:outline-none focus:border-[#ffa509] transition-colors"
                />
              </div>
            </div>
            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end">
              <DeleteEvent id={id as string} addName="Delete Event" />

              <CustomAlertDialog
                title="Are you sure you want to update event?"
                description="This action cannot be undone."
                onConfirm={() => {
                  handleEditEventSubmit();
                }}
                onCancel={() => {}}
                trigger={
                  <Button className="px-8 py-4 bg-[#ffa509] text-[#050b2c] rounded-xl font-bold hover:bg-[#ff9100] transition-all duration-300 flex items-center gap-2">
                    Update Event
                  </Button>
                }
              />
            </div>
          </div>
        </form>
        {/* Image Upload Section */}
        <form className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white/10 border-2 border-[#ffa509]/20 backdrop-blur-lg mt-8 rounded-2xl p-8">
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
                      name="images"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
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
            {existingImages.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {existingImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url.url}
                      alt={`Selected image ${index + 1}`}
                      width={200}
                      height={150}
                      className="object-cover rounded-xl border-2 border-[#ffa509]/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Submit Buttons */}
            <div className="flex gap-4 justify-end">
              <CustomAlertDialog
                title="Are you sure you want to update images?"
                description="This action cannot be undone."
                onConfirm={() => {
                  handleImageSubmit();
                }}
                onCancel={() => {}}
                trigger={
                  <Button className="px-8 py-4 bg-[#ffa509] text-[#050b2c] rounded-xl font-bold hover:bg-[#ff9100] transition-all duration-300 flex items-center gap-2">
                    Update Images
                  </Button>
                }
              />
              <Button className="px-8 py-4 bg-[#ffa509] text-[#050b2c] rounded-xl font-bold hover:bg-[#ff9100] transition-all duration-300 flex items-center gap-2">
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;