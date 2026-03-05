export interface datasetRequest{
    domain: Domain;
    specifications: string;
    volume: string;
    format: string;
    budget: string;
    uploadedFile: File | null;
    sourceLink:string;
  }

export type Domain = 'NLP' | 'CV' | 'Audio' | 'Tabular' | 'Finance';