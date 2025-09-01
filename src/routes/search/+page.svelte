<script>
	import { page } from '$app/stores';
	import Recipe from '$lib/components/Recipe.svelte';
	import SearchAd from '$lib/components/SearchAd.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';

	let error = '';
	let loading = false;
	let results = [];
	let searchQuery = '';

	// reactive query param
	$: query = $page.url.searchParams.get('q');

	async function getResults() {
		if (!query) {
			results = [];
			return;
		}
		loading = true;
		try {
			const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
			const data = await res.json();

			// ✅ Spoonacular shape
			results = data.results || [];
			results.splice(3, 0, 'ad')
			results.splice(8, 0, 'ad')
		} catch (e) {
			error = e.message;
			console.error(e);
		} finally {
			loading = false;
		}
	}

	// run whenever query changes
	$: if (query !== undefined) {
		getResults();
		searchQuery = query; // keep input synced
	}

	function submitSearch(event) {
		event.preventDefault();
		const url = new URL(window.location.href);
		url.searchParams.set('q', searchQuery);
		window.history.replaceState({}, '', url);
		getResults();
	}
</script>

<!-- Search Form -->
<div class="search">
	<form on:submit={submitSearch} style="width:100%">
		<SearchBar initialQuery={searchQuery} />
	</form>
</div>

<!-- Status -->
{#if loading}
	<p class="status">Loading recipes...</p>
{:else if error}
	<p class="status error">Error: {error}</p>
{:else if results.length === 0 && query}
	<p class="status">No recipes found for "{query}"</p>
{/if}

<!-- Results Grid -->
<div class="grid">
	{#each results as recipe}
		{#if recipe === 'ad'}
			<SearchAd />
		{:else}
			<Recipe data={recipe} />
		{/if}
	{/each}
</div>

<style>
	/* --- Search Bar --- */
	.search {
		display: flex;
		justify-content: center;
		margin: 2rem 0 1rem 0;
		width: 100%;
	}

	/* --- Status Messages --- */
	.status {
		text-align: center;
		font-size: 1rem;
		margin: 12px 0;
	}

	.status.error {
		color: red;
	}

	/* --- Results Grid --- */
	.grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 280px));
		gap: 2rem 4rem;
		padding: 16px;
		justify-items: center;
		justify-content: center;
	}

	:global(main) {
		position: relative;
	}

	@media (max-width: 768px) {
		.search {
			margin: 1.5rem 0;
			padding: 0 12px;
		}
		.grid {
			grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
			gap: 1.5rem 2rem;
			padding: 12px;
		}
	}

	@media (max-width: 480px) {
		.search {
			margin: 1rem 0;
		}
		.grid {
			grid-template-columns: 1fr;
			gap: 1rem;
			padding: 8px;
		}
	}
</style>
