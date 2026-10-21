-- Run this AFTER you created your account in Supabase
-- (Authentication -> Users -> Add user).
-- Change the email below to YOUR email, then click Run.
-- To make more admins later, run it again with their email.

insert into admins (user_id)
select id from auth.users where email = 'PUT-YOUR-EMAIL-HERE@example.com'
on conflict do nothing;
