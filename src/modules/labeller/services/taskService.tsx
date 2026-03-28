import type{ Task } from "../types/task"
import { api } from "../../../shared/types/api"
export const taskService={
    getTasks:async():Promise<Task[]>=>{
        const response=await api.get("/tasks")
        const payload = response.data
        if (Array.isArray(payload?.items)) return payload.items
        if (Array.isArray(payload?.tasks)) return payload.tasks
        if (Array.isArray(payload)) return payload
        return []
    },
    addTask:async():Promise<void>=>{},
    updateTask:async():Promise<void>=>{
        const response=await api.put("/tasks")
        return response.data
    },
    deleteTask:async(id:string,reason:string):Promise<void>=>{
        const response=await api.delete(`/tasks/${id}`,{data:{reason}})
        return response.data
    },
    clearError:():void=>{},
    resetStore:():void=>{}, 
    setTaskPriority:async(priority:Task["priority"]):Promise<void>=>{
        const response=await api.put("/tasks/priority",{priority})
        return response.data
    },
    setTaskStatus:async(status:Task["status"]):Promise<void>=>{
        const response=await api.put("/tasks/status",{status})
        return response.data
    },
    reviewTask:async(rating:number,comment:string):Promise<void>=>{
        const response=await api.put("/tasks/review",{rating,comment})
        return response.data
    },
    assignTask:async(taskId:string,assignedTo:string):Promise<void>=>{
        const response=await api.put(`/tasks/${taskId}/assign`,{assignedTo})
        return response.data
    },
    unassignTask:async(taskId:string):Promise<void>=>{
        const response=await api.put(`/tasks/${taskId}/unassign`)
        return response.data
    },
    revokeTask:async(taskId:string):Promise<void>=>{
        const response=await api.put(`/tasks/${taskId}/revoke`)
        return response.data
    },
    rejectTask:async(taskId:string):Promise<void>=>{
        const response=await api.put(`/tasks/${taskId}/reject`)
        return response.data
    },
    approveTask:async(taskId:string):Promise<void>=>{
        const response=await api.put(`/tasks/${taskId}/approve`)
        return response.data
    },
}