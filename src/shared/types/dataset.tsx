export interface Dataset{
    price: string;
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
    isCollection?: boolean;
    rating?: number;
    status?: string;
    datasetType?: "image" | "audio" | "text" | "video" | "ai_response";
    labellingMethod?: "rlhf" | "classification" | "annotation" | "transcription";
    contentType?: "text" | "audio" | "video" | "image" | "code" | "document";
    category:string;
    datasetFormat:string;
    pricePerBatch?: number;
    reviews:string[];
    paidAt?: string;
    
    // Add more fields as needed
};
