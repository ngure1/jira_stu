import { NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function GET(
	req: Request,
	{ params }: { params: { taskId: string } }
) {
	try {
		const { taskId: id } = await params;
		const taskId = parseInt(id, 10);

		if (isNaN(taskId)) {
			return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
		}

		const task = await prisma.task.findUnique({
			where: {
				id: taskId,
			},
		});

		return NextResponse.json(task);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { taskId: string } }
) {
	const { taskId: id } = await params;
	const taskId = parseInt(id, 10);
	try {
		if (isNaN(taskId)) {
			return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
		}

		// First check if task exists
		const existingTask = await prisma.task.findUnique({
			where: { id: taskId },
		});

		if (!existingTask) {
			return NextResponse.json({ error: "Task not found" }, { status: 404 });
		}
		const body = await req.json();
		const task = await prisma.task.update({
			where: {
				id: taskId,
			},
			data: {
				...body,
			},
		});
		return NextResponse.json(task);
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { taskId: string } }
) {
	try {
		const { taskId: id } = await params;
		const taskId = parseInt(id, 10);

		if (isNaN(taskId)) {
			return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
		}

		const existingTask = await prisma.task.findUnique({
			where: { id: taskId },
		});

		if (!existingTask) {
			return NextResponse.json({ error: "Task not found" }, { status: 404 });
		}

		await prisma.task.delete({
			where: { id: taskId },
		});

		return NextResponse.json(
			{ message: "Task deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Delete task error:", {
			error,
			stack: error instanceof Error ? error.stack : undefined,
			params,
			taskId: params.taskId,
		});

		return NextResponse.json(
			{
				error: "Failed to delete task",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
