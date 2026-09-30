import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const existingProfile = await prisma.profile.findFirst();

    if (existingProfile) {
        console.log("Profile already exists");
        return;
    }

    const profile = await prisma.profile.create({
        data: {
            name: "Ketan Suthar",
            bio: "AI Full Stack Developer",
            email: "your-email@example.com",
            phone: null,
            location: "India",
        },
    });

    console.log("Profile created:", profile);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });