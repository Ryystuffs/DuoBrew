import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type UserRoles = "admin" | "manager" | "cashier";

export async function requiredRole(...allowedRoles: UserRoles[]) {
    const cookiesStore = await cookies();
    const supabase = createClient(cookiesStore);
    const {data: { user }, error: userError} = await supabase.auth.getUser();

    if (userError || !user){
        redirect("/login");
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
    
    if (profileError || !profile) {
        redirect("/login");
    }

     const role = profile.role as UserRoles;

    if (!allowedRoles.includes(role)) {
        redirect("/pos");
    }

    return { user, role};
    

}