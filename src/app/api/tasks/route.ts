import { NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function POST(req: Request) {
	try {
		const {
			title,
			description,
			status,
			priority,
			due_date,
			user_id,
			project_id,
		} = await req.json();

		if (
			!title ||
			!description ||
			!due_date ||
			!user_id ||
			!project_id
		) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

        const task = await prisma.task.create({
            data:{
                title,
                description,
                status,
                priority,
                due_date,
                user_id,
                project_id
            }
        })

        return NextResponse.json(task);

	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}


