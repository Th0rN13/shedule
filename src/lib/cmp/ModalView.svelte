<script lang="ts">
	import { configStore } from '$lib/stores/config';
	import { stageStore } from '$lib/stores/stage';
	import Button from './UI/Button.svelte';

	interface PropType {
		isActive: boolean;
	}

	let { isActive }: PropType = $props();

	let canvas: HTMLCanvasElement | undefined = $state();

	function close() {
		configStore.toggleModal();
	}

	$effect(() => {
		if (isActive) {
			$stageStore.stageLarge?.node.toImage({
				callback: (img) => {
					let ctx = canvas?.getContext('2d');
					ctx?.drawImage(img, 0, 0, 1920, 1080);
				}
			});
		}
	});
</script>

<div class="modal" class:active={isActive}>
	<div class="modal-overlay"></div>
	<div class="modal-content">
		<div class="modal-header">
			<h3>Полный предпросмотр</h3>
			<Button icon="close" onclick={close} label="" />
		</div>
		<div class="modal-body">
			<canvas width="1920" height="1080" bind:this={canvas}> </canvas>
		</div>
	</div>
</div>

<style>
	.modal {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
		align-items: center;
		justify-content: center;
	}

	.modal.active {
		display: flex;
	}

	.modal-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.75);
		backdrop-filter: blur(4px);
	}

	.modal-content {
		position: relative;
		background: var(--surface);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		max-width: 95vw;
		max-height: 95vh;
		display: flex;
		flex-direction: column;
		z-index: 1001;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 24px;
		border-bottom: 1px solid var(--border);
	}

	.modal-header h3 {
		font-size: 20px;
		font-weight: 700;
		color: var(--text-primary);
	}

	.modal-body {
		padding: 24px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-body canvas {
		max-width: 100%;
		max-height: calc(95vh - 100px);
		box-shadow: var(--shadow-md);
	}
</style>
