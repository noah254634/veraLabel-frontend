export  type User = {
    id: number
    role: string
    name: string
    username: string
    email: string
    balance: number
    userLocation: {
        country: string
        city: string
        geo: {
            lat: string;
            lng: string;
        };
    };
};