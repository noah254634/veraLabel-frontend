import toast from "react-hot-toast";
import type { Dataset } from "../../../shared/types/dataset";
import { datasetService } from "../services/datasetService";
import { create } from "zustand";
import { data } from "react-router-dom";
type DatasetStore = {
  error: string | null;
  setError: (error: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  dataset: Dataset[];
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
export const dataStore = create<DatasetStore>((set) => ({
  error: null,
  setError: (error: string | null) => set({ error }),
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  dataset: [],
  setDatasets: async (dataset: Dataset[]) => set({ dataset }),
  getDataset: async () => {
    try {
      const datasets = await datasetService.fetchDatasets();
      set({ dataset: datasets });
      return datasets;
    } catch (error) {
      toast.error("Something went wrong");
      return null;
    }
  },
  deleteDataset: async (id: string, reason: string) => {
    try {
      set({ loading: true });
      await datasetService.deleteDataset(id, reason);
      toast.success("Dataset deleted successfully");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  addDataset: async () => {},
  publishDataset: async () => {},
  unpublishDataset: async () => {},
  publishDatasetById: async (id: string) => {
    try {
      set({ loading: true });
      await datasetService.publishDatasetById(id);
      toast.success("Dataset published successfully");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  unpublishDatasetById: async (id: string, reason: string) => {
    try {
      set({ loading: true });
      await datasetService.unpublishDatasetById(id, reason);
      toast.success("Dataset unpublished successfully");
  }catch(err){
    toast.error("Something went wrong");
  }finally{
    set({loading:false});
  }
  },
  rateDataset: async (id: string, rate: number) => {
    try {
      set({ loading: true });
      await datasetService.rateDataset(rate, id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message:"Something went wrong";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  approveDataset: async (id: string) => {
    try {
      set({ loading: true });
      await datasetService.approveDatasetById(id);

  }catch(err){}finally{
    set({loading:false});
  }
  },
  rejectDataset: async (id: string, reason: string) => {
    try {
      set({ loading: true });
      await datasetService.rejectDataset(id, reason);
      toast.success("Dataset rejected successfully");
    } catch (err) {
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
      set({ dataset: filteredDatasets });
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
      set({ dataset: filteredDatasets });
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
      set({ dataset: datasets ? [datasets] : [] });
      if(datasets === null){
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
