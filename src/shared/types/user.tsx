export  type User = {
    id: number
    name: string
    username: string
    email: string
    address: {
        country: string
        city: string
        geo: {
            lat: string;
            lng: string;
        };
    };
};