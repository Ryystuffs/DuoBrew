import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/layout/Sidebar";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user },} = await supabase.auth.getUser();

    if (!user){
        redirect("/login")
    }
    return (

        <div className="">
            <Sidebar />
            { children }
        </div>
    )
}