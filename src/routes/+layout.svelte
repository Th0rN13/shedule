<script lang="ts">
	import { page } from '$app/state';
	import '../app.css';

	let { children } = $props();
</script>

<main></main>
<div class="app-container">
	{@render children()}
</div>
