<script lang="ts">
	import background from '$lib/sapa_bg.png';
	import { CANVAS_CONFIG, dayTexts, slotAddTexts, slotNames } from '$lib/constants';
	import { configStore } from '$lib/stores/config';
	import { schedulesStore } from '$lib/stores/schedule';
	import { Stage, Layer, Image, Text } from 'svelte-konva';
	import { stageStore } from '$lib/stores/stage';
	import { CanvasService } from '$lib/services/CanvasService';

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
</script>

<div class="wrap">
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
	{#if $configStore.viewGrid}
		<div class="grid-wrap">
			<div class="grid grid-title"></div>
			<div class="grid grid-side"></div>
			<div class="grid grid-column1"></div>
			<div class="grid grid-column2"></div>
			<div class="grid grid-weekend"></div>
			<div class="grid grid-note"></div>
		</div>
	{/if}
</div>

<style>
	.wrap {
		width: 1920px;
		height: 1080px;
		position: relative;
	}
	.grid-wrap {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: grid;
		gap: 0px;
		grid-template-columns: 120px 1fr 120px 1fr 120px 480px;
		grid-template-rows: 200px 1fr 200px 100px;
	}
	.grid {
		box-sizing: border-box;
		border: 2px solid red;
	}
	.grid-title {
		grid-column: 1 / 6;
		grid-row: 1 / 2;
	}
	.grid-side {
		grid-column: 6 / 7;
		grid-row: 1 / 5;
	}
	.grid-column1 {
		grid-column: 2 / 3;
		grid-row: 2 / 3;
	}
	.grid-column2 {
		grid-column: 4 / 5;
		grid-row: 2 / 3;
	}
	.grid-weekend {
		grid-column: 2 / 5;
		grid-row: 3 / 4;
	}
	.grid-note {
		grid-column: 2 / 5;
		grid-row: 4 / 5;
	}
</style>
