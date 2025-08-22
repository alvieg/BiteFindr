<script>
	import { goto } from '$app/navigation';
	export let placeholder = 'Search a recipe...';
	export let initialQuery = '';

	let query = initialQuery;

	const onSubmit = () => {
		if (!query) return;
		goto(`/search?q=${encodeURIComponent(query)}`);
	};
</script>

<form class="search-form" on:submit|preventDefault={onSubmit}>
	<input type="text" {placeholder} bind:value={query} class="search-input" />
	<button type="submit" class="search-button">Search</button>
</form>

<style>
	.search-form {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		max-width: 400px;
	}

	.search-input {
		flex: 1;
		padding: 8px 12px;
		border: 1px solid #ccc;
		border-radius: 6px;
		font-size: 1rem;
	}

	.search-input:focus {
		outline: none;
		border-color: #2196f3;
		box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
	}

	.search-button {
		padding: 8px 16px;
		border: none;
		border-radius: 6px;
		background-color: #2196f3;
		color: white;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.search-button:hover {
		background-color: #1976d2;
	}
</style>
