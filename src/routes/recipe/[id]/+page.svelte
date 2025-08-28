<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let recipe = {};
	let loading = true;
	let error = '';
	let favMessage = '';

	// get recipe id from route params
	let recipeId;
	$: recipeId = $page.params.id;

	let loggedInUser = null;
	let isFavorite = false;
	let favoriteRowId = null; // the UUID of the favorite in DB

	async function fetchRecipe() {
		if (!recipeId) return;

		loading = true;
		error = '';
		favMessage = '';

		try {
			const res = await fetch(`/api/recipe/${recipeId}`);
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Failed to fetch recipe');
			recipe = data;

			// check if already favorited
			if (loggedInUser) await checkFavorite();
		} catch (e) {
			error = e.message;
			console.error(e);
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		const user = localStorage.getItem('user');
		if (user) loggedInUser = JSON.parse(user);
		await fetchRecipe();
	});

	async function checkFavorite() {
		try {
			const res = await fetch(`/api/favorites?user_id=${loggedInUser.id}`);
			const favs = await res.json();
			const existing = favs.find((f) => f.external_recipe_id == recipeId);
			if (existing) {
				isFavorite = true;
				favoriteRowId = existing.id;
			} else {
				isFavorite = false;
				favoriteRowId = null;
			}
		} catch (e) {
			console.error(e);
		}
	}

	async function addToFavorites() {
		if (!loggedInUser) {
			favMessage = '❌ Please login to add favorites.';
			return;
		}

		try {
			const res = await fetch('/api/favorites', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					user_id: loggedInUser.id,
					external_recipe_id: recipeId,
					title: recipe.label
				})
			});
			const data = await res.json();
			if (data.success) {
				favMessage = '✅ Added to favorites!';
				isFavorite = true;
				await checkFavorite();
			} else {
				favMessage = '❌ ' + data.error;
			}
		} catch (e) {
			console.error(e);
			favMessage = '❌ Failed to add favorite.';
		}
	}

	async function removeFromFavorites() {
		if (!favoriteRowId) return;

		try {
			await fetch('/api/favorites', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: favoriteRowId })
			});
			favMessage = '✅ Removed from favorites!';
			setTimeout(() => (favMessage = null), 2000);
			isFavorite = false;
			favoriteRowId = null;
		} catch (e) {
			console.error(e);
			favMessage = '❌ Failed to remove favorite.';
			setTimeout(() => (favMessage = null), 2000);
		}
	}
</script>

{#if loading}
	<p class="status">Loading recipe...</p>
{:else if error}
	<p class="status error">Error: {error}</p>
{:else if recipe}
	<div class="recipe-detail">
		<h1>{recipe.label}</h1>

		{#if recipe.image}
			<img src={recipe.image} alt={recipe.label} class="recipe-image" />
		{/if}

		<div class="recipe-meta">
			{#if recipe.source}
				<p>Source: <a href={recipe.url} target="_blank">{recipe.source}</a></p>
			{/if}
			{#if recipe.yield}
				<p>Servings: {recipe.yield}</p>
			{/if}
			{#if recipe.readyInMinutes}
				<p>Time: {recipe.readyInMinutes} min</p>
			{/if}
			{#if recipe.diets?.length}
				<p>Diets: {recipe.diets.join(', ')}</p>
			{/if}
			{#if recipe.cuisines?.length}
				<p>Cuisines: {recipe.cuisines.join(', ')}</p>
			{/if}
		</div>

		{#if loggedInUser}
			{#if isFavorite}
				<button class="fav-btn remove" on:click={removeFromFavorites}
					>❌ Remove from Favorites</button
				>
			{:else}
				<button class="fav-btn add" on:click={addToFavorites}>⭐ Add to Favorites</button>
			{/if}
			{#if favMessage}<p class="fav-msg">{favMessage}</p>{/if}
		{/if}

		<h2>Ingredients</h2>
		<ul>
			{#each recipe.ingredients as ing}
				<li>{ing.amount} {ing.unit} {ing.name}</li>
			{/each}
		</ul>

		{#if recipe.instructions}
			<h2>Instructions</h2>
			<p>{@html recipe.instructions}</p>
		{/if}

		{#if recipe.summary}
			<h2>Summary</h2>
			<p>{@html recipe.summary}</p>
		{/if}
	</div>
{/if}

<style>
	button.fav-btn.add {
		background: #ff9800;
	}
	button.fav-btn.add:hover {
		background: #e68900;
	}
	button.fav-btn.remove {
		background: #dc3545;
	}
	button.fav-btn.remove:hover {
		background: #c82333;
	}

	.status {
		text-align: center;
		font-size: 1rem;
		margin: 12px 0;
	}

	.status.error {
		color: red;
	}

	.recipe-detail {
		max-width: 800px;
		margin: 2rem auto;
		padding: 1rem;
		font-family: sans-serif;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.recipe-image {
		width: 100%;
		height: auto;
		border-radius: 8px;
		object-fit: cover;
	}

	.recipe-meta p {
		margin: 4px 0;
		font-size: 0.9rem;
		color: #555;
	}

	button.fav-btn {
		background: #ff9800;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.7rem 1rem;
		font-weight: bold;
		cursor: pointer;
		width: fit-content;
		margin: 0.5rem 0;
		transition: background 0.2s;
	}

	button.fav-btn:hover {
		background: #e68900;
	}

	.fav-msg {
		font-size: 0.9rem;
		color: green;
	}

	h1 {
		margin: 0;
		font-size: 2rem;
	}

	h2 {
		margin: 1rem 0 0.5rem 0;
		font-size: 1.3rem;
	}

	ul {
		padding-left: 1.5rem;
	}

	li {
		margin-bottom: 4px;
	}

	a {
		color: #2196f3;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	@media (max-width: 480px) {
		.recipe-detail {
			padding: 0.5rem;
		}
		h1 {
			font-size: 1.5rem;
		}
		h2 {
			font-size: 1.1rem;
		}
		.recipe-meta p {
			font-size: 0.8rem;
		}
	}
</style>
