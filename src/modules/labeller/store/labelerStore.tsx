import type{ User } from "../../../shared/types/user";
import {create} from "zustand"
import type { Dataset } from "../../../shared/types/dataset";
type LabelerStore={
    user:User[]|null,
    setUser:(user:User[])=>void,
    datasets:Dataset[]|null,
    setDatasets:(datasets:Dataset[])=>void,

  
};
const labelStore=create<LabelerStore>((set)=>({
    user:[],
    setUser:(user:User[])=>set({user}),
     datasets:[],
     setDatasets:(datasets:Dataset[])=>set({datasets})   
}));