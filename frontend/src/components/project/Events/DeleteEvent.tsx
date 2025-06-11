import { useAuth } from "@/context/AuthContext"
import { DeleteEventAPI } from "@/services/EventService"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import LoadingSpinner from "../LoadingSpinner"
import CustomAlertMessageDialog from "../AlertMessageDialog"
import CustomAlertDialog from "../AlertDialog"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const DeleteEvent=({id,addName}:{id:string,addName:string})=>{
    const {token}=useAuth()
    const [alert,setAlert]=useState({title:"",description:"",type:""})
    const mutation=useMutation({
        mutationFn:(id:string)=>DeleteEventAPI(id,token as string),
        onMutate:()=>{
            return <LoadingSpinner/>
        },
        onSuccess:(data:any)=>{
            setAlert({title:"Success",description:data.message,type:"success"})
        },
        onError:(error:any)=>{
            setAlert({title:"Error",description:error.message,type:"error"})
        }
    })
    const handleDelete=()=>{
        mutation.mutate(id)
    }

    if(alert.title){
        return <CustomAlertMessageDialog title={alert.title} description={alert.description} type={alert.type} pathname="/dashboard/organizer/events"/>
    }
    return (
        <div>
            <CustomAlertDialog
                title="Delete Event"
                description="Are you sure you want to delete this event?"
                onConfirm={() => { handleDelete() }}
                onCancel={() => { }}
                trigger={
                    addName ? (
                        <Button
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4" />
                            {addName}
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            className="hover:text-red-500  hover:bg-red-500/10 cursor-pointer"
                            size="icon"
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    )
                }
            />
        </div>
    )
}

export default DeleteEvent;