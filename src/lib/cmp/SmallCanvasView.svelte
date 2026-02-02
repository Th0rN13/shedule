<script lang="ts">
	import background from '$lib/sapa_bg.png';
	import { slotShortAddTexts, TOTAL_SCHEDULE_ITEMS } from '$lib/constants';
	import { configStore } from '$lib/stores/config';
	import { schedulesStore } from '$lib/stores/schedule';
	import { Stage, Layer, Image, Text } from 'svelte-konva';

	let stageSmall: Stage | undefined = $state();
	let image: HTMLImageElement | undefined = $state(undefined);

	$effect(() => {
		const img = document.createElement('img');
		img.src = background;
		img.crossOrigin = 'Anonymous';
		img.onload = () => {
			image = img;
			// imageSmall = img;
		};
	});

	let smallLineHeight: number = $derived.by(() => {
		let count = $schedulesStore.filter((el) => el.enabled).length;
		if (count < 3) {
			return 140;
		}
		return Math.floor((TOTAL_SCHEDULE_ITEMS * 30) / count);
	});

	const defaultTextConfig = $derived({
		fontSize: 30,
		padding: 0,
		fontFamily: 'Gilroy-Bold',
		fill: $configStore.textColor,
		shadowColor: 'white',
		shadowBlur: 10,
		shadowOpacity: 1,
		shadowEnabled: true,
		wrap: 'none',
		ellipsis: true
	});

	const titleSmallTextConfig = $derived({
		...defaultTextConfig,
		text: 'Расписание',
		fontSize: 30,
		x: 0,
		y: 0,
		height: 100,
		width: 400,
		align: 'center',
		verticalAlign: 'middle'
	});

	const smallTextConfigsConst = $derived.by(() => {
		let texts = slotShortAddTexts.filter((_, idx) => $schedulesStore[idx].enabled);

		return texts.map((el, idx) => {
			let x = 20;
			let y = 100 + idx * smallLineHeight;
			return {
				...defaultTextConfig,
				fontSize: 22,
				fill: $configStore.textColor,
				text: el,
				align: 'left',
				width: 100,
				x,
				y
			};
		});
	});

	const smallTextConfigs = $derived.by(() => {
		let texts = $schedulesStore.filter((e) => e.enabled);

		return texts.map((el, idx) => {
			let x = 140;
			let y = 100 + idx * smallLineHeight;
			return {
				...defaultTextConfig,
				fontSize: 22,
				fill: $configStore.textColor,
				text: el.text,
				align: 'left',
				width: 240,
				x,
				y
			};
		});
	});
</script>

<div class="wrap">
	<Stage width={400} height={550} bind:this={stageSmall}>
		<Layer>
			<Image {image} x={-700} y={-50} />
			<Text {...titleSmallTextConfig} />
			{#each smallTextConfigsConst as textConfig, idx}
				<Text {...textConfig} />
			{/each}
			{#each smallTextConfigs as textConfig, idx}
				<Text {...textConfig} />
			{/each}
		</Layer>
	</Stage>
</div>
