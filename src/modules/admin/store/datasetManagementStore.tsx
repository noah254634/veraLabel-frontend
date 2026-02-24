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
  setDatasets: (datasets: Dataset[]) => Promise<void>;
  getDataset: () => Promise<Dataset[] | null>;
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
};
export const dataStore = create<DatasetStore>((set, get) => ({
  error: null,
  setError: (error: string | null) => set({ error }),
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  datasets: [],
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
}));
