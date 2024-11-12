import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia } from "lucia";
import prisma from "./client";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		name: "lucia-session",
		expires:false,
		attributes: {
			secure: process.env.NODE_ENV === "production",
		},
	},
});


