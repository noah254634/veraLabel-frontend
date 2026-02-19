export type Dataset = {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    metadata: Record<string, any>; // Flexible field for additional metadata
    datasetOwner:string;
    datasetId:string;
    isPublished:boolean;
    isPrivate:boolean;
    // Add more fields as needed
};