<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Recipe from '$lib/components/Recipe.svelte';

	let trending = [];
	let loading = true;
	let error = '';

	// Fetch trending recipes
	async function fetchTrending() {
		loading = true;
		error = '';
		try {
			const res = await fetch('/api/explore?limit=12');
			if (!res.ok) throw new Error('Failed to fetch trending recipes');
			const data = await res.json();
			trending = data.recipes || [];
		} catch (e) {
			error = e.message;
			console.error(e);
		} finally {
			loading = false;
		}
	}

	onMount(fetchTrending);

	const categories = [
		{ name: 'Breakfast', slug: 'breakfast' },
		{ name: 'Lunch', slug: 'lunch' },
		{ name: 'Dinner', slug: 'dinner' },
		{ name: 'Dessert', slug: 'dessert' },
		{ name: 'Vegetarian', slug: 'vegetarian' },
		{ name: 'Vegan', slug: 'vegan' }
	];
</script>

<div class="homepage">
	<!-- Hero -->
	<section
		class="hero"
		style="background: {trending.length > 0
			? `url(${trending[0].image}) center/cover no-repeat`
			: 'linear-gradient(135deg, #f8f8f8, #fafafa)'}"
	>
		<div class="overlay">
			<h1>Discover Delicious Recipes</h1>
			<p>Find trending dishes, search your favorites, or explore by category</p>
			<SearchBar />
		</div>
	</section>

	<!-- Categories -->
	<section class="categories">
		<h2>Explore by Category</h2>
		<div class="category-grid">
			{#each categories as cat}
				<a
					class="category-card"
					href={`/category/${cat.slug}`}
					on:click|preventDefault={() => goto(`/category/${cat.slug}`)}
				>
					{cat.name}
				</a>
			{/each}
		</div>
	</section>

	<!-- Trending Recipes -->
	<section class="trending">
		<h2>Trending Recipes</h2>
		{#if loading}
			<p>Loading...</p>
		{:else if error}
			<p class="error">Error: {error}</p>
		{:else if trending.length === 0}
			<p>No trending recipes right now.</p>
		{/if}

		<div class="grid">
			{#each trending as recipe}
				<Recipe data={recipe} />
			{/each}
		</div>
	</section>
</div>

<style>
	.hero {
		text-align: center;
		padding: 3rem 1rem;
		color: white;
		position: relative;
		min-height: 300px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 20px;
	}
	.hero .overlay {
		background: rgba(0, 0, 0, 0.4);
		padding: 2rem;
		border-radius: 12px;
	}
	.hero h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}
	.hero p {
		font-size: 1.2rem;
		margin-bottom: 1.5rem;
	}

	.categories {
		padding: 2rem 1rem;
		text-align: center;
	}
	.category-grid {
		display: grid;
		grid-template-columns: repeat(6, minmax(140px, 1fr));
		gap: 1rem;
		max-width: 800px;
		margin: 0 auto;
	}
	.category-card {
		background: #fff;
		padding: 1rem;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		text-decoration: none;
		color: #333;
		font-weight: 600;
		transition:
			transform 0.2s,
			background 0.2s;
	}
	.category-card:hover {
		transform: translateY(-3px);
		background: #fafafa;
	}

	.trending {
		padding: 2rem 1rem;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		justify-items: center;
	}
	.error {
		color: red;
		text-align: center;
	}
</style>
