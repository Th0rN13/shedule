import { LocalStorageService } from '$lib/services/LocalStorageService';
import { writable } from 'svelte/store';

export interface SchedulteItem {
    text: string;
    enabled: boolean;
}

type SchedulesState = Array<SchedulteItem>;

function createStore() {
    const data = LocalStorageService.load();
    const { subscribe, set, update } = writable<SchedulesState>(
        data.slots
    );

    return {
        subscribe,
        updateText: (text: string, idx: number) => update((state) => {
            state[idx].text = text;
            LocalStorageService.update({ slots: state });
            return state;
        }),
        updateToggle: (idx: number) => update((state) => {
            state[idx].enabled = !state[idx].enabled;
            LocalStorageService.update({ slots: state });
            return state;
        }),
    };
}

export const schedulesStore = createStore();
