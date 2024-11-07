import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// Create 4 users
	const user1 = await prisma.user.create({
		data: {
			name: "Alice Johnson",
			email: "alice@example.com",
		},
	});

	const user2 = await prisma.user.create({
		data: {
			name: "Bob Smith",
			email: "bob@example.com",
		},
	});

	const user3 = await prisma.user.create({
		data: {
			name: "Charlie Brown",
			email: "charlie@example.com",
		},
	});

	const user4 = await prisma.user.create({
		data: {
			name: "Diana Prince",
			email: "diana@example.com",
		},
	});

	console.log({ user1, user2, user3, user4 });
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
