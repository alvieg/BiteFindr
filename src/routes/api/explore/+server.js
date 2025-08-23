import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
dotenv.config();

export async function GET({ url }) {
	const API_KEY = process.env.SPOONACULAR_API_KEY;
	const limit = url.searchParams.get('limit') || 6
	try {
		const res = await fetch(
			`https://api.spoonacular.com/recipes/random?number=${limit}&apiKey=${API_KEY}`
		);
		if (!res.ok) throw new Error('Spoonacular fetch failed');
		const data = await res.json();

		const recipes = data.recipes.map((r) => ({
			id: r.id,
			title: r.title,
			image: r.image,
			readyInMinutes: r.readyInMinutes,
			servings: r.servings,
			diets: r.diets,
			dishTypes: r.dishTypes
		}));

		return json({ recipes });
	} catch (err) {
		console.error(err);
		return json({ error: err.message }, { status: 500 });
	}
}
