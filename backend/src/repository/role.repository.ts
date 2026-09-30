import prisma from '../config/prisma.js'
import { Prisma } from "@prisma/client";

export const findRolesByProfileId = async (profileId:string)=>{
    return prisma.profileRole.findMany({
        where:{
            profileId
        },
        orderBy:{
            createdAt:"asc"
        }
    });
};

export const findRoleById = async (id:string)=>{
    return prisma.profileRole.findUnique({
        where:{
            id
        }
    })
};

export const createRole = async (
    data:{
        profileId:string,
        role:string,
        isDefault?:boolean,
        order?:number
    })=>{
    return prisma.profileRole.create({
        data
    });
};

export const updateRole = async (
    id:string,
    data:{
        role?:string,
        order?:number
    })=>{
        return prisma.profileRole.update({
            where:{
                id
            },
            data
        });
};

export const deleteRole = async(id:string)=>{
    return prisma.profileRole.delete({
        where:{
            id
        }
    });
};

export const createRoleWithDefault = async (data:{
        profileId:string,
        role:string,
        isDefault?:boolean,
        order?:number
    })=>{
        return prisma.$transaction(async (tx: Prisma.TransactionClient)=>{
            const profile = await tx.profile.findUnique({
                where:{
                    id:data.profileId
                }
            });
            if(!profile){
                throw new Error("PROFILE_NOT_FOUND")
            }
            if(data.isDefault===true){
                await tx.profileRole.updateMany({
                    where:{
                        profileId : data.profileId
                    },
                    data:{
                        isDefault:false
                    }
                });
            }
            return tx.profileRole.create({
                data:{
                    profileId:data.profileId,
                    role: data.role,
                    isDefault: data.isDefault ?? false,
                    order: data.order?? 0
                }
            });
        });
}


export const setDefaultRole = async (id: string)=>{
    return prisma.$transaction(async(tx:Prisma.TransactionClient)=>{
        const role = await tx.profileRole.findUnique(
            {
                where:{
                    id
                }
            }
        );

        if(!role){
            throw new Error("ROLE_NOT_FOUND")
        }

        await tx.profileRole.updateMany({
            where:{
                profileId : role.profileId
            },
            data:{
                isDefault:false
            }
        });

        return tx.profileRole.update({
            where:{
                id:role.id
            },
            data:{
                isDefault:true
            }
        });
    });
}