-- create profiles table

CREATE TABLE IF NOT EXISTS profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    name text not null,
    role text not null check ( role in ('admin', 'manager', 'cashier')),
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

--enable row level security

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

--function

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql  
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'
        AND active = true
    );
$$;
---policies

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
    id = auth.uid()
);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
    public.is_admin()
);

-- Admins can create profiles
CREATE POLICY "Admins can create profiles"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
    public.is_admin()
);

-- Admins can update profiles
CREATE POLICY "Admins can update profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
    public.is_admin()
)
WITH CHECK (
    public.is_admin()
);

-- Admins can delete profiles
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (
    public.is_admin()
);