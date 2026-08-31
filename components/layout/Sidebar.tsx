"use client"

import React from 'react'
import { logout, LogoutState } from '@/lib/actions/auth'
import { useActionState } from 'react'
import { } from "next/navigation" 
import { navItems } from '@/lib/config/navigation'
import { useUser } from '@/lib/hooks/use-user'

const initialState: LogoutState = {
    error: "",
};

const Sidebar = () => {
    const { role } = useUser();
    const [state, formAction, isPending] = useActionState(logout, initialState);
    if (!role) {
        return null;
    }
    const visibleNavItems = navItems.filter(item => item.role.includes(role)); // Replace "admin" with the actual user role
  return (
    <div>
        <nav>
            {visibleNavItems.map((item) => (
                <a key={item.href} href={item.href} className="block py-2 px-4 text-white hover:bg-neutral-800 rounded">
                    {item.label}
                </a>
            ))}
        </nav>
        <form action={formAction}>
            <button type="submit" disabled={isPending} className="text-white">
                {isPending ? "Signing out..." : "Sign out"}
            </button>
            <p>{state.error}</p>
        </form>
    </div>
  )
}

export default Sidebar