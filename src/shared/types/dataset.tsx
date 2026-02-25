export interface Dataset{
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    metadata: Record<string, any>; // Flexible field for additional metadata
    datasetOwner:string;
    datasetId:string;
    isPublished:boolean;
    isPrivate:boolean;
    rating?: number;
    status?: string;
    category:string;
    // Add more fields as needed
};
