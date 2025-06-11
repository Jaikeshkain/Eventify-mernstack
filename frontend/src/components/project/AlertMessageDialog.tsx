import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomAlertMessageDialog({title,description,type,pathname}:{title:string,description:string,type:string,pathname:string}){
  const navigate=useNavigate()
  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className="flex items-center gap-2">
              {type === "success" && (
                <span className="text-green-500 text-xl">✔️</span>
              )}
              {type === "error" && (
                <span className="text-red-500 text-xl">❌</span>
              )}
              {type === "warning" && (
                <span className="text-yellow-500 text-xl">⚠️</span>
              )}
              {type === "pending" && (
                <span className="text-yellow-500 text-xl">⏳</span>
              )}
              {type === "info" && (
                <span className="text-blue-500 text-xl">ℹ️</span>
              )}
              {title}
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              navigate(`${pathname}`);
            }}
            autoFocus
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}