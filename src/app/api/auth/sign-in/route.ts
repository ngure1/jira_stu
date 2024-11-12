import prisma from "@/lib/client";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Argon2id } from "oslo/password";

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json();

		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user || !user.hashedPassword) {
			return NextResponse.json({
				success: false,
				status: 404,
				message: "User not found",
			});
		}

		const passwordMatch = await new Argon2id().verify(
			user.hashedPassword,
			password
		);

		if (!passwordMatch) {
			return NextResponse.json({
				success: false,
				status: 400,
				message: "Invalid credentials",
			});
		}

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = await lucia.createSessionCookie(session.id);
		(await cookies()).set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes
		);

		return NextResponse.json(
			{
				success: true,
				message: "User signed in successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{
				success: false,

				message: "Internal Server Error",
			},
			{ status: 500 }
		);
	}
}
