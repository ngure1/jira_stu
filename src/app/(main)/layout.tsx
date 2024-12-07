// import { getUser } from "@/lib/sessionMiddleware";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import { validateRequest } from "@/auth";
import SideBarNavigation from "./SideBarNavigation";



export default async function Layout({ children }: { children: React.ReactNode; }) {
    const session = await validateRequest();

    // if user is not logged in, they will  be redirected to the login page
    // not for security - for UX
    if (!session.session) {
        console.log("redirecting to login page")
        redirect("/login");
    }

    return <SessionProvider value={session}>
        <div>
            <SideBarNavigation />
            {children}
        </div>
    </SessionProvider>

}