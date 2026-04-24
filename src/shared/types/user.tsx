type Role = 'Admin' | 'Labeler' | 'Reviewer' | 'buyer' | 'seller' | 'labeller';
export interface User {
    rating: number;
    isVerified: boolean;
    trustScore: number;
    isSuspended:{
        status:boolean;
        reason:string;
    };
    status: string | undefined;
    createdAt: string; // Or Date, if you parse it
    _id: string
    role: Role
    name: string
    email: string
    earnings:number
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
