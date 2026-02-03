<script lang="ts">
	import { dayOrders } from '$lib/constants';
	import { schedulesStore } from '$lib/stores/schedule';
	import SheduleInput from './SheduleInput.svelte';

	let text = $state('');
	let enabled = $state(true);
	let idx = $state(18);

	interface PropType {
		day: string;
		dayIdx: number;
	}

	let { day, dayIdx }: PropType = $props();
</script>

<div class="schedule-day" style="order: {dayOrders[dayIdx]};">
	<div class="schedule-day-title">{day}</div>
	<SheduleInput
		label={'Утро'}
		text={$schedulesStore[dayIdx * 2].text}
		enabled={$schedulesStore[dayIdx * 2].enabled}
		idx={dayIdx * 2}
	/>
	<SheduleInput
		label={'Вечер'}
		text={$schedulesStore[dayIdx * 2 + 1].text}
		enabled={$schedulesStore[dayIdx * 2 + 1].enabled}
		idx={dayIdx * 2 + 1}
	/>
</div>

<style>
	.schedule-day {
		display: flex;
		flex-direction: column;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: 8px;
	}
	.schedule-day-title {
		min-width: 110px;
		font-size: 12px;
		font-weight: 500;
		color: var(--text-primary);
		white-space: nowrap;
	}
</style>
