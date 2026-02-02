<script lang="ts">
	import { schedulesStore } from '$lib/stores/schedule';
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
					<SheduleInput label="123" {text} {enabled} />
				{/each}
			</div>
		</div>

		<!-- Customization -->
		<div class="section settings-section">
			<h2 class="section-title">Настройки дизайна</h2>

			<div class="control-group">
				<label class="control-label">
					<span>Цвет текста</span>
					<input type="color" id="textColor" value="#000000" class="color-input" />
				</label>
			</div>

			<div class="control-group">
				<label class="control-label">
					<span>Сдвиг центрального текста</span>
					<div class="slider-container">
						<input type="range" id="textOffset" min="0" max="100" value="80" class="slider" />
						<span class="slider-value" id="offsetValue">80%</span>
					</div>
				</label>
			</div>
		</div>

		<!-- Actions -->
		<div class="section export-section">
			<h2 class="section-title">Экспорт</h2>
			<div class="button-group">
				<button class="btn btn-secondary" id="toggleImage">
					<span class="icon">🖼️</span>
					Изображение
				</button>
				<button class="btn btn-secondary" id="toggleGrid">
					<span class="icon">📐</span>
					Сетка
				</button>
				<button class="btn btn-primary" id="downloadLarge">
					<span class="icon">⬇️</span>
					Большое
				</button>
				<button class="btn btn-primary" id="downloadSmall">
					<span class="icon">⬇️</span>
					Маленькое
				</button>
			</div>
		</div>
	</div>
</aside>
