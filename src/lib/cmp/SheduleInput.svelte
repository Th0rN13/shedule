<script lang="ts">
	import { schedulesStore } from '$lib/stores/schedule';

	interface PropType {
		label: string;
		text: string;
		enabled: boolean;
		idx: number;
	}

	let { label, text, enabled, idx }: PropType = $props();

	function change() {
		schedulesStore.updateText(text, idx);
	}

	function toggle() {
		schedulesStore.updateToggle(idx);
	}

	function clear() {
		text = '';
		change();
	}
</script>

<label class="schedule-item">
	<div class="schedule-label">{label}</div>

	<input
		type="text"
		class="schedule-input"
		bind:value={text}
		placeholder="Введите текст..."
		onchange={change}
	/>
	<div class="schedule-actions">
		<button class="icon-btn save" title="Переключить" onclick={toggle}>
			{#if enabled}
				✅
			{:else}
				❌
			{/if}
		</button>
		<button class="icon-btn delete" title="Очистить" onclick={clear}>🗑️</button>
	</div>
</label>
