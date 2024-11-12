import { getUser } from "@/lib/sessionMiddleware";

export default async function Home() {
	const user = await getUser();
	return (
		<main className="h-full w-full">
			<nav className="flex justify-end p-4">
				{user ? (
					<div className="flex gap-4">
						<p>Hi {user.id}</p>
						<a href="/api/auth/sign-out">Sign out</a>
					</div>
				) : (
					<div className="flex gap-4">
						<a href="/api/auth/sign-in">Sign in</a>
						<a href="/api/auth/sign-up">Sign up</a>
					</div>
				)}
			</nav>
		</main>
	);
}
