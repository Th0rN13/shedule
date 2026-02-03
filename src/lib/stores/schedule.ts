import { LocalStorageService } from '$lib/services/LocalStorageService';
import { writable } from 'svelte/store';
import type { ScheduleItem } from '$lib/types';

export type SchedulesState = Array<ScheduleItem>;

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
