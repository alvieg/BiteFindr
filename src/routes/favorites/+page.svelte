<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let loggedInUser = null;
	let favorites = [];
	let message = '';

	onMount(() => {
		const user = localStorage.getItem('user');
		if (user) loggedInUser = JSON.parse(user);
		loadFavorites();
	});

	async function loadFavorites() {
		if (!loggedInUser) return;
		const res = await fetch(`/api/favorites?user_id=${loggedInUser.id}`);
		favorites = await res.json();
	}

	async function removeFavorite(id) {
		await fetch('/api/favorites', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});
		message = '✅ Favorite removed!';
		loadFavorites();
	}
</script>

<main>
	{#if !loggedInUser}
		<p>Please login first.</p>
	{:else}
		<h1>{loggedInUser.username}'s Favorites</h1>

		{#if message}
			<p class="status">{message}</p>
		{/if}

		{#if favorites.length === 0}
			<p>You don’t have any favorites yet.</p>
		{:else}
			<ul>
				{#each favorites as fav}
					<li>
						<div class="favorite-info" on:click={() => goto(`/recipe/${fav.external_recipe_id}`)}>
							<strong>{fav.title || fav.external_recipe_id}</strong>
							<small>ID: {fav.external_recipe_id}</small>
						</div>
						<button class="remove-btn" on:click|stopPropagation={() => removeFavorite(fav.id)}
							>Remove</button
						>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</main>

<style>
	main {
		max-width: 700px;
		margin: 2rem auto;
		padding: 2rem;
		background: #f9f9f9;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		font-family: Arial, sans-serif;
	}

	h1 {
		text-align: center;
		margin-bottom: 1rem;
		color: #333;
	}

	p {
		text-align: center;
		font-size: 1rem;
		color: #555;
	}

	.status {
		text-align: center;
		color: green;
		margin-bottom: 1rem;
	}

	ul {
		list-style: none;
		padding: 0;
		margin-top: 1rem;
	}

	li {
		background: white;
		padding: 1rem;
		margin-bottom: 1rem;
		border-radius: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
		cursor: pointer;
	}

	small {
		color: #777;
		margin-left: 0.5rem;
	}

	.favorite-info {
		display: flex;
		flex-direction: column;
	}

	.remove-btn {
		background: #dc3545;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.5rem 1rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	.remove-btn:hover {
		background: #c82333;
	}
</style>
