import { NextResponse } from "next/server";
import prisma from "@/lib/client";
import { sendInvitationEmail } from "./helper";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
	try {
		const { emails, projectId } = await req.json();

		// Validate input
		if (!Array.isArray(emails) || emails.length === 0) {
			return NextResponse.json(
				{ error: "Invalid emails input" },
				{ status: 400 }
			);
		}

		// Check if project exists
		const existingProject = await prisma.project.findUnique({
			where: {
				id: projectId,
			},
		});

		if (!existingProject) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		// Create a result array to track invitation status for each email
		const invitationResults = [];

		// Process each email
		for (const email of emails) {
			// Find the user
			const user = await prisma.user.findUnique({
				where: {
					email: email,
				},
			});

			if (!user) {
				invitationResults.push({
					email,
					status: "FAILED",
					message: "User not found",
				});
				continue;
			}

			// Check if the user is already part of the project
			const existingMember = await prisma.projectMembers.findFirst({
				where: {
					project_id: projectId,
					user: { email },
				},
			});

			if (existingMember) {
				invitationResults.push({
					email,
					status: "FAILED",
					message: "User is already a member",
				});
				continue;
			}

			// Generate unique token for invitation link
			const token = uuidv4();
			const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // Expires in 24 hours

			try {
				// Save invitation to the database
				await prisma.invitation.create({
					data: {
						project: { connect: { id: projectId } },
						user: { connect: { id: user.id } },
						email,
						token,
						expiresAt,
					},
				});

				// Send email with invitation link
				const invitationLink = `${process.env.FRONTEND_URL}/project/invite/${token}`;
				await sendInvitationEmail(email, invitationLink);

				invitationResults.push({
					email,
					status: "SENT",
					message: "Invitation sent successfully",
				});
			} catch (error) {
				console.error(`Error processing invitation for ${email}:`, error);
				invitationResults.push({
					email,
					status: "FAILED",
					message: "Error creating invitation",
				});
			}
		}

		// Determine overall response status
		const failedInvitations = invitationResults.filter(
			(result) => result.status === "FAILED"
		);

		if (failedInvitations.length === emails.length) {
			// All invitations failed
			return NextResponse.json(
				{
					error: "All invitations failed",
					results: invitationResults,
				},
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{
				success: true,
				results: invitationResults,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Unexpected error in invitation process:", error);
		return NextResponse.json(
			{ error: "Unexpected error occurred" },
			{ status: 500 }
		);
	}
}
