<script>
	import NavBar from '$lib/components/NavBar.svelte';
</script>

<!-- Sticky Navbar -->
<NavBar />

<!-- Page content -->
<main class="main-content">
	<slot />
</main>

<style>
	/* Main page padding */
	.main-content {
		padding: 16px;
		max-width: 1200px;
		margin: 0 auto;
	}

	/* Optional: add top margin so content doesn't hide behind navbar */
	body,
	html {
		margin-top: 6rem !important;
		margin: 0;
		padding: 0;
		font-family: sans-serif;
		background-color: #f9f9f9;
	}
</style>
