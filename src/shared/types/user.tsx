export  type User = {
    rating: number;
    isVerified: any;
    trustScore: number;
    isSuspended:{
        status:boolean;
        reason:string;
    };
    status: string | undefined;
    createdAt: any;
    _id: string
    role: string
    name: string
    email: string
    balance: number
    userLocation?: string | {
        country?: string
        city?: string
        geo?: {
            lat?: string;
            lng?: string;
        };
    };
    isBlocked: {
        status: boolean;
        reason: string;
    };
    isBanned: {
        status: boolean;
        reason: string;
    
    }
};
