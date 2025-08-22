<script>
	import { goto } from '$app/navigation';
	import SearchBar from '$lib/components/SearchBar.svelte';
</script>

<nav class="navbar">
	<div class="navbar-container">
		<div class="logo" on:click={() => goto('/')}>BiteFinder</div>
		<SearchBar />
	</div>
</nav>

<style>
	.navbar {
		position: sticky;
		top: 0;
		z-index: 1000;
		background-color: #ffffff;
		border-bottom: 1px solid #ddd;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		padding: 0 16px;
	}

	.navbar-container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 60px;
	}

	.logo {
		font-size: 1.5rem;
		font-weight: bold;
		color: #2196f3;
		cursor: pointer;
		text-decoration: underline;
		text-decoration-color: pink;
		text-decoration-thickness: 1.5px;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.navbar-container {
			flex-direction: column;
			align-items: stretch;
			height: auto;
			padding: 8px 0;
		}
	}
</style>
