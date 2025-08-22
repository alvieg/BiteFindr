import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
dotenv.config();

export async function GET({ params }) {
	const { id } = params;
	const API_KEY = process.env.SPOONACULAR_API_KEY;

	if (!id) {
		return json({ error: 'Missing recipe id' }, { status: 400 });
	}

	try {
		const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`;

		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Spoonacular error: ${response.status}`);
		}

		const data = await response.json();

		// shape into cleaner format
		const recipe = {
			id: data.id,
			label: data.title,
			image: data.image,
			source: data.sourceName,
			url: data.sourceUrl,
			yield: data.servings,
			readyInMinutes: data.readyInMinutes,
			cuisines: data.cuisines || [],
			dishTypes: data.dishTypes || [],
			diets: data.diets || [],
			ingredients: data.extendedIngredients?.map((i) => ({
				id: i.id,
				name: i.name,
				amount: i.amount,
				unit: i.unit
			})) || [],
			instructions: data.instructions || null,
			summary: data.summary || ''
		};

		return json(recipe);
	} catch (err) {
		console.error(err);
		return json({ error: err.message }, { status: 500 });
	}
}
