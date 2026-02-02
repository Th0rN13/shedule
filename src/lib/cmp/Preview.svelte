<script lang="ts">
	import font from '$lib/Gilroy-Bold.woff';
	import background from '$lib/sapa_bg.png';
	import { configStore } from '$lib/stores/config';
	import { schedulesStore } from '$lib/stores/schedule';
	import { chunks } from '$lib/utils';
	import { Stage, Layer, Image, Text, Transformer } from 'svelte-konva';
	import {
		CANVAS_CONFIG,
		slotAddTexts,
		slotNames,
		slotShortAddTexts,
		TOTAL_SCHEDULE_ITEMS
	} from '$lib/constants';

	let stage: Stage | undefined = $state();
	let stageSmall: Stage | undefined = $state();
	let image: HTMLImageElement | undefined = $state(undefined);
	let imageSmall: HTMLImageElement | undefined = $state(undefined);

	$effect(() => {
		const img = document.createElement('img');
		img.src = background;
		img.crossOrigin = 'Anonymous';
		img.onload = () => {
			image = img;
			imageSmall = img;
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

	const titleTextConfig = $derived({
		...defaultTextConfig,
		text: '*Расписание',
		fontSize: 60,
		x: $configStore.centerTextOffset,
		y: 0,
		height: CANVAS_CONFIG.titleLineHeight,
		width: CANVAS_CONFIG.totalWidth - CANVAS_CONFIG.rightBorderWidth,
		align: 'center',
		verticalAlign: 'middle'
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

	const noteTextConfig = $derived({
		...defaultTextConfig,
		text: '* - расписание может меняться',
		x: CANVAS_CONFIG.columnGap,
		y: CANVAS_CONFIG.totalHeight - CANVAS_CONFIG.titleLineHeight,
		height: CANVAS_CONFIG.titleLineHeight,
		width: CANVAS_CONFIG.totalWidth - CANVAS_CONFIG.rightBorderWidth,
		align: 'left',
		verticalAlign: 'bottom'
	});

	const daysOff = $derived.by(() => {
		let result = [...chunks($schedulesStore, 2)].map((day) => day.every((slot) => !slot.enabled));
		return result;
	});

	const constantTextConfigs = $derived(
		slotNames.map((el, idx) => {
			let x = CANVAS_CONFIG.columnGap;
			if (idx >= 3) {
				x += CANVAS_CONFIG.columnWidth + CANVAS_CONFIG.columnGap;
			}
			if (idx >= 6) {
				x = CANVAS_CONFIG.columnGap + $configStore.centerTextOffset;
			}
			let y = CANVAS_CONFIG.titleLineHeight;
			if (idx >= 6) {
				y = CANVAS_CONFIG.titleLineHeight + CANVAS_CONFIG.textLineHeight * 9;
			} else {
				y = CANVAS_CONFIG.titleLineHeight + (idx % 3) * (CANVAS_CONFIG.textLineHeight * 3);
			}
			return {
				...defaultTextConfig,
				fontSize: 36,
				text: el,
				align: idx >= 6 ? 'center' : 'left',
				width:
					idx >= 6
						? CANVAS_CONFIG.columnWidth * 2 + CANVAS_CONFIG.columnGap
						: CANVAS_CONFIG.columnWidth,
				x,
				y
			};
		})
	);

	const textConfigs = $derived(
		slotNames.map((el, idx) => {
			let x = CANVAS_CONFIG.columnGap;
			if (idx >= 6) {
				x += CANVAS_CONFIG.columnWidth + CANVAS_CONFIG.columnGap;
			}
			if (idx >= 12) {
				x = CANVAS_CONFIG.columnGap + $configStore.centerTextOffset;
			}
			let y = CANVAS_CONFIG.titleLineHeight;
			if (idx >= 12) {
				y = CANVAS_CONFIG.titleLineHeight + CANVAS_CONFIG.textLineHeight * (10 + idx - 12);
			} else {
				const add = Math.floor((idx % 6) / 2) + 1;
				y = CANVAS_CONFIG.titleLineHeight + ((idx % 6) + add) * CANVAS_CONFIG.textLineHeight;
			}
			return {
				...defaultTextConfig,
				fill: $configStore.textColor,
				text: slotAddTexts[idx] + $schedulesStore[idx].text,
				align: idx >= 12 ? 'center' : 'left',
				width:
					idx >= 12
						? CANVAS_CONFIG.columnWidth * 2 + CANVAS_CONFIG.columnGap
						: CANVAS_CONFIG.columnWidth,
				x,
				y
			};
		})
	);

	const dayOfftextConfigs = $derived(
		daysOff
			.map((el, idx) => {
				let x = CANVAS_CONFIG.columnGap - 40;
				if (idx >= 3) {
					x += CANVAS_CONFIG.columnWidth + CANVAS_CONFIG.columnGap;
				}
				if (idx >= 6) {
					x = CANVAS_CONFIG.columnGap + $configStore.centerTextOffset;
				}
				let y = CANVAS_CONFIG.titleLineHeight;
				if (idx >= 6) {
					y = CANVAS_CONFIG.titleLineHeight + (3 * 3 + 2) * CANVAS_CONFIG.textLineHeight;
				} else {
					y = CANVAS_CONFIG.titleLineHeight + ((idx % 3) * 3 + 1) * CANVAS_CONFIG.textLineHeight;
				}
				return {
					...defaultTextConfig,
					fill: $configStore.textColor,
					text: el ? '✨ ВЫХОДНОЙ' : '',
					fontSize: 50,
					align: 'center',
					verticalAlign: 'middle',
					height: CANVAS_CONFIG.textLineHeight * 2 + 30,
					width:
						idx >= 6
							? CANVAS_CONFIG.columnWidth * 2 + CANVAS_CONFIG.columnGap
							: CANVAS_CONFIG.columnWidth,
					x,
					y
				};
			})
			.filter((el) => el.text !== '')
	);

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

<!-- Main Preview Area -->
<main class="preview-area">
	<div class="preview-header">
		<h2>Предпросмотр расписания</h2>
		<button class="btn btn-secondary" id="showPreviewModal">
			<span class="icon">🖼️</span>
			Посмотреть полный размер
		</button>
	</div>
	<div class="preview-container">
		<div class="canvas-wrapper" id="canvasWrapper">
			<canvas id="previewCanvas" width="1920" height="1080"></canvas>
			<div class="grid-overlay" id="gridOverlay" style="display: none">
				<div class="grid-cell grid-top"></div>
				<div class="grid-cell grid-right"></div>
				<div class="grid-cell grid-left"></div>
				<div class="grid-cell grid-center-left"></div>
				<div class="grid-cell grid-bottom"></div>
				<div class="grid-cell grid-footer"></div>
			</div>
		</div>
	</div>
</main>

<div>
	<!-- <div>
			{#each daysName as name, idx}
				<label class="row">
					<span>{name}</span>
					<input type="text" bind:value={daysText[idx]} />
					<button onclick={() => (daysToggle[idx] = !daysToggle[idx])}>
						{#if daysToggle[idx]}
							✅
						{:else}
							❌
						{/if}
					</button>

					<button onclick={() => (daysText[idx] = '')}> 🗑️ </button>
				</label>
			{/each}
		</div> -->

	{#if $configStore.viewCanvas}
		<div class="wrap">
			<Stage width={CANVAS_CONFIG.totalWidth} height={CANVAS_CONFIG.totalHeight} bind:this={stage}>
				<Layer>
					<Image {image} />
					<Text {...titleTextConfig} />
					<Text {...noteTextConfig} />
					{#each dayOfftextConfigs as dayOffTextConfig, idx}
						<Text {...dayOffTextConfig} rotation={-10} />
					{/each}
					{#each textConfigs as textConfig, idx}
						{#if $schedulesStore[idx].enabled}
							<Text {...textConfig} />
						{/if}
					{/each}
					{#each constantTextConfigs as textConfig, idx}
						<Text {...textConfig} />
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
	{/if}

	<div class="wrap2">
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

	@font-face {
		font-family: 'Gilroy-Bold';
		font-style: normal;
		font-weight: 400;
		src:
			local('Gilroy-Bold'),
			url('$lib/Gilroy-Bold.woff') format('woff');
	}
</style>
