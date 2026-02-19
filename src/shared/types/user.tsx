export  type User = {
    id: number
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