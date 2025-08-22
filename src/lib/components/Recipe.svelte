<script>
	import { goto } from '$app/navigation';
	export let data = {};

	function openRecipe() {
		if (data.id) {
			goto(`/recipe/${data.id}`);
		}
	}
</script>

<div class="recipe-card" on:click={openRecipe} style="cursor: pointer;">
	{#if data.image}
		<img src={data.image} alt={data.title} class="recipe-image" />
	{/if}

	<h2 class="recipe-title">{data.title}</h2>

	{#if data.sourceName}
		<p class="recipe-source">Source: {data.sourceName}</p>
	{/if}

	<div class="recipe-details">
		{#if data.servings}
			<span class="badge">Servings: {data.servings}</span>
		{/if}
		{#if data.readyInMinutes}
			<span class="badge">Time: {data.readyInMinutes} min</span>
		{/if}
	</div>

	<div class="recipe-labels">
		{#each data.diets as label}
			<span class="label diet-label">{label}</span>
		{/each}
		{#each data.dishTypes as type}
			<span class="label health-label">{type}</span>
		{/each}
	</div>

	<p class="recipe-link">View Recipe →</p>
</div>

<style>
	.recipe-card {
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 16px;
		width: 280px;
		background-color: #fff;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-family: sans-serif;
		transition: transform 0.2s ease;
	}

	.recipe-card:hover {
		transform: scale(1.05);
	}

	.recipe-image {
		width: 100%;
		height: 160px;
		object-fit: cover;
		border-radius: 6px;
	}

	.recipe-title {
		font-size: 1.2rem;
		font-weight: bold;
		margin: 0;
	}

	.recipe-source {
		font-size: 0.85rem;
		color: #666;
		margin: 0;
	}

	.recipe-details {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.badge {
		background-color: #eee;
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.75rem;
	}

	.recipe-labels {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.label {
		font-size: 0.7rem;
		padding: 2px 6px;
		border-radius: 4px;
		color: #fff;
	}

	.diet-label {
		background-color: #4caf50;
	}

	.health-label {
		background-color: #9c27b0;
	}

	.recipe-link {
		margin-top: auto;
		text-decoration: none;
		color: #2196f3;
		font-weight: bold;
		font-size: 0.9rem;
	}

	.recipe-link:hover {
		text-decoration: underline;
	}

	/* Mobile responsiveness */
	@media (max-width: 480px) {
		.recipe-card {
			width: 90%;
			padding: 12px;
		}

		.recipe-image {
			height: 140px;
		}

		.recipe-title {
			font-size: 1.1rem;
		}

		.recipe-source {
			font-size: 0.8rem;
		}

		.badge {
			font-size: 0.65rem;
			padding: 2px 4px;
		}

		.label {
			font-size: 0.6rem;
			padding: 1px 4px;
		}

		.recipe-link {
			font-size: 0.8rem;
		}
	}
</style>
