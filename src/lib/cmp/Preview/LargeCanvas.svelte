<script lang="ts">
	import background from '$lib/sapa_bg.png';
	import { CANVAS_CONFIG, dayTexts, slotAddTexts, slotNames } from '$lib/constants';
	import { configStore } from '$lib/stores/config';
	import { schedulesStore } from '$lib/stores/schedule';
	import { Stage, Layer, Image, Text } from 'svelte-konva';
	import { stageStore } from '$lib/stores/stage';
	import { CanvasService } from '$lib/services/CanvasService';
	import Grid from './Grid.svelte';

	let stage: Stage | undefined = $state();
	let image: HTMLImageElement | undefined = $state(undefined);

	$effect(() => {
		if (stage) {
			stageStore.updateLarge(stage);
		}
		const img = document.createElement('img');
		img.src = background;
		img.crossOrigin = 'Anonymous';
		img.onload = () => {
			image = img;
		};
	});

	const titleTextConfig = $derived(CanvasService.generateTitleConfig($configStore));
	const footNoteTextConfig = $derived(CanvasService.generateFootNoteConfig($configStore));
	const dayTextConfigs = $derived(CanvasService.generatDayTextConfigs($configStore));
	const slotConfigs = $derived(CanvasService.generatSlotTextConfigs($schedulesStore, $configStore));
	const daysOffConfigs = $derived(
		CanvasService.generatDaysOffTextConfigs($schedulesStore, $configStore)
	);

	function toggleModal() {
		configStore.toggleModal();
	}
</script>

<div class="wrap" onclick={toggleModal} onkeypress={toggleModal} role="button" tabindex="0">
	<Stage width={CANVAS_CONFIG.totalWidth} height={CANVAS_CONFIG.totalHeight} bind:this={stage}>
		<Layer>
			<Image {image} />
			<Text {...titleTextConfig} />
			<Text {...footNoteTextConfig} />
			{#each dayTextConfigs as textConfig, idx}
				<Text {...textConfig} />
			{/each}
			{#each slotConfigs as textConfig, idx}
				<Text {...textConfig} />
			{/each}

			{#each daysOffConfigs as dayOffTextConfig, idx}
				<Text {...dayOffTextConfig} rotation={-10} />
			{/each}
		</Layer>
	</Stage>
	<Grid />
</div>

<style>
	.wrap {
		width: 100%;
		height: 100%;
		position: relative;
		cursor: pointer;
	}
	:global(canvas) {
		position: relative !important;
		width: 100% !important;
		height: 100% !important;
	}

	:global(.konvajs-content) {
		height: unset !important;
		max-width: calc(90vw - 900px);
		max-height: calc(90vh);
	}
</style>
