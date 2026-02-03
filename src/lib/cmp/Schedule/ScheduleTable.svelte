<script lang="ts">
	import { dayTexts, slotNames } from '$lib/constants';
	import ScheduleDay from './ScheduleDay.svelte';
	import Section from '../UI/Section.svelte';
	dayTexts;
</script>

<Section title="Временные слоты">
	<div class="schedule-list">
		{#each dayTexts as day, dayIdx}
			<ScheduleDay {day} {dayIdx} />
		{/each}
	</div>
</Section>

<style>
	.schedule-list {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		overflow: hidden;
	}
</style>
