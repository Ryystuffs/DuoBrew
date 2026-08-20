CREATE OR REPLACE FUNCTION public.is_handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        name,
        role,
        active
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'cashier'),
        TRUE
    );
RETURN NEW;
END;  
$$;

DROP TRIGGER IF EXISTS on_auth_users_created ON auth.users;

CREATE TRIGGER on_auth_users_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.is_handle_new_user();