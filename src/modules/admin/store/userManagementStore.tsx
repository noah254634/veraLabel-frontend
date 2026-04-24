import { create } from "zustand";
import type { User } from "../../../shared/types/user";
import { UserService } from "../services/userService";
import toast from "react-hot-toast";
type AdminStore = {
  users: User[];
  isAuthenticated: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  getUsers: () => Promise<User[] | void>;
  setUsers: (users: User[]) => void;
  promoteUser: (id: string, reason: string) => Promise<void>;
  promoteToReviewer: (id: string, reason: string) => Promise<void>;
  demoteUser: (id: string, reason: string) => Promise<void>;
  deleteUser: (id: string, reason: string) => void;
  updateUser: () => void;
  addUser: () => void;
  verifyUser: (id: string, reason: string) => void;
  unverifyUser: (id: string, reason: string) => void;
  blockUser: (id: string, reason: string) => void;
  unblockUser: (id: string, reason: string) => void;
  suspendUser: (id: string, reason: string) => void;
  unsuspendUser: (id: string, reason: string) => void;
  getUserById: (id: string) => void;
  getUserByEmail: (email: string) => void;
  getUserByUsername: (username: string) => void;
  getUserByRole: (role: string) => void;
  getUserByStatus: (status: string) => void;
  getUserByCountry: (country: string) => void;
  getUserByCity: (city: string) => void;
  rateUser: (id: string, rate: number) => void;
};
const useStore = create<AdminStore>((set, get) => ({
  error: null,
  setError: (error: string | null) => set({ error }),
  isAuthenticated: false,
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  users: [],
  setUsers: (users: User[]) => set({ users }),

  getUsers: async () => {
    try {
      set({ loading: true });
      const response = await UserService.fetchUsers();
      if (!response) return;
      const users = response;
      set({ users });
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  promoteUser: async (id: string, reason: string) => {
    const previousUser = get().users.find((user) => user._id === id);
    try {
      set({ loading: true });
      const response = await UserService.promoteUser(id, reason);
      const updatedUser = response?.user || response;
      if (updatedUser?._id) {
        set({
          users: get().users.map((user) =>
            user._id === id ? { ...user, ...updatedUser } : user,
          ),
        });
      } else {
        set({
          users: get().users.map((user) =>
            user._id === id ? { ...user, role: "admin" } : user,
          ),
        });
      }
      toast.success("User promoted successfully");
      return;
    } catch (error) {
      console.log(error);
      if (previousUser) {
        set({
          users: get().users.map((user) =>
            user._id === id ? previousUser : user,
          ),
        });
      }
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  promoteToReviewer: async (id: string, reason: string) => {
    const previousUser = get().users.find((user) => user._id === id);
    try {
      set({ loading: true });
      const response = await UserService.promoteToReviewer(id, reason);
      const updatedUser = response?.user || response;
      if (updatedUser?._id) {
        set({
          users: get().users.map((user) =>
            user._id === id ? { ...user, ...updatedUser } : user,
          ),
        });
      } else {
        set({
          users: get().users.map((user) =>
            user._id === id ? { ...user, role: "reviewer" } : user,
          ),
        });
      }
      toast.success("User promoted to reviewer successfully");
      return;
    } catch (error) {
      console.log(error);
      if (previousUser) {
        set({
          users: get().users.map((user) =>
            user._id === id ? previousUser : user,
          ),
        });
      }
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  demoteUser: async (id: string, reason: string) => {
    const previousUser = get().users.find((user) => user._id === id);
    try {
      set({ loading: true });
      const response = await UserService.demoteUser(id, reason);
      const updatedUser = response?.user || response;
      if (updatedUser?._id) {
        set({
          users: get().users.map((user) =>
            user._id === id ? { ...user, ...updatedUser } : user,
          ),
        });
      } else {
        set({
          users: get().users.map((user) =>
            user._id === id ? { ...user, role: "labeler" } : user,
          ),
        });
      }
      toast.success("User demoted successfully");
      return;
    } catch (error) {
      if (previousUser) {
        set({
          users: get().users.map((user) =>
            user._id === id ? previousUser : user,
          ),
        });
      }
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  deleteUser: async (id: string, reason: string) => {
    try {
      set({ loading: true });
      await UserService.deleteUser(id, reason);
      set({ loading: false });
      toast.success("User deleted successfully");
      return;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "somthing went wrong";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  updateUser: async () => {},
  addUser: async () => {},
  verifyUser: async (id, reason) => {
    const previousUser = get().users.find((user) => user._id === id);
    set({
      users: get().users.map((user) =>
        user._id === id ? { ...user, isVerified: true } : user,
      ),
    });
    try {
      set({ loading: true });
      const response = await UserService.verifyUser(id, reason);
      const updatedUser = response?.user || response;
      if (updatedUser?._id) {
        set({
          users: get().users.map((user) =>
            user._id === id ? { ...user, ...updatedUser } : user,
          ),
        });
      }
      toast.success("User verified successfully");
      return;
    } catch (error) {
      if (previousUser) {
        set({
          users: get().users.map((user) =>
            user._id === id ? previousUser : user,
          ),
        });
      }
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  unverifyUser: async (id: string, reason: string) => {
    const previousUser = get().users.find((user) => user._id === id);
    set({
      users: get().users.map((user) =>
        user._id === id ? { ...user, isVerified: false } : user,
      ),
    });
    try {
      set({ loading: true });
      const response = await UserService.unverifyUser(id,reason) as any;
      const updatedUser = response?.user || response;
      if (updatedUser?._id) {
        set({
          users: get().users.map((user) =>
            user._id === id ? { ...user, ...updatedUser } : user,
          ),
        });
      }
      toast.success("User unverified successfully");
      return;
    } catch (error) {
      if (previousUser) {
        set({
          users: get().users.map((user) =>
            user._id === id ? previousUser : user,
          ),
        });
      }
      const errorMessage=error instanceof Error?error.message:"Something went wrong"
      toast.error(errorMessage)
    } finally {
      set({ loading: false });
    }
  },
  blockUser: async (id: string, reason: string) => {
    const previousUser = get().users.find((user) => user._id === id);
    const safeReason = reason?.trim() || "Administrative action";
    set({
      users: get().users.map((user) =>
        user._id === id
          ? { ...user, isBlocked: { status: true, reason: safeReason } }
          : user,
      ),
    });
    try {
      set({ loading: true });
      const response = await UserService.blockUser(id, safeReason);
      const updatedUser = response?.user || response;
      if (updatedUser?._id) {
        set({
          users: get().users.map((user) =>
            user._id === id ? { ...user, ...updatedUser } : user,
          ),
        });
      }
      toast.success("User blocked successfully");
      return;
    } catch (error) {
      if (previousUser) {
        set({
          users: get().users.map((user) =>
            user._id === id ? previousUser : user,
          ),
        });
      }
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  unblockUser: async (id: string, reason: string) => {
    const previousUser = get().users.find((user) => user._id === id);
    set({
      users: get().users.map((user) =>
        user._id === id
          ? { ...user, isBlocked: { status: false, reason: "" } }
          : user,
      ),
    });
    try {
      set({ loading: true });
      const response = await UserService.unblockUser(id, reason);
      const updatedUser = response?.user || response;
      if (updatedUser?._id) {
        set({
          users: get().users.map((user) =>
            user._id === id ? { ...user, ...updatedUser } : user,
          ),
        });
      }
      toast.success("User unblocked successfully");
      return;
    } catch (error) {
      if (previousUser) {
        set({
          users: get().users.map((user) =>
            user._id === id ? previousUser : user,
          ),
        });
      }
      const errorMessage =
        error instanceof Error ? error.message : "Something webt wrong";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  suspendUser: async (id: string, reason: string) => {
    const previousUser = get().users.find((user) => user._id === id);
    set({
      users: get().users.map((user) =>
        user._id === id
          ? { ...user, isSuspended: { status: true, reason } }
          : user,
      ),
    });
    try {
      set({ loading: true });
      const response = await UserService.suspendUser(id, reason);
      const updatedUser = response?.user || response;
      if (updatedUser?._id) {
        set({
          users: get().users.map((user) =>
            user._id === id ? { ...user, ...updatedUser } : user,
          ),
        });
      }
      toast.success("User suspended successfully");
      return;
    } catch (error) {
      if (previousUser) {
        set({
          users: get().users.map((user) =>
            user._id === id ? previousUser : user,
          ),
        });
      }
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  rateUser: async (id: string, rate: number) => {
    const previousUser = get().users.find((user) => user._id === id);
    set({
      users: get().users.map((user) =>
        user._id === id ? { ...user, trustScore: rate } : user,
      ),
    });
    try {
      set({ loading: true });
      const response = await UserService.rateUser(id, rate);
      const updatedUser = response?.user || response;
      if (updatedUser?._id) {
        set({
          users: get().users.map((user) =>
            user._id === id ? { ...user, ...updatedUser } : user,
          ),
        });
      }
      set({ loading: false });
      toast.success("User rated successfully");
      return;
    } catch (error) {
      if (previousUser) {
        set({
          users: get().users.map((user) =>
            user._id === id ? previousUser : user,
          ),
        });
      }
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  unsuspendUser: async (id: string, reason: string) => {
    const previousUser = get().users.find((user) => user._id === id);
    set({
      users: get().users.map((user) =>
        user._id === id
          ? { ...user, isSuspended: { status: false, reason: "" } }
          : user,
      ),
    });
    try {
      set({ loading: true });
      const response = await UserService.unsuspendUser(id, reason);
      const updatedUser = response?.user || response;
      if (updatedUser?._id) {
        set({
          users: get().users.map((user) =>
            user._id === id ? { ...user, ...updatedUser } : user,
          ),
        });
      }
      toast.success("User unsuspended successfully");
      return;
    } catch (error) {
      if (previousUser) {
        set({
          users: get().users.map((user) =>
            user._id === id ? previousUser : user,
          ),
        });
      }
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  getUserById: async (id: string) => {
    try {
      set({ loading: true });
      const user = await UserService.getUserById(id);
      set({ users: user ? [user] : [] });
      set({ loading: false });
      return;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },
  getUserByEmail: async (email: string) => {
    try {
      set({ loading: true });
      const users = await UserService.getUserByEmail(email);
      set({ users });
      set({ loading: false });
      return;
    } catch (error) {
    } finally {
    }
  },
  getUserByUsername: async (username: string) => {
    try {
      set({ loading: true });
      const users = await UserService.getUserByUsername(username);
      set({ users });
      set({ loading: false });
      toast.success("User fetched successfully");
      return;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  getUserByRole: async (role: string) => {
    try {
      set({ loading: true });
      const user = await UserService.getUserByRole(role);
      set({ users: user });
      set({ loading: false });
      return;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
      set({ error: errorMessage });
    } finally {
      set({ loading: false });
    }
  },
  getUserByStatus: async (status: string) => {
    try {
      set({ loading: true });
      const user = await UserService.getUserByStatus(status);
      set({ users: user });
      set({ loading: false });
      return;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "something went wrong";
      toast.error(errorMessage);
      set({ error: errorMessage });
    } finally {
    }
  },
  getUserByCountry: async (country: string) => {
    try {
      set({ loading: true });
      const user = await UserService.getUserByCountry(country);
      set({ users: user });
      set({ loading: false });
      return;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  getUserByCity: async (city: string) => {
    set({ loading: true });
    const user = await UserService.getUserByCity(city);
    set({ users: user });
    set({ loading: false });
  },
}));

export default useStore;
