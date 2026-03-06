

CREATE POLICY "users_insert_own"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
