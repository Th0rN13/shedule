<script lang="ts">
	import { dayTexts, slotNames } from '$lib/constants';
	import { schedulesStore } from '$lib/stores/schedule';
	import ScheduleDay from './ScheduleDay.svelte';
	import SheduleInput from './SheduleInput.svelte';
	dayTexts;
</script>

<!-- Schedule Entries -->
<div class="section schedule-section">
	<h2 class="section-title">Временные слоты</h2>
	<div class="schedule-list">
		<!-- {#each $schedulesStore as { text, enabled }, idx}
			<SheduleInput label={slotNames[idx]} {text} {enabled} {idx} />
		{/each} -->

		{#each dayTexts as day, dayIdx}
			<ScheduleDay {day} {dayIdx} />
		{/each}
	</div>
</div>
