<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		// Remove user from localStorage
		localStorage.removeItem('user');

		// Redirect to home page
		goto('/');
		setTimeout(() => window.location.reload(), 1000)
	});
</script>

<p style="text-align:center; margin-top:2rem;">Logging out...</p>
