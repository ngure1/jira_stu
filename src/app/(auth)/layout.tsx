import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";



export default async function Layout({ children }: { children: React.ReactNode; }) {
    const { user } = await validateRequest();

    // check if there is a valid session, so a logged in user doesn't have to log in again
    // redirect returns never by default, so nothing below it will be rendered if we get redirected, 
    if (user) redirect("/dashboard");

    return <>{children}</>

}