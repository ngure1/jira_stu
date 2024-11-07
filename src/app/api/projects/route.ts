import { NextResponse } from "next/server";
import prisma from "@/lib/client";

//get projects associated with the given user wheter member or admin
export async function GET(req: Request) {
	try {
		// todo modify to use authenticated user
		const { searchParams } = new URL(req.url);
		const id = searchParams.get("userId");
		if (!id) {
			return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
		}

		const userId = parseInt(id, 10);
		console.log(userId);

		const projects = await prisma.projectMembers.findMany({
			where: {
				user_id: userId,
			},
			include: {
				project: true,
			},
		});

		return NextResponse.json(
			projects.map((project) => {
				return {
					...project.project,
					role: project.role,
				};
			})
		);
	} catch (error) {
		// console.error(error);
		if (error instanceof SyntaxError) {
			return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
		}
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { name, description } = body;
		const user = body.user;

		if (!name || !description) {
			return NextResponse.json(
				{ error: "Missing required fields: name or description" },
				{ status: 400 }
			);
		}

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const project = await prisma.project.create({
			data: {
				name,
				description,
			},
		});

		await prisma.projectMembers.create({
			data: {
				project_id: project.id,
				user_id: user.id,
				role: "ADMIN",
			},
		});

		return NextResponse.json(project);
	} catch (error) {
		console.error("Error in POST /api/projects:", error);

		if (error instanceof SyntaxError) {
			return NextResponse.json(
				{ error: "Missing required fields: name and description" },
				{ status: 400 }
			);
		} else if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		} else {
			return NextResponse.json(
				{ error: "Internal server error" },
				{ status: 500 }
			);
		}
	}
}
