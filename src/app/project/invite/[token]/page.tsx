import prisma from "@/lib/client";
import { getUser } from "@/lib/sessionMiddleware";
import { redirect } from "next/navigation";

// Server component to handle accepting the invitation
const page = async ({ params }: { params: { token: string } }) => {
	const { token } = await params;

	// Retrieve the invitation using the token
	const invitation = await prisma.invitation.findUnique({
		where: { token },
	});

	// If invitation does not exist or has expired
	if (!invitation || new Date() > new Date(invitation.expiresAt)) {
		return <p>Invitation has expired</p>;
	}

	// Get the logged-in user (assuming `getUser` returns the user object with an `id`)
	const user = await getUser();

	if (!user) {
		return redirect("/sign-in");
	}

	// Retrieve the project using the projectId from the invitation
	const project = await prisma.project.findUnique({
		where: { id: invitation.projectId },
	});

	// If the project doesn't exist
	if (!project) {
		return <p>Project not found</p>;
	}

	// Check if the user is already a member
	const existingMember = await prisma.projectMembers.findFirst({
		where: {
			project_id: invitation.projectId,
			user_id: user.id,
		},
	});

	if (existingMember) {
		return redirect(`/project/${invitation.projectId}`);
	}

	// Add the user to the project with the role 'MEMBER'
	try {
		await prisma.projectMembers.create({
			data: {
				project_id: invitation.projectId,
				user_id: user.id,
				role: "MEMBER",
			},
		});

		// mark the invitation as accepted
		await prisma.invitation.update({
			where: { token },
			data: { status: "ACCEPTED" },
		});

		return redirect(`/project/${invitation.projectId}`);
	} catch (error) {
		console.error("Error adding member to project:", error);
		return <p>Something went wrong</p>;
	}
};

export default page;
