<script>
	let username = '';
	let email = '';
	let password = '';
	let message = '';

	async function signup() {
		const res = await fetch('/api/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, email, password })
		});

		const data = await res.json();

		if (data.success) {
			// Save user info to localStorage
			const user = { username, email }; // your API does not return the ID; you could fetch it if needed
			localStorage.setItem('user', JSON.stringify(user));
			message = '✅ Signed up successfully!';

			// Redirect to favorites
			window.location.href = '/favorites';
		} else {
			message = '❌ ' + data.error;
		}
	}
</script>

<main>
	<h1>Signup</h1>
	<p>{message}</p>
	<label>
		Username:
		<input placeholder="Username" bind:value={username} />
	</label>
	<label>
		Email:
		<input placeholder="Email" type="email" bind:value={email} />
	</label>
	<label>
		Password:
		<input placeholder="Password" type="password" bind:value={password} />
	</label>
	<button on:click={signup}>Signup</button>
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
