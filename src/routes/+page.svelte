<script lang="ts">
	import background from '$lib/sapa_bg.png';
	import font from '$lib/Gilroy-Bold.woff';
	import { Stage, Layer, Image, Text, Transformer } from 'svelte-konva';
	import RangeSlider from 'svelte-range-slider-pips';

	let viewCanvas = $state(true);
	let viewGrid = $state(false);
	let stage: Stage | undefined = $state();
	let stageSmall: Stage | undefined = $state();
	let image: HTMLImageElement | undefined = $state(undefined);
	let imageSmall: HTMLImageElement | undefined = $state(undefined);

	$effect(() => {
		viewGrid = viewCanvas;
	});

	type localStorageData = {
		daysText: Array<string>;
		daysToggle: Array<boolean>;
		centerOffset: number;
		textColor: string;
	};

	function loadLocalStorage(): localStorageData {
		let data = localStorage.shedule;
		let tempText: Array<string> = Array.from({ length: 14 }).map(() => '');
		let tempToggle: Array<boolean> = Array.from({ length: 14 }).map(() => true);

		let result: localStorageData = {
			daysText: tempText,
			daysToggle: tempToggle,
			centerOffset: data?.centerOffset ?? 0,
			textColor: data?.textColor ?? '#000000'
		};
		try {
			let raw = JSON.parse(data);
			result = {
				daysText: raw?.daysText ?? tempText,
				daysToggle: raw?.daysToggle ?? tempToggle,
				centerOffset: raw?.centerOffset ?? 0,
				textColor: raw?.textColor ?? '#000000'
			};
		} catch (e) {
			console.warn('Error parsing old data');
		}
		return result;
	}

	const savedData: localStorageData = loadLocalStorage();

	const daysName = [
		'Понедельник, 9:00',
		'Понедельник, 19:00',
		'Вторник, 9:00',
		'Вторник, 19:00',
		'Среда, 9:00',
		'Среда, 19:00',
		'Четверг, 9:00',
		'Четверг, 19:00',
		'Пятница, 9:00',
		'Пятница, 19:00',
		'Суббота, 10:00',
		'Суббота, 19:00',
		'Воскресенье, 10:00',
		'Воскресенье, 19:00'
	];
	const addText = [
		'9:00 - ',
		'19:00 - ',
		'9:00 - ',
		'19:00 - ',
		'9:00 - ',
		'19:00 - ',
		'9:00 - ',
		'19:00 - ',
		'9:00 - ',
		'19:00 - ',
		'10:00 - ',
		'19:00 - ',
		'10:00 - ',
		'19:00 - '
	];
	const constantTexts = [
		'Понедельник',
		'Вторник',
		'Среда',
		'Четверг',
		'Пятница',
		'Суббота',
		'Воскресенье'
	];
	const smallAddText = [
		'Пн 09:00',
		'Пн 19:00',
		'Вт 09:00',
		'Вт 19:00',
		'Ср 09:00',
		'Ср 19:00',
		'Чт 09:00',
		'Чт 19:00',
		'Пт 09:00',
		'Пт 19:00',
		'Сб 10:00',
		'Сб 19:00',
		'Вс 10:00',
		'Вс 19:00'
	];

	let daysText: Array<string> = $state(savedData?.daysText || daysName.map((_) => ''));
	let daysToggle: Array<boolean> = $state(savedData?.daysToggle || daysName.map((_) => true));
	let centerOffset: number = $state(savedData?.centerOffset || 0);
	let textColor: string = $state(savedData?.textColor || '#000000');

	function toggleView() {
		viewCanvas = !viewCanvas;
	}

	function toggleGrid() {
		viewGrid = !viewGrid;
	}

	$effect(() => {
		localStorage.shedule = JSON.stringify({
			daysText,
			daysToggle,
			centerOffset,
			color: textColor
		});
	});

	$effect(() => {
		const img = document.createElement('img');
		img.src = background;
		img.crossOrigin = 'Anonymous';
		img.onload = () => {
			image = img;
			imageSmall = img;
		};
	});

	setTimeout(() => {
		textColor = '#000000';
	}, 2000);

	const totalWidth = 1920;
	const totalHeight = 1080;
	const rightBorderWidth = 480;
	const columngGap = 120;
	const columnWidth = (totalWidth - rightBorderWidth - columngGap * 3) / 2;
	const textLineHeight = 67;
	const titleLineHeight = 200;

	let smallLineHeight: number = $derived.by(() => {
		let count = daysToggle.filter((el) => el).length;
		if (count < 3) {
			return 140;
		}
		return Math.floor((14 * 30) / count);
	});

	const defaultTextConfig = $derived({
		fontSize: 30,
		padding: 0,
		fontFamily: 'Gilroy-Bold',
		fill: textColor,
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
		x: centerOffset,
		y: 0,
		height: titleLineHeight,
		width: totalWidth - rightBorderWidth,
		align: 'center',
		verticalAlign: 'middle'
	});

	const dayOffTextConfig = $derived({
		...defaultTextConfig,
		text: 'ВЫХОДНОЙ',
		fontSize: 56,
		x: 600,
		y: 200,
		height: titleLineHeight,
		width: columnWidth,
		align: 'center',
		rotation: 20,
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
		x: columngGap,
		y: totalHeight - titleLineHeight,
		height: titleLineHeight,
		width: totalWidth - rightBorderWidth,
		align: 'left',
		verticalAlign: 'bottom'
	});

	function* chunks(arr: Array<any>, n: number) {
		for (let i = 0; i < arr.length; i += n) {
			yield arr.slice(i, i + n);
		}
	}

	const daysOff = $derived.by(() => {
		let result = [...chunks(daysToggle, 2)].map((day) => day.every((stream) => !stream));
		return result;
	});

	const constantTextConfigs = $derived(
		constantTexts.map((el, idx) => {
			let x = columngGap;
			if (idx >= 3) {
				x += columnWidth + columngGap;
			}
			if (idx >= 6) {
				x = columngGap + centerOffset;
			}
			let y = titleLineHeight;
			if (idx >= 6) {
				y = titleLineHeight + textLineHeight * 9;
			} else {
				y = titleLineHeight + (idx % 3) * (textLineHeight * 3);
			}
			return {
				...defaultTextConfig,
				fontSize: 36,
				text: el,
				align: idx >= 6 ? 'center' : 'left',
				width: idx >= 6 ? columnWidth * 2 + columngGap : columnWidth,
				x,
				y
			};
		})
	);

	const textConfigs = $derived(
		daysName.map((el, idx) => {
			let x = columngGap;
			if (idx >= 6) {
				x += columnWidth + columngGap;
			}
			if (idx >= 12) {
				x = columngGap + centerOffset;
			}
			let y = titleLineHeight;
			if (idx >= 12) {
				y = titleLineHeight + textLineHeight * (10 + idx - 12);
			} else {
				const add = Math.floor((idx % 6) / 2) + 1;
				y = titleLineHeight + ((idx % 6) + add) * textLineHeight;
			}
			return {
				...defaultTextConfig,
				fill: textColor,
				text: addText[idx] + daysText[idx],
				align: idx >= 12 ? 'center' : 'left',
				width: idx >= 12 ? columnWidth * 2 + columngGap : columnWidth,
				x,
				y
			};
		})
	);

	const dayOfftextConfigs = $derived(
		daysOff
			.map((el, idx) => {
				let x = columngGap - 40;
				if (idx >= 3) {
					x += columnWidth + columngGap;
				}
				if (idx >= 6) {
					x = columngGap + centerOffset;
				}
				let y = titleLineHeight;
				if (idx >= 6) {
					// y = titleLineHeight + textLineHeight * (10 + idx - 6);
					y = titleLineHeight + (3 * 3 + 2) * textLineHeight;
				} else {
					y = titleLineHeight + ((idx % 3) * 3 + 1) * textLineHeight;
				}
				return {
					...defaultTextConfig,
					fill: textColor,
					text: el ? '✨ ВЫХОДНОЙ' : '',
					fontSize: 50,
					align: 'center',
					verticalAlign: 'middle',
					height: textLineHeight * 2 + 30,
					width: idx >= 6 ? columnWidth * 2 + columngGap : columnWidth,
					x,
					y
				};
			})
			.filter((el) => el.text !== '')
	);

	const smallTextConfigsConst = $derived.by(() => {
		let texts = smallAddText.map((e) => e).filter((_, idx) => daysToggle[idx]);
		return texts.map((el, idx) => {
			let x = 20;
			let y = 100 + idx * smallLineHeight;
			return {
				...defaultTextConfig,
				fontSize: 22,
				fill: textColor,
				text: el,
				align: 'left',
				width: 100,
				x,
				y
			};
		});
	});

	const smallTextConfigs = $derived.by(() => {
		let texts = daysText.map((e) => e).filter((_, idx) => daysToggle[idx]);

		return texts.map((el, idx) => {
			let x = 140;
			let y = 100 + idx * smallLineHeight;
			return {
				...defaultTextConfig,
				fontSize: 22,
				fill: textColor,
				text: el,
				align: 'left',
				width: 240,
				x,
				y
			};
		});
	});

	function download() {
		stage!.node.toDataURL({
			callback(img: string) {
				let downloadLink = document.createElement('a');
				let url = img.replace(/^data:image\/png/, 'data:application/octet-stream');
				downloadLink.setAttribute('download', 'Shedule.png');

				downloadLink.setAttribute('href', url);
				downloadLink.target = '_self';
				downloadLink.click();
			}
		});
	}

	function downloadSmall() {
		stageSmall!.node.toDataURL({
			callback(img: string) {
				let downloadLink = document.createElement('a');
				let url = img.replace(/^data:image\/png/, 'data:application/octet-stream');
				downloadLink.setAttribute('download', 'Shedule_small.png');

				downloadLink.setAttribute('href', url);
				downloadLink.target = '_self';
				downloadLink.click();
			}
		});
	}
</script>

<div>
	<button onclick={toggleView}>Показать изображение</button>
	<button onclick={toggleGrid}>Показать сетку</button>
	<button onclick={download}>Скачать большое</button>
	<button onclick={downloadSmall}>Скачать маленькое</button>
</div>

<div>
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
</div>

<label>
	<span> Цвет текста </span>
	<input type="color" name="color" bind:value={textColor} />
</label>

<label>
	<span> Сдвиг центрального текста </span>
	<RangeSlider bind:value={centerOffset} min={-400} max={100} float></RangeSlider>
</label>

{#if viewCanvas}
	<div class="wrap">
		<Stage width={totalWidth} height={totalHeight} bind:this={stage}>
			<Layer>
				<Image {image} />
				<Text {...titleTextConfig} />
				<Text {...noteTextConfig} />
				{#each dayOfftextConfigs as dayOffTextConfig, idx}
					<Text {...dayOffTextConfig} rotation={-10} />
				{/each}
				{#each textConfigs as textConfig, idx}
					{#if daysToggle[idx]}
						<Text {...textConfig} />
					{/if}
				{/each}
				{#each constantTextConfigs as textConfig, idx}
					<Text {...textConfig} />
				{/each}
			</Layer>
		</Stage>
		{#if viewGrid}
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

<style>
	@font-face {
		font-family: 'Gilroy-Bold';
		font-style: normal;
		font-weight: 400;
		src:
			local('Gilroy-Bold'),
			url('$lib/Gilroy-Bold.woff') format('woff');
	}

	label {
		display: flex;
		gap: 20px;
		margin: 5px;
		font-family: 'Gilroy-Bold', sans-serif;
		span {
			display: flex;
			width: 200px;
		}
		:global(div) {
			width: 300px;
		}

		button:first-of-type {
			order: 0;
		}

		button:last-of-type {
			order: 2;
		}

		input {
			order: 1;
		}
	}

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
