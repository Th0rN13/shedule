<script lang="ts">
	import type { Snippet } from 'svelte';

	interface PropType {
		label: string;
		title: string;
		onclick: () => void;
	}

	let { label, title, onclick }: PropType = $props();
</script>

<button class="icon-btn" {title} {onclick}>
	{label}
</button>

<style>
	.icon-btn {
		width: 26px;
		height: 26px;
		border: none;
		background: transparent;
		border-radius: 6px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 13px;
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.icon-btn:hover {
		background: var(--background);
	}
</style>
