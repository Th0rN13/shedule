<script lang="ts">
	import { configStore } from '$lib/stores/config';
	import RangeSlider from 'svelte-range-slider-pips';
	import Section from '../UI/Section.svelte';
	import ButtonGroup from '../UI/ButtonGroup.svelte';
	import Button from '../UI/Button.svelte';
	import ControlGroup from '../UI/ControlGroup.svelte';

	let currentColor = $state($configStore.textColor);
	let centerTextOffset = $state($configStore.centerTextOffset);

	function toggleCanvas() {
		configStore.toggleCanvas();
	}

	function toggleGrid() {
		configStore.toggleGrid();
	}

	function setColor() {
		configStore.setColor(currentColor);
	}

	function setcenterTextOffset() {
		configStore.setcenterTextOffset(centerTextOffset);
	}
</script>

<Section title="Настройки дизайна">
	<ControlGroup label="Цвет текста">
		<input type="color" bind:value={currentColor} class="color-input" onchange={setColor} />
	</ControlGroup>
	<ControlGroup label="Сдвиг центрального текста">
		<RangeSlider
			bind:value={centerTextOffset}
			min={-400}
			max={100}
			float
			on:change={setcenterTextOffset}
		></RangeSlider>
	</ControlGroup>
	<ButtonGroup>
		<Button onclick={toggleCanvas} icon="picture" label="Увеличить" />
		<Button onclick={toggleGrid} icon="grid" label="Сетка" />
	</ButtonGroup>
</Section>

<style>
	.color-input {
		width: 100%;
		height: 40px;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		cursor: pointer;
		padding: 4px;
	}
</style>
