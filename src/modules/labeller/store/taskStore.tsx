import type { Task } from "../types/task"
import { taskService } from "../services/taskService"
import toast from "react-hot-toast";
import { create } from "zustand";
type TaskStore = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  getTasks: () => Promise<Task[]>;
  tasksDone: () => Promise<string>;
  tasksPending: () => Promise<string>;
  tasksInProgress: () => Promise<string>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string,reason:string) => Promise<void>;
  clearError: () => void;
  resetStore: () => void;
  setTaskPriority: (id: string, priority: Task["priority"]) => Promise<void>;
  setTaskStatus: (id: string, status: Task["status"]) => Promise<void>;
  reviewTask: (id: string, reviewStatus: Task["reviewStatus"]) => Promise<void>;
  assignTask: (id: string, assignedTo: string) => Promise<void>;
  unassignTask: (id: string) => Promise<void>;
  revokeTask: (id: string) => Promise<void>;
  approveTask: (id: string) => Promise<void>;
  rejectTask: (id: string) => Promise<void>;
  
};
export const useTaskStore = create<TaskStore>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  getTasks: async () => [],
  tasksDone: async () => "0",
  tasksPending: async () => "0",
  tasksInProgress: async () => {
    try {
        set({loading:true})
        set({error:null})
        const response = await taskService.getTasks() as unknown as Task[];
        const tasks = response || [];
        set({loading:false, tasks: tasks})
        return tasks.length.toString()
    } catch (err) {
        set({loading:false})
        const errorMessage = err instanceof Error ? err.message : "Something went wrong";
        toast.error(errorMessage);
    }
  },
  addTask: async (task) => {},
  updateTask: async (id, updates) => {},
  deleteTask: async (id,reason) => {
    try{
        set({loading:true})
        set({error:null})
        const response=await taskService.deleteTask(id,reason)
        set({loading:false})
    }catch(err){
        const erroeMessage=err instanceof Error?err.message:"Something went wrong"
        toast.error(erroeMessage)
    }
  },
  clearError: () => set({ error: null }),
  resetStore: () => set({ loading: false, error: null, tasks: [] }),
  setTaskPriority: async (id, priority) => {},
  setTaskStatus: async (id, status) => {},
  reviewTask: async (id, reviewStatus) => {},
  assignTask: async (id, assignedTo) => {},
  unassignTask: async (id) => {},
  revokeTask: async (id) => {},
  rejectTask: async (id) => {},
  approveTask: async (id) => {},
}));
