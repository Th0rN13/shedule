<script lang="ts">
	import SideBar from '$lib/cmp/SideBar.svelte';
	import Preview from '$lib/cmp/Preview/Preview.svelte';
	import ModalView from '$lib/cmp/ModalView.svelte';
	import { configStore } from '$lib/stores/config';
</script>

<SideBar />
<Preview />
<ModalView isActive={$configStore.viewModal} />
{$configStore.viewModal}
