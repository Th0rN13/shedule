<script lang="ts">
	import LargeCanvasView from './LargeCanvasView.svelte';
	import SmallCanvasView from './SmallCanvasView.svelte';
	import { fly } from 'svelte/transition';

	let view: 'large' | 'small' = $state('large');

	function toggleView() {
		view = view === 'large' ? 'small' : 'large';
	}
</script>

<!-- Main Preview Area -->
<main class="preview-area">
	<div class="preview-header">
		<h2>Предпросмотр расписания</h2>
		<button class="btn btn-secondary">
			<span class="icon">🖼️</span>
			Посмотреть полный размер
		</button>
	</div>
	<div class="preview-container">
		<div class="canvas-wrapper">
			<div
				class="preview-content"
				class:large={view === 'large'}
				in:fly={{ x: -2000, duration: 300 }}
				out:fly={{ x: -2000, duration: 300 }}
			>
				<LargeCanvasView />
			</div>

			<div
				class="preview-content-small"
				class:large={view === 'large'}
				in:fly={{ x: 2000, duration: 300 }}
				out:fly={{ x: 2000, duration: 300 }}
			>
				<SmallCanvasView />
			</div>
		</div>
		<div>
			<button class="btn btn-primary" onclick={toggleView}> ⇄ </button>
		</div>
	</div>
</main>

<style>
	.canvas-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		width: 100%;
		height: 100%;
		position: relative;
	}
	.preview-container {
		display: flex;
		flex-direction: column;
	}
	.preview-content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(calc(-2000px - 50%), -50%) scale(0.4);
		transition: 300ms;
		&.large {
			transform: translate(-50%, -50%) scale(0.4);
		}
	}
	.preview-content-small {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(1);
		transition: 300ms;
		&.large {
			transform: translate(calc(2000px - 50%), -50%) scale(1);
		}
	}
	@font-face {
		font-family: 'Gilroy-Bold';
		font-style: normal;
		font-weight: 400;
		src:
			local('Gilroy-Bold'),
			url('$lib/Gilroy-Bold.woff') format('woff');
	}
</style>
