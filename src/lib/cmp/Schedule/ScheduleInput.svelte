<script lang="ts">
	import { schedulesStore } from '$lib/stores/schedule';
	import IconButton from '../UI/IconButton.svelte';

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

<style>
	.schedule-item {
		padding: 4px 0px;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: all 0.2s;
	}

	.schedule-item:hover {
		border-color: var(--primary-color);
		box-shadow: var(--shadow-sm);
	}

	.schedule-label {
		min-width: 50px;
		font-size: 12px;
		font-weight: 500;
		color: var(--text-primary);
		white-space: nowrap;
	}
	.schedule-input {
		flex: 1;
		padding: 6px 8px;
		border: 1px solid var(--border);
		border-radius: 6px;
		font-size: 12px;
		transition: all 0.2s;
	}

	.schedule-input:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}

	.schedule-actions {
		display: flex;
		gap: 4px;
	}
</style>
