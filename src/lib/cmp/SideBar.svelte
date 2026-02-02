<script lang="ts">
	import { slotNames } from '$lib/constants';
	import { schedulesStore } from '$lib/stores/schedule';
	import Control from './Control.svelte';
	import SheduleInput from './SheduleInput.svelte';

	interface PropType {}

	let {}: PropType = $props();
</script>

<!-- Sidebar -->
<aside class="sidebar">
	<div class="sidebar-header">
		<h1>📅 Расписание</h1>
		<p class="subtitle">Редактор расписания</p>
	</div>

	<div class="sidebar-content">
		<!-- Schedule Entries -->
		<div class="section schedule-section">
			<h2 class="section-title">Временные слоты</h2>
			<div class="schedule-list" id="scheduleList">
				{#each $schedulesStore as { text, enabled }, idx}
					<SheduleInput label={slotNames[idx]} {text} {enabled} {idx} />
				{/each}
			</div>
		</div>

		<Control />
	</div>
</aside>
