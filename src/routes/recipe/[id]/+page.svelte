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

	let summary = recipe.summary || '';

	// Replace Spoonacular links with internal links to /recipes/[id]
	// Spoonacular URLs usually end with the recipe slug or ID, e.g., /recipes/chicken-soup-12345
	$: safeSummary = recipe.summary
		? recipe.summary.replace(
				/<a[^>]+href="https?:\/\/spoonacular\.com\/recipes\/([^"]+)"[^>]*>/g,
				(match, slug) => {
					const idMatch = slug.match(/-(\d+)$/);
					const id = idMatch ? idMatch[1] : slug;
					return `<a href="/recipes/${id}">`;
				}
			)
		: '';
</script>

{#if loading}
	<p class="status">Loading recipe...</p>
{:else if error}
	<p class="status error">Error: {error}</p>
{:else if recipe}
	<div class="recipe-layout">
		<!-- Main recipe content -->
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
					<button class="fav-btn remove" on:click={removeFromFavorites}>
						❌ Remove from Favorites
					</button>
				{:else}
					<button class="fav-btn add" on:click={addToFavorites}> ⭐ Add to Favorites </button>
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
				<p>{@html safeSummary}</p>
			{/if}
		</div>

		<!-- Right-side ad -->
		<div class="ad">
			<script
				async
				src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5746094822252420"
				crossorigin="anonymous"
			></script>
			<ins
				class="adsbygoogle"
				style="display:inline-block;width:160px;height:600px"
				data-ad-client="ca-pub-5746094822252420"
				data-ad-slot="4993741455"
			></ins>
			<script>
				(adsbygoogle = window.adsbygoogle || []).push({});
			</script>
		</div>
	</div>
{/if}

<style>
	/* Layout wrapper */
	.recipe-layout {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		gap: 2rem;
		margin: 2rem auto;
		max-width: 1100px;
	}

	/* Main recipe content */
	.recipe-detail {
		flex: 1;
		max-width: 800px;
		padding: 1rem;
		font-family: sans-serif;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background: #fafafa;
		border-radius: 8px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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

	/* Ad container */
	.ad {
		width: 160px;
		min-width: 160px;
		height: 600px;
		border: 1px solid #ddd;
		background: #fff;
		position: sticky;
		top: 6rem; /* 👈 this makes it stick when scrolling */
		z-index: 10000;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
	}

	/* Buttons */
	button.fav-btn {
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

	/* Status messages */
	.status {
		text-align: center;
		font-size: 1rem;
		margin: 12px 0;
	}
	.status.error {
		color: red;
	}
	.fav-msg {
		font-size: 0.9rem;
		color: green;
	}

	/* Typography */
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

	/* Mobile responsive */
	@media (max-width: 768px) {
		.recipe-layout {
			flex-direction: column;
			align-items: center;
		}
		.ad {
			margin-top: 1.5rem;
		}
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
