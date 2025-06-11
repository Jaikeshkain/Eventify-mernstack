import { API_URL } from "./EventService";
import axios from "axios";

const QRPaymentAPI=async(formData:FormData,token:string)=>{
    try {
        const response=await axios.post(`${API_URL}/api/qr/payment`,formData,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return response.data
    } catch (error:any) {
        throw new Error(error.response.data.message)
    }
}

const VerifyQRAPI=async(qrId:string,token:string)=>{
    try {
        const response=await axios.patch(`${API_URL}/api/qr/verify/${qrId}`,token,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return response.data
    } catch (error:any) {
        throw new Error(error.response.data.message)
    }
}

const RejectQRAPI = async (qrId: string, token: string) => {
  try {
    const response = await axios.patch(
      `${API_URL}/api/qr/reject/${qrId}`,
      token,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export { QRPaymentAPI, VerifyQRAPI, RejectQRAPI };