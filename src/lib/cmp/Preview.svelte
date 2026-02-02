<script lang="ts">
	import LargeCanvasView from './LargeCanvasView.svelte';
	import SmallCanvasView from './SmallCanvasView.svelte';
</script>

<!-- Main Preview Area -->
<main class="preview-area">
	<div class="preview-header">
		<h2>Предпросмотр расписания</h2>
		<button class="btn btn-secondary" id="showPreviewModal">
			<span class="icon">🖼️</span>
			Посмотреть полный размер
		</button>
	</div>
	<div class="preview-container">
		<div class="canvas-wrapper">
			<div class="preview-content">
				<LargeCanvasView />

				<!-- <SmallCanvasView /> -->
			</div>
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
	.preview-content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(0.4);
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
