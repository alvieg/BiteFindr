<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let recipes = [];
	let loading = true;
	let error = null;

	// read category slug from URL
	$: slug = $page.params.slug;

	onMount(async () => {
		try {
			loading = true;
			const res = await fetch(`/api/category/${slug}`);
			if (!res.ok) throw new Error('Failed to load recipes');
			const data = await res.json();
			recipes = data.results;
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{slug} Recipes - BiteFinder</title>
	<meta name="description" content="Explore {slug} recipes on BiteFinder." />
</svelte:head>

<div class="category-page">
	<h1 class="title">{slug.charAt(0).toUpperCase() + slug.slice(1)} Recipes</h1>

	{#if loading}
		<p class="loading">Loading recipes...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if recipes.length === 0}
		<p class="empty">No recipes found in this category.</p>
	{:else}
		<div class="recipes-grid">
			{#each recipes as recipe}
				<div class="recipe-card" on:click={() => (window.location.href = `/recipe/${recipe.id}`)}>
					<img src={recipe.image} alt={recipe.title} />
					<h2>{recipe.title}</h2>
					<p>{recipe.description}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.category-page {
		max-width: 1200px;
		margin: 2rem auto;
		padding: 0 16px;
	}

	.title {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 1.5rem;
		color: #2196f3;
		text-decoration: underline;
		text-decoration-color: pink;
		text-decoration-thickness: 2px;
		text-align: center;
	}

	.loading,
	.error,
	.empty {
		text-align: center;
		margin: 2rem 0;
		font-size: 1.2rem;
	}

	.recipes-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 20px;
	}

	.recipe-card {
		background: #fff;
		border: 1px solid #eee;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
		cursor: pointer;
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease;
		display: flex;
		flex-direction: column;
	}

	.recipe-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
	}

	.recipe-card img {
		width: 100%;
		height: 160px;
		object-fit: cover;
	}

	.recipe-card h2 {
		font-size: 1.2rem;
		margin: 0.5rem;
	}

	.recipe-card p {
		font-size: 0.9rem;
		color: #555;
		margin: 0.5rem;
		flex-grow: 1;
	}

	/* Mobile styles */
	@media (max-width: 768px) {
		.title {
			font-size: 1.5rem;
		}

		.recipes-grid {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		.recipe-card img {
			height: 200px;
		}

		.recipe-card h2 {
			font-size: 1rem;
		}

		.recipe-card p {
			font-size: 0.85rem;
		}
	}
</style>
