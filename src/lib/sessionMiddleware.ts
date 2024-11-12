"use server";
import { cookies } from "next/headers";
import { lucia } from "./lucia";
import type { User } from "lucia";

export async function getUser(): Promise<User | null> {
	const cookieStore = await cookies();
	const sessionId = cookieStore.get("lucia-session")?.value || null;

	if (!sessionId) {
		return null;
	}

	try {
		const { session, user } = await lucia.validateSession(sessionId);

		// If no session or user exists, return null
		if (!session || !user) {
			return null;
		}

		// If session is valid but not fresh (near expiry), refresh it
		if (!session.fresh) {
			try {
				// Create new session cookie
				const sessionCookie = await lucia.createSessionCookie(session.id);

				// Set the refreshed cookie
				cookieStore.set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				);
			} catch (error) {
				// If refreshing fails, we can still return the user
				// since the session was valid
				console.error("Failed to refresh session:", error);
			}
		}
		return user;
	} catch (error) {
		// If session validation fails, return null
		console.error("Failed to validate session:", error);
		return null;
	}
}
