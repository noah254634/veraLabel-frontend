import toast from "react-hot-toast";
import type { Dataset } from "../../../shared/types/dataset";
import { datasetService } from "../services/datasetService";
import { create } from "zustand";
import axios from "axios";
type DatasetStore = {
  error: string | null;
  setError: (error: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  datasets: Dataset[];
  currentStatus: "all" | "pending" | "approved" | "rejected" | "flagged";
  setCurrentStatus: (status: "all" | "pending" | "approved" | "rejected" | "flagged") => void;
  setDatasets: (datasets: Dataset[]) => Promise<void>;
  getDataset: () => Promise<Dataset[] | null>;
  getDatasetsByStatus: (status: "pending" | "approved" | "rejected" | "flagged") => Promise<Dataset[] | null>;
  deleteDataset: (id: string, reason: string) => Promise<void>;
  addDataset: () => Promise<void>;
  publishDataset: () => Promise<void>;
  unpublishDataset: () => Promise<void>;
  publishDatasetById: (id: string) => Promise<void>;
  unpublishDatasetById: (id: string, reason: string) => Promise<void>;
  rateDataset: (id: string, rate: number) => Promise<void>;
  approveDataset: (id: string) => Promise<void>;
  rejectDataset: (id: string, reason: string) => Promise<void>;
  getDatasetByCategory: (category: string) => Promise<Dataset[] | null>;
  getDatasetByUser: (datasetOwner: string) => Promise<Dataset[] | null>;
  getDatasetById: (id: string) => Promise<Dataset | null>;
  updateDatasetPrice: (id: string, price: number) => Promise<void>;
  updateDatasetBatchPrice: (id: string, pricePerBatch: number) => Promise<void>;
  updateDatasetStatus: (id: string, status: string) => Promise<void>;
  updateDatasetPriority: (id: string, priority: string) => Promise<void>;
  updateDatasetMaxLabellers: (id: string, maxLabellers: number) => Promise<void>;
  revokeDatasetBatches: (datasetId: string) => Promise<{ revoked: number; tasksReset: number } | null>;
  compileDataset: (id: string) => Promise<any>;
};
export const dataStore = create<DatasetStore>((set, get) => ({
  error: null,
  setError: (error: string | null) => set({ error }),
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  datasets: [],
  currentStatus: "all",
  setCurrentStatus: (status: "all" | "pending" | "approved" | "rejected" | "flagged") => set({ currentStatus: status }),
  setDatasets: async (datasets: Dataset[]) => set({ datasets }),
  getDataset: async () => {
    try {
      set({ loading: true });
      const datasets = await datasetService.fetchDatasets();
      set({ datasets: datasets });
      console.log(datasets)
      return datasets;
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : error instanceof Error
            ? error.message
            : "Something went wrong";
      toast.error(`Something went wrong:${errorMessage}`);
      set({ error: errorMessage });
      return null;
    } finally {
      set({ loading: false });
    }
  },
  getDatasetsByStatus: async (status: "pending" | "approved" | "rejected" | "flagged") => {
    try {
      set({ loading: true, currentStatus: status });
      let datasets: Dataset[] = [];
      
      switch (status) {
        case "pending":
          datasets = await datasetService.fetchPendingDatasets();
          break;
        case "approved":
          datasets = await datasetService.fetchApprovedDatasets();
          break;
        case "rejected":
          datasets = await datasetService.fetchRejectedDatasets();
          break;
        case "flagged":
          datasets = await datasetService.fetchFlaggedDatasets();
          break;
      }
      
      set({ datasets });
      return datasets;
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : error instanceof Error
            ? error.message
            : "Something went wrong";
      toast.error(`Failed to fetch ${status} datasets: ${errorMessage}`);
      set({ error: errorMessage });
      return null;
    } finally {
      set({ loading: false });
    }
  },
  deleteDataset: async (id: string, reason: string) => {
    const previousDatasets = get().datasets;
    try {
      set({ loading: true });
      await datasetService.deleteDataset(id, reason);
      set({
        datasets: get().datasets.filter((dataset) => dataset._id !== id),
      });
      toast.success("Dataset deleted successfully");
    } catch (err) {
      set({ datasets: previousDatasets });
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  addDataset: async () => {},
  publishDataset: async () => {},
  unpublishDataset: async () => {},
  publishDatasetById: async (id: string) => {
    const previousDataset = get().datasets.find((dataset) => dataset._id === id);
    try {
      set({ loading: true });
      const response = await datasetService.publishDatasetById(id);
      const updatedDataset = response?.dataset || response;
      if (updatedDataset?._id) {
        set({
          datasets: get().datasets.map((dataset) =>
            dataset._id === id ? { ...dataset, ...updatedDataset } : dataset
          ),
        });
      } else {
        set({
          datasets: get().datasets.map((dataset) =>
            dataset._id === id ? { ...dataset, isPublished: true } : dataset
          ),
        });
      }
      toast.success("Dataset published successfully");
    } catch (err) {
      if (previousDataset) {
        set({
          datasets: get().datasets.map((dataset) =>
            dataset._id === id ? previousDataset : dataset
          ),
        });
      }
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  unpublishDatasetById: async (id: string, reason: string) => {
    const previousDataset = get().datasets.find((dataset) => dataset._id === id);
    try {
      set({ loading: true });
      const response = await datasetService.unpublishDatasetById(id, reason);
      const updatedDataset = response?.dataset || response;
      if (updatedDataset?._id) {
        set({
          datasets: get().datasets.map((dataset) =>
            dataset._id === id ? { ...dataset, ...updatedDataset } : dataset
          ),
        });
      } else {
        set({
          datasets: get().datasets.map((dataset) =>
            dataset._id === id ? { ...dataset, isPublished: false } : dataset
          ),
        });
      }
      toast.success("Dataset unpublished successfully");
    } catch (err) {
      if (previousDataset) {
        set({
          datasets: get().datasets.map((dataset) =>
            dataset._id === id ? previousDataset : dataset
          ),
        });
      }
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  rateDataset: async (id: string, rate: number) => {
    const previousDataset = get().datasets.find((dataset) => dataset._id === id);
    try {
      set({ loading: true });
      const response = await datasetService.rateDataset(rate, id);
      const updatedDataset = response?.dataset || response;
      if (updatedDataset?._id) {
        set({
          datasets: get().datasets.map((dataset) =>
            dataset._id === id ? { ...dataset, ...updatedDataset } : dataset
          ),
        });
      } else {
        set({
          datasets: get().datasets.map((dataset) =>
            dataset._id === id ? { ...dataset, rating: rate } : dataset
          ),
        });
      }
    } catch (err) {
      if (previousDataset) {
        set({
          datasets: get().datasets.map((dataset) =>
            dataset._id === id ? previousDataset : dataset
          ),
        });
      }
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  approveDataset: async (id: string) => {
    const previousDataset = get().datasets.find((dataset) => dataset._id === id);
    try {
      set({ loading: true });
      const response = await datasetService.approveDatasetById(id);
      const updatedDataset = response?.dataset || response;
      if (updatedDataset?._id) {
        set({
          datasets: get().datasets.map((dataset) =>
            dataset._id === id ? { ...dataset, ...updatedDataset } : dataset
          ),
        });
      } else {
        set({
          datasets: get().datasets.map((dataset) =>
            dataset._id === id ? { ...dataset, status: "approved" } : dataset
          ),
        });
      }
    } catch (err) {
      if (previousDataset) {
        set({
          datasets: get().datasets.map((dataset) =>
            dataset._id === id ? previousDataset : dataset
          ),
        });
      }
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  rejectDataset: async (id: string, reason: string) => {
    const previousDataset = get().datasets.find((dataset) => dataset._id === id);
    try {
      set({ loading: true });
      const response = await datasetService.rejectDataset(id, reason);
      const updatedDataset = response?.dataset || response;
      if (updatedDataset?._id) {
        set({
          datasets: get().datasets.map((dataset) =>
            dataset._id === id ? { ...dataset, ...updatedDataset } : dataset
          ),
        });
      } else {
        set({
          datasets: get().datasets.map((dataset) =>
            dataset._id === id ? { ...dataset, status: "rejected" } : dataset
          ),
        });
      }
      toast.success("Dataset rejected successfully");
    } catch (err) {
      if (previousDataset) {
        set({
          datasets: get().datasets.map((dataset) =>
            dataset._id === id ? previousDataset : dataset
          ),
        });
      }
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  getDatasetByCategory: async (category: string) => {
    try {
      set({ loading: true });
      const datasets = await datasetService.fetchDatasets();
      const filteredDatasets = datasets.filter(
        (dataset) => dataset.category === category,
      );
      set({ datasets: filteredDatasets });
      return filteredDatasets;
    } catch (error) {
      toast.error("Something went wrong");
      return null;
    } finally {
      set({ loading: false });
    }
  },
  getDatasetByUser: async (datasetOwner: string) => {
    try {
      set({ loading: true });
      const datasets = await datasetService.fetchDatasets();
      const filteredDatasets = datasets.filter(
        (dataset) => dataset.datasetOwner === datasetOwner,
      );
      set({ datasets: filteredDatasets });
      return filteredDatasets;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(`Something went wrong ${errorMessage}`, { duration: 3000 });
      set({ error: errorMessage });
      return null;
    } finally {
      set({ loading: false });
    }
  },
  getDatasetById: async (id: string) => {
    try {
      set({ loading: true });
      const datasets = await datasetService.fetchDatasetById(id);
      set({ datasets: datasets ? [datasets] : [] });
      if (datasets === null) {
        toast.error("Dataset not found");
        return null;
      }
      return datasets;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
      set({ error: errorMessage });
      return null;
    } finally {
      set({ loading: false });
    }
  },
  updateDatasetPrice: async (id: string, price: number) => {
    try {
      set({ loading: true });
      await datasetService.updateDatasetPrice(id, price);
      set({
        datasets: get().datasets.map((d) =>
          (d._id === id || d.datasetId === id) ? { ...d, price: String(price) } : d
        ),
      });
      toast.success("Price updated successfully");
    } catch (error) {
      toast.error("Failed to update price");
    } finally {
      set({ loading: false });
    }
  },
  updateDatasetBatchPrice: async (id: string, pricePerBatch: number) => {
    try {
      set({ loading: true });
      await datasetService.updateDatasetBatchPrice(id, pricePerBatch);
      set({
        datasets: get().datasets.map((d) =>
          (d._id === id || d.datasetId === id) ? { ...d, pricePerBatch } : d
        ),
      });
      toast.success("Batch price updated successfully");
    } catch (error) {
      toast.error("Failed to update batch price");
    } finally {
      set({ loading: false });
    }
  },
  updateDatasetStatus: async (id: string, status: string) => {
    try {
      set({ loading: true });
      await datasetService.updateDatasetStatus(id, status);
      set({
        datasets: get().datasets.map((d) =>
          (d._id === id || d.datasetId === id) ? { ...d, status } : d
        ),
      });
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      set({ loading: false });
    }
  },
  updateDatasetPriority: async (id: string, priority: string) => {
    try {
      set({ loading: true });
      await datasetService.updateDatasetPriority(id, priority);
      set({
        datasets: get().datasets.map((d) =>
          (d._id === id || d.datasetId === id) ? { ...d, priority } : d
        ),
      });
      toast.success(`Priority updated to ${priority}`);
    } catch (error) {
      toast.error("Failed to update priority");
    } finally {
      set({ loading: false });
    }
  },
  updateDatasetMaxLabellers: async (id: string, maxLabellers: number) => {
    try {
      set({ loading: true });
      await datasetService.updateDatasetMaxLabellers(id, maxLabellers);
      set({
        datasets: get().datasets.map((d) =>
          (d._id === id || d.datasetId === id) ? { ...d, maxLabellers } : d
        ),
      });
      toast.success(`Max labellers updated to ${maxLabellers}`);
    } catch (error) {
      toast.error("Failed to update max labellers");
    } finally {
      set({ loading: false });
    }
  },
  revokeDatasetBatches: async (datasetId: string) => {
    try {
      set({ loading: true });
      const result = await datasetService.revokeDatasetBatches(datasetId);
      toast.success(
        `Revoked ${result.revoked} batch(es) — ${result.tasksReset} task(s) returned to pool`,
        { duration: 5000 }
      );
      return result;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to revoke batches";
      toast.error(msg);
      return null;
    } finally {
      set({ loading: false });
    }
  },
  compileDataset: async (id: string) => {
    try {
      set({ loading: true });
      const result = await datasetService.compileDataset(id);
      toast.success(result.message || "Dataset compiled successfully!");
      // Update local dataset object with compiled downloadUrl and status
      if (result.r2Key) {
        set({
          datasets: get().datasets.map((d) =>
            (d._id === id || d.datasetId === id) ? { ...d, downloadUrl: result.r2Key, status: "completed" } : d
          )
        });
      }
      return result;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to compile dataset";
      toast.error(msg);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
