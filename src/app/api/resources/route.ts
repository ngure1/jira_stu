import { getUser } from "@/lib/sessionMiddleware";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/client";

// Configuration
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
	api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

interface CloudinaryResponse {
	public_id: string;
	[key: string]: any;
}

export async function POST(req: Request) {
	const user = await getUser();
	if (!user) {
		return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
	}

	try {
		const formData = await req.formData();
		const file = formData.get("file") as File | null;
		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{ folder: "jira_stu", resource_type: "raw", use_filename: true },
				(error, result) => {
					if (error) {
						reject(error);
					} else {
						resolve(result as CloudinaryResponse);
					}
				}
			);
			uploadStream.end(buffer);
		});

		const resource = await prisma.resource.create({
			data: {
				project_id: formData.get("project_id") as string,
				user_id: user.id,
				file_name: formData.get("file_name") as string,
				file_url: result.secure_url,
			},
		});

		return NextResponse.json(resource, { status: 200 });
	} catch (error) {
		console.log("upload error", error);
		return NextResponse.json({ error }, { status: 500 });
	}
}

export async function GET(req: NextRequest) {
	try {
		const project_id = await req.nextUrl.searchParams.get("project_id");
		if (!project_id) {
			return NextResponse.json(
				{ error: "Missing project id" },
				{ status: 400 }
			);
		}
		const resources = await prisma.resource.findMany({
			where: {
				project_id,
			},
		});
		return NextResponse.json(resources, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}
