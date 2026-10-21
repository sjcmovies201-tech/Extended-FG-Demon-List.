// Initialize Supabase client using credentials from config.js
if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
    const _supabase = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

    // Handle Sign Up Click
    document.getElementById('signup-btn')?.addEventListener('click', async () => {
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
        const messageEl = document.getElementById('auth-message');

        if (!email || !password) {
            messageEl.textContent = 'Please enter both email and password.';
            messageEl.style.color = 'orange';
            return;
        }

        const { data, error } = await _supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            messageEl.textContent = `Error: ${error.message}`;
            messageEl.style.color = 'red';
        } else {
            messageEl.textContent = 'Success! Check your email to confirm your account.';
            messageEl.style.color = 'green';
        }
    });

    // Handle Log In Click
    document.getElementById('login-btn')?.addEventListener('click', async () => {
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
        const messageEl = document.getElementById('auth-message');

        if (!email || !password) {
            messageEl.textContent = 'Please enter both email and password.';
            messageEl.style.color = 'orange';
            return;
        }

        const { data, error } = await _supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            messageEl.textContent = `Error: ${error.message}`;
            messageEl.style.color = 'red';
        } else {
            messageEl.textContent = 'Logged in successfully!';
            messageEl.style.color = 'green';
            // Optional: Redirect back to home page after login
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    });
}