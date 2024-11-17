import { NextResponse } from "next/server";
import prisma from "@/lib/client";
import { sendInvitationEmail } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
	try {
		const { email, projectId } = await req.json();

		// Check if the user is already part of the project
		const existingMember = await prisma.projectMembers.findFirst({
			where: {
				project_id: projectId,
				user: { email },
			},
		});

		if (existingMember) {
			return NextResponse.json(
				{ error: "User is already a member" },
				{ status: 400 }
			);
		}

		// Generate unique token for invitation link
		const token = uuidv4();
		const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // Expires in 24 hours

		const user = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Save invitation to the database
		try {
			await prisma.invitation.create({
				data: {
					project: { connect: { id: projectId } },
					user: { connect: { id: user.id } },
					email,
					token,
					expiresAt,
				},
			});
		} catch (error) {
			console.log(error);
			return NextResponse.json(
				{ error: "error creating invitation" },
				{ status: 500 }
			);
		}

		// Send email with invitation link
		const invitationLink = `${process.env.FRONTEND_URL}/project/invite/${token}`;
		console.log(invitationLink);
		await sendInvitationEmail(email, invitationLink);

		return NextResponse.json({ success: true }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
