import prisma from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	{ params }: { params: { projectId: string } }
) {
	try {
		const { projectId } = await params;

		const project = await prisma.project.findUnique({
			where: {
				id: projectId,
			},
			include: {
				tasks: {
					include: {
						asignee: true,
					},
				},
				members: {
					include: {
						user: true,
					},
				},
			},
		});

		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		const response = {
			project: {
				id: project.id,
				name: project.name,
				description: project.description,
			},
			tasks: project.tasks.map((task) => {
				return {
					id: task.id,
					title: task.title,
					description: task.description,
					status: task.status,
					asignee: task.asignee,
				};
			}),
			members: project.members.map((member) => {
				return {
					role: member.role.toLowerCase(),
					name: member.user.name,
					email: member.user.email,
				};
			}),
		};

		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		console.error("Error fetching project details:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
