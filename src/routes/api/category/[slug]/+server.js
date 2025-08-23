import { json } from '@sveltejs/kit';

export async function GET({ params, url }) {
	const { slug } = params;
	const API_KEY = process.env.SPOONACULAR_API_KEY;

	if (!slug) {
		return json({ error: 'Missing category slug' }, { status: 400 });
	}

	// Map slugs -> Spoonacular filters
	const categoryMap = {
		breakfast: { type: 'breakfast' },
		lunch: { type: 'main course' },
		dinner: { type: 'main course' },
		dessert: { type: 'dessert' },
		vegetarian: { diet: 'vegetarian' },
		vegan: { diet: 'vegan' },
		glutenfree: { intolerances: 'gluten' },
		ketogenic: { diet: 'ketogenic' }
	};

	const filters = categoryMap[slug.toLowerCase()];
	if (!filters) {
		return json({ error: 'Unknown category' }, { status: 400 });
	}

	// allow optional ?number= query param
	const number = url.searchParams.get('number') || 12;

	// Build query string
	const qs = new URLSearchParams({
		apiKey: API_KEY,
		number: number,
		...filters
	}).toString();

	try {
		const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${qs}`);
		if (!response.ok) {
			throw new Error(`Spoonacular error: ${response.status}`);
		}

		const data = await response.json();

		// Shape results
		const recipes = data.results.map((r) => ({
			id: r.id,
			title: r.title,
			image: r.image
		}));

		return json({ category: slug, results: recipes, total: data.totalResults });
	} catch (err) {
		console.error(err);
		return json({ error: err.message }, { status: 500 });
	}
}
