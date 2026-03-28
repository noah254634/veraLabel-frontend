export interface datasetRequest{
    domain: Domain;
    specifications: string;
    volume: string;
    format: string;
    budget: string;
    uploadedFile: File | null;
    sourceLink:string;
  }

export type Domain = 'NLP' | 'RLHF' | 'Audio' | 'Tabular';
export const INTENT_TYPES = {
  LABELING: 'labeling', // User has data, needs it labeled
  SOURCING: 'sourcing'  // User needs us to find/generate data
};