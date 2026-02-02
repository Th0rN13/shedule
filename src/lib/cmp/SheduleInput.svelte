<script lang="ts">
	interface PropType {
		label: string;
		text: string;
		enabled: boolean;
	}

	let { label, text, enabled }: PropType = $props();
</script>

<div class="schedule-item">
	<div class="schedule-label">{label}</div>
	<input
		type="text"
		class="schedule-input"
		value=""
		data-index="0"
		placeholder="Введите текст..."
	/>
	<div class="schedule-actions">
		<button class="icon-btn save" data-index="0" title="Переключить">✅</button>
		<button class="icon-btn delete" data-index="0" title="Очистить">🗑️</button>
	</div>
</div>
