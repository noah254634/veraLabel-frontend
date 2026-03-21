export const taskService={
    getTasks:async():Promise<void>=>{},
    addTask:async():Promise<void>=>{},
    updateTask:async():Promise<void>=>{},
    deleteTask:async(id:string,reason:string):Promise<void>=>{},
    setTaskPriority:async():Promise<void>=>{},
    setTaskStatus:async():Promise<void>=>{},
    reviewTask:async():Promise<void>=>{},
    assignTask:async():Promise<void>=>{},
    unassignTask:async():Promise<void>=>{},
    revokeTask:async():Promise<void>=>{},
    rejectTask:async():Promise<void>=>{},
    approveTask:async():Promise<void>=>{},
}