<script lang="ts">
	interface PropType {
		label: string;
	}

	const ICONS: Record<string, string> = {
		switch: '⇄',
		download: '⬇️',
		grid: '📐',
		picture: '🖼️',
		close: '✕'
	};

	let { label }: PropType = $props();
</script>

<span class="icon">
	{ICONS[label] || '❓'}
</span>

<style>
	.icon {
		font-size: 14px;
	}
</style>
