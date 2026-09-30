import prisma from '../config/prisma.js'

export const getProfile = async()=>{
    const profile = await prisma.profile.findFirst({
        include:{
            roles:{
                orderBy:{
                    createdAt:"asc"
                }
            },
            images:{
                orderBy:{
                    createdAt:"desc"
                }
            },
            resumes:{
                orderBy:{
                    createdAt:"desc"
                }
            },
            socialLinks:{
                orderBy:{
                    createdAt:"asc"
                }
            }
        }
    });
    return profile;
}

export const updateProfile = async(
    data:{
        name?:string,
        bio?:string,
        email?:string,
        phone?:string,
        location?:string
    })=>{
    const existingProfile = await prisma.profile.findFirst();
    if(!existingProfile){
        throw new Error("PROFILE_NOT_FOUND");
    }
    const profile = await prisma.profile.update({
        where:{
            id:existingProfile.id
        },
        data
    });
    return profile;
}