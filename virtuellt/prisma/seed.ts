import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
    {
        name: 'David Machado',
        email: 'david@virtuellt.io',
        password: '12345678',
    },
    {
        name: 'Alice',
        email: 'alice@virtuellt.io',
        password: '12345678',
    },
    {
        name: 'Nilu',
        email: 'nilu@virtuellt.io',
        password: '12345678',
    },
    {
        name: 'Mahmoud',
        email: 'mahmoud@virtuellt.io',
        password: '12345678',
    },
]

async function main() {
    console.log(`Start seeding ...`)
    for (const u of userData) {
        const user = await prisma.user.create({
            data: u,
        })
        console.log(`Created user with id: ${user.id}`)
    }
    console.log(`Seeding finished.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
