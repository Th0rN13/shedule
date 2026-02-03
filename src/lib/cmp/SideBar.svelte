<script lang="ts">
	import Control from './Control.svelte';
	import ScheduleTable from './ScheduleTable.svelte';
</script>

<!-- Sidebar -->
<aside class="sidebar">
	<div class="sidebar-header">
		<h1>📅 Расписание</h1>
		<p class="subtitle">Редактор расписания</p>
	</div>

	<div class="sidebar-content">
		<ScheduleTable />

		<Control />
	</div>
</aside>
