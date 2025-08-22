import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
dotenv.config();

export async function GET({ url }) {
	const q = url.searchParams.get('q');
	const API_KEY = process.env.SPOONACULAR_API_KEY; // put your Spoonacular key in .env

	if (!q) {
		return json({ error: 'Missing query parameter ?q=' }, { status: 400 });
	}

	try {
		// 🔹 Spoonacular search endpoint
		const spoonUrl = new URL('https://api.spoonacular.com/recipes/complexSearch');
		spoonUrl.searchParams.append('query', q);
		spoonUrl.searchParams.append('number', '10'); // how many results
		spoonUrl.searchParams.append('addRecipeInformation', 'true'); // get full info
		spoonUrl.searchParams.append('apiKey', API_KEY);

		const response = await fetch(spoonUrl);

		if (!response.ok) {
			console.error('Spoonacular request failed', await response.text());
			return json({ error: 'Failed to fetch from Spoonacular' }, { status: 500 });
		}

		const data = await response.json();
		return json(data);
	} catch (err) {
		console.error(err);
		return json({ error: 'Server error' }, { status: 500 });
	}
}
