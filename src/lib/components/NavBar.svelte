<script>
	import { goto } from '$app/navigation';
	import SearchBar from '$lib/components/SearchBar.svelte';

	let menuOpen = false;

	const categories = [
		{ slug: 'breakfast', name: 'Breakfast' },
		{ slug: 'lunch', name: 'Lunch' },
		{ slug: 'dinner', name: 'Dinner' },
		{ slug: 'dessert', name: 'Dessert' },
		{ slug: 'vegetarian', name: 'Vegetarian' },
		{ slug: 'vegan', name: 'Vegan' },
		{ slug: 'glutenfree', name: 'Gluten Free' },
		{ slug: 'ketogenic', name: 'Keto' }
	];

	function goCategory(slug) {
		goto(`/category/${slug}`);
		menuOpen = false;
	}
</script>

<nav class="navbar">
	<div class="navbar-container">
		<div class="logo" on:click={() => goto('/')}>BiteFinder</div>

		<!-- Desktop Dropdown -->
		<div class="nav-links">
			<div class="dropdown">
				<button class="dropbtn">Categories ▾</button>
				<div class="dropdown-content">
					{#each categories as cat}
						<a on:click={() => goCategory(cat.slug)}>{cat.name}</a>
					{/each}
				</div>
			</div>
		</div>

		<SearchBar />

		<!-- Mobile Menu Toggle -->
		<button class="menu-toggle" on:click={() => (menuOpen = !menuOpen)}> ☰ </button>
	</div>

	<!-- Mobile Dropdown -->
	{#if menuOpen}
		<div class="mobile-menu">
			{#each categories as cat}
				<a on:click={() => goCategory(cat.slug)}>{cat.name}</a>
			{/each}
		</div>
	{/if}
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
		position: relative;
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

	/* Dropdown (desktop) */
	.nav-links {
		position: relative;
	}

	.dropdown {
		position: relative;
		display: inline-block;
	}

	.dropbtn {
		background: none;
		border: none;
		font-size: 1rem;
		cursor: pointer;
		padding: 8px;
	}

	.dropdown-content {
		display: none;
		position: absolute;
		background-color: #fff;
		min-width: 160px;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
		border: 1px solid #eee;
		border-radius: 6px;
		z-index: 1000;
	}

	.dropdown-content a {
		display: block;
		padding: 10px 14px;
		text-decoration: none;
		color: #333;
		cursor: pointer;
	}

	.dropdown-content a:hover {
		background-color: #f5f5f5;
	}

	.dropdown:hover .dropdown-content {
		display: block;
	}

	/* Mobile */
	.menu-toggle {
		display: none;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.mobile-menu {
		display: flex;
		flex-direction: column;
		background: #fff;
		border-top: 1px solid #ddd;
		padding: 10px;
	}

	.mobile-menu a {
		padding: 12px;
		border-bottom: 1px solid #eee;
		text-decoration: none;
		color: #333;
		cursor: pointer;
	}

	.mobile-menu a:last-child {
		border-bottom: none;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}
		.menu-toggle {
			display: block;
		}
	}
</style>
