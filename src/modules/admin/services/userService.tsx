
import { api } from "../../../shared/types/api"
import type{ User } from "../../../shared/types/user"
export const UserService = {
    fetchUsers:async():Promise<User[]>=>{
        const response=await api.get('/users')
        return response.data
    },
    promoteUser:async(id:string,reason:string):Promise<any>=>{
        const response=await api.put(`admin/users/${id}/promote`,{reason:reason})
        return response.data

    },
    promoteToReviewer:async(id:string,reason:string):Promise<any>=>{
        const response=await api.put(`admin/users/${id}/promote-to-reviewer`,{reason:reason})
        return response.data

    },
    demoteUser:async(id:string,reason:string):Promise<any>=>{
        const response=await api.put(`admin/users/${id}/demote`,{reason:reason})
        return response.data    

    },
    deleteUser:async(id:string,reason:string):Promise<void>=>{
        const response=await api.delete(`admin/users/delete/${id}`,{data:{reason:reason}})
        return response.data


    },
    updateUser:async()=>{

    },
    addUser:async()=>{

    },
    verifyUser:async(id:string,reason:string)=>{
        const response=await api.put(`admin/users/${id}/verify`,{reason})
        return response.data


    },
    unverifyUser:async(id:string,reason:string):Promise<void>=>{
        const response=await api.put(`admin/users/${id}/unverify`,{reason:reason})
        return response.data


    },
    blockUser:async(id:string,reason:string):Promise<any>=>{
        const response=await api.put(`admin/users/${id}/block`,{reason:reason})
        return response.data



    },
    unblockUser:async(id:string,reason:string):Promise<any>=>{
        const response=await api.put(`admin/users/${id}/unblock`,{reason:reason})
        return response.data




    },
    rateUser:async(id:string,rate:number):Promise<any>=>{
        const response=await api.put(`admin/users/${id}/rate`,{rate:rate})
        return response.data

    },
    suspendUser:async(id:string,reason:string):Promise<any>=>{
        const response=await api.put(`admin/users/${id}/suspend`,{reason:reason})
        return response.data


    },
    unsuspendUser:async(id:string,reason:string):Promise<any>=>{
        const response=await api.put(`admin/users/${id}/unsuspend`,{reason:reason})
        return response.data


    },
    getUserById:async(id:string):Promise<User>=>{
        const response=await api.get(`admin/${encodeURIComponent(id)}/users/`)
        return response.data


    },
    getUserByEmail:async(email:string):Promise<User[]>=>{
        const response=await api.get(`admin/users/${encodeURIComponent(email)}/email`)
        return response.data



    },
    getUserByUsername:async(username:string):Promise<User[]>=>{
        const response=await api.get(`admin/users/${encodeURIComponent(username)}/username`)
        return response.data



    },
    getUserByRole:async(role:string):Promise<User[]>=>{
        const response=await api.get(`admin/users/${encodeURIComponent(role)}/role`)
        return response.data


    },
    getUserByStatus:async(status:string):Promise<User[]>=>{
        const response=await api.get(`admin/users/${encodeURIComponent(status)}/status`)
        return response.data

    },
    getUserByCountry:async(country:string):Promise<User[]>=>{
        const response=await api.get(`admin/users/${encodeURIComponent(country)}/country`)
        return response.data

    },
    getUserByCity:async(city:string)=>{
        const response=await api.get(`admin/users/${encodeURIComponent(city)}/city`)
        return response.data



    },


}
