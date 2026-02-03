<script lang="ts">
	import type { Snippet } from 'svelte';

	interface PropType {
		label: string;
		children: Snippet;
	}
	let { label, children }: PropType = $props();
</script>

<div class="control-group">
	<label class="control-label">
		<span>{label}</span>
		{@render children()}
	</label>
</div>

<style>
	.control-group {
		margin-bottom: 14px;
	}

	.control-label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 13px;
		font-weight: 500;
	}
</style>
