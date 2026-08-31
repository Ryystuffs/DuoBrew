CREATE TABLE public.system_config (
    key text PRIMARY KEY,
    value text,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.system_config (key, value) 
VALUES ('setup_completed', 'true')