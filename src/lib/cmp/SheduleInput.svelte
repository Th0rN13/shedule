<script lang="ts">
	import { schedulesStore } from '$lib/stores/schedule';
	import IconButton from './UI/IconButton.svelte';

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
		<IconButton label={enabled ? '✅' : '❌'} title="Переключить" onclick={toggle} />
		<IconButton label="🗑️" title="Очистить" onclick={clear} />
	</div>
</label>
