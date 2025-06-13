import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { QRPaymentAPI } from "@/services/QRService";
import LoadingSpinner from "@/components/project/LoadingSpinner";
import CustomAlertMessageDialog from "@/components/project/AlertMessageDialog";
import NotLogin from "@/components/project/auth/NotLogin";

const TicketPaymentQR = () => {
  const { price, quantity, eventName,userId,eventId } = useParams();
  const upiId = "hjoy118181689-1@oksbi";
  const amount = Number(price) * Number(quantity);
  const {token,userData}=useAuth()
  const [loading,setLoading]=useState(false)
  const [alert,setAlert]=useState({title:"",description:"",type:"",pathname:""})
  const upiUrl = `upi://pay?pa=${upiId}&pn=Eventify&am=${amount}&cu=INR&tn=${encodeURIComponent(
    `${eventName} Tickets - uid:${userId}`
  )}`;
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const handleUploadPaymentProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file);
    }
  }

  const mutation=useMutation({
    mutationFn:(formData:FormData)=>QRPaymentAPI(formData,token as string),
    mutationKey:["qr-payment"],
    onMutate:()=>{
        setLoading(true)
    },
    onSuccess:(data:any)=>{
        setLoading(false)
        setAlert({title:"Payment Proof Uploaded",description:data.message,type:"pending",pathname:"/events"})
    },
    onError:(error:any)=>{
        setLoading(false)
        setAlert({title:"Error",description:error.message,type:"error",pathname:"/events"})
    }
  })

  const handleSubmitPaymentProof = () => {
    const formData=new FormData()
    formData.append("qrLink",upiUrl)
    formData.append("userId",userId as string)
    formData.append("eventId",eventId as string)
    formData.append("amount",amount.toString())
    formData.append("quantity",quantity as string)
    formData.append("eventName",eventName as string)
    formData.append("upiId",upiId)
    formData.append("status","pending")
    formData.append("userTxnId",Math.random().toString(36).substring(2, 15))
    formData.append("verifiedAt",new Date().toISOString())
    formData.append("proofImageUrl",paymentProof as File)
    mutation.mutate(formData)
  }
  
  if(loading){
    return <LoadingSpinner/>
  }
  if(alert.title){
    return <CustomAlertMessageDialog title={alert.title} description={alert.description} type={alert.type as "success" | "error" | "pending"} pathname={alert.pathname}/>
  }

  if(!userData){
    return <NotLogin/>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050b2c] to-[#0a1854] px-4 py-12">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center border border-white/10">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Complete Your Payment
        </h1>
        <p className="text-gray-300 mb-6 text-center">
          Scan the QR code below with your UPI app to pay for your tickets to
          <span className="text-[#ffa509] font-semibold"> {eventName}</span>.
        </p>
        <div className="bg-white rounded-xl p-4 shadow-lg mb-4 flex flex-col items-center">
          <QRCode value={upiUrl} size={180} />
          <p className="mt-3 text-gray-700 text-center text-base font-medium">
            Pay <span className="text-[#ffa509] font-bold text-lg">₹{amount}</span> via UPI
          </p>
        </div>
        <div className="w-full flex flex-col items-center mb-4">
          <div className="flex items-center text-gray-300 text-sm mb-1">
            <span className="font-semibold mr-2">Tickets:</span>
            <span className="text-white">{quantity}</span>
          </div>
          <div className="flex items-center text-gray-300 text-sm">
            <span className="font-semibold mr-2">UPI ID:</span>
            <span className="text-white">{upiId}</span>
          </div>
        </div>
        <div className="flex flex-col items-center mt-4">
          {/* <button
            onClick={() => navigate("/events")}
            className="mt-4 bg-[#ffa509] hover:bg-[#ff9100] text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 shadow"
          >
            Back to Events
          </button> */}
          {/* upload payment proof */}
          <div className="flex flex-col items-center mt-4 w-full">
            <label
              htmlFor="payment-proof"
              className="w-full flex flex-col items-center px-4 py-6 bg-white/20 text-white rounded-xl shadow cursor-pointer hover:bg-white/30 transition-all duration-200 border-2 border-dashed border-[#ffa509]"
            >
              <svg
                className="w-10 h-10 text-[#ffa509] mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16v-8m0 0-3.5 3.5M12 8l3.5 3.5M21 16.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2.5M16.5 12.5A5.5 5.5 0 0 0 7.5 12.5"
                />
              </svg>
              <span className="font-semibold text-base">
                Click to upload payment proof
              </span>
              <span className="text-xs text-gray-300 mt-1">
                (JPG, PNG, or PDF)
              </span>
              <input
                id="payment-proof"
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e:any) => handleUploadPaymentProof(e)}
              />
            </label>
            <button
              className="mt-4 w-full bg-[#ffa509] hover:bg-[#ff9100] text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 shadow"
              onClick={handleSubmitPaymentProof}
              disabled={loading}
            >
              Upload Payment Proof
            </button>
          </div>
          {/* payment proof preview */}
          <div className="flex items-center mt-4">
            {paymentProof && (
              <img src={URL.createObjectURL(paymentProof)} alt="Payment Proof" className="w-24 h-24 rounded-lg" />
            )}
          </div>
          <div className="flex items-center text-green-400 mt-6">
            <FaCheckCircle className="mr-2" />
            <span className="text-sm text-white">
              After payment, your ticket will be confirmed!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPaymentQR;