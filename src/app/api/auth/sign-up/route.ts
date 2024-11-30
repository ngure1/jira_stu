import { NextResponse } from "next/server";
import prisma from "@/lib/client";
import { Argon2id } from "oslo/password";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";

export async function POST(req: Request) {
	try {
		// Validate request body
		const { email, password, name } = await req.json();

		if (!email || !password || !name) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Check for existing user
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 400 }
			);
		}

		// Hash password and create user
		const hashedPassword = await new Argon2id().hash(password);

		const user = await prisma.user.create({
			data: {
				name,
				email: email.toLowerCase(),
				hashedPassword,
			},
		});

		// Create session with string ID
		const session = await lucia.createSession(user.id, {});
		const sessionCookie = await lucia.createSessionCookie(session.id);

		// Set cookie
		const cookieStore = await cookies();
		cookieStore.set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes
		);

		return NextResponse.json(
			{
				success: true,
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
				},
			},
			{ status: 201 }
		);

	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 }
		);
	}
}
