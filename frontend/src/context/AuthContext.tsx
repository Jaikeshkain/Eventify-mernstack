
import { GetUserByIdAPI } from "@/services/UserService";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

//Interface for context
interface AuthContextType{
  token:string|null,
  userData:any,
}
const AuthContext=createContext<AuthContextType>({
  token:null,
  userData:null,
})

export const AuthProvider=({children}:{children:React.ReactNode})=>{
  const reduxUser=useSelector((state:any)=>state.auth.user)
  const [userId,setUserId]=useState<string|null>(null)
  const [token,setToken]=useState<string|null>(null)

  const {data,isError,error} = useQuery({
    queryKey:["user",userId],
    queryFn:()=>GetUserByIdAPI(userId as string),
    enabled:!!userId
  })

  useEffect(()=>{
    if(reduxUser){
      setUserId(reduxUser.id)
      setToken(reduxUser.token)
    }else{
      setUserId(null)
      setToken(null)
    }
  },[reduxUser])


  return(
    <AuthContext.Provider value={{token,userData:data?.user || error?.message}}>
      {children}
    </AuthContext.Provider>
  )
}

// Export hook for using context easily
export const useAuth = () => useContext(AuthContext);