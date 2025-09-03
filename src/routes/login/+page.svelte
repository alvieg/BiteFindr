<script>
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let message = '';

	async function login() {
		const res = await fetch('/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		const data = await res.json();

		if (data.success) {
			// ✅ Save user info to localStorage
			localStorage.setItem('user', JSON.stringify(data.user));
			message = 'Logged in successfully!';
			// Optionally redirect to favorites page
			goto('/favorites');
			setTimeout(() => window.location.reload(), 1000);
		} else {
			message = '❌ ' + data.error;
		}
	}
</script>

<main>
	<h1>Login</h1>
	<p>{message}</p>
	<label>
		Email:
		<input type="email" placeholder="Email" bind:value={email} />
	</label>
	<label>
		Password
		<input type="password" placeholder="Password" bind:value={password} />
	</label>
	<button on:click={login}>Login</button>
</main>

<style>
	main {
		max-width: 400px;
		margin: 3rem auto;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		font-family: Arial, sans-serif;
	}

	input,
	button {
		width: 100%;
		padding: 0.7rem;
		margin: 0.5rem 0;
		border-radius: 8px;
		border: 1px solid #ccc;
		font-size: 1rem;
	}

	button {
		background: #28a745;
		color: white;
		border: none;
		cursor: pointer;
	}

	button:hover {
		background: #218838;
	}

	p {
		color: #555;
	}
</style>
