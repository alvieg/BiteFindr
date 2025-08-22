<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let recipe = {};
	let loading = true;
	let error = '';

	// get recipe id from route params
	let recipeId;
	$: recipeId = $page.params.id

	async function fetchRecipe() {
		if (!recipeId) return;

		loading = true;
		error = '';

		try {
			const res = await fetch(`/api/recipe/${recipeId}`);
			if (!res.ok) throw new Error(`Failed to fetch recipe`);
			recipe = await res.json();
		} catch (e) {
			error = e.message;
			console.error(e);
		} finally {
			loading = false;
		}
	}

	onMount(fetchRecipe);
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

	/* Mobile responsiveness */
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
