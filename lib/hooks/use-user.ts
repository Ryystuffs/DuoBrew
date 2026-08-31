"use client"
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type UserRoles = "admin" | "manager" | "cashier";


export function useUser() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState<UserRoles | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        const fetchUser = async () => {
            const { data: {user}} = await supabase.auth.getUser();
                if (!user){
                    setUser(null);
                    setRole(null);
                    setLoading(false);
                    return
                }

                const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();
                
                setUser(user);
                setRole(profile?.role as UserRoles);
                setLoading(false);
        };
        fetchUser();
    }, []);

    return { user, role, loading };
}
