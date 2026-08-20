"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/schemas/auth";

export type LoginState = {
  errors?: { email?: string[]; password?: string[] };
  message?: string;
};
export type LogoutState = {
        error?: string;
    };

export async function login (prevState: LoginState, formData: FormData): Promise<LoginState> {
    const credentials = Object.fromEntries(formData.entries());
    const validatedFields = loginSchema.safeParse(credentials);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please check your inputs and try again"
        };
    }

    const { email, password} = validatedFields.data;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    if (error) {
        return { message: error.message }
    }
    console.log("Login successful");
    redirect("/");
}

export async function logout(prevState: LogoutState) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signOut();
    if (error) {
        return { error: error.message }
    }

    redirect("/login");
}