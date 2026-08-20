"use client"

import React from 'react'
import { logout, LogoutState } from '@/lib/actions/auth'
import { useActionState } from 'react'

const initialState: LogoutState = {
    error: "",
};

const Sidebar = () => {
    const [state, formAction, isPending] = useActionState(logout, initialState);
  return (
    <div>
        <form action={formAction} method="post">
            <button type="submit" disabled={isPending} className="text-white">
                {isPending ? "Signing out..." : "Sign out"}
            </button>
            <p>{state.error}</p>
        </form>
    </div>
  )
}

export default Sidebar