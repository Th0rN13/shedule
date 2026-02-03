import { LocalStorageService } from '$lib/services/LocalStorageService';
import type { HexColor } from '$lib/types';
import { writable } from 'svelte/store';

export interface ConfigState {
    viewCanvas: boolean;
    viewGrid: boolean;
    viewModal: boolean;
    textColor: HexColor;
    centerTextOffset: number;
}

function createStore() {
    let data = LocalStorageService.load();
    const { subscribe, set, update } = writable<ConfigState>({
        viewCanvas: true,
        viewGrid: false,
        viewModal: false,
        textColor: data.textColor,
        centerTextOffset: data.centerTextOffset,
    });

    return {
        subscribe,
        toggleCanvas: () => update(state => {
            return { ...state, viewCanvas: !state.viewCanvas, viewGrid: false }
        }),
        toggleGrid: () => update(state => {
            return { ...state, viewGrid: !state.viewGrid }
        }),
        toggleModal: () => update(state => ({ ...state, viewModal: !state.viewModal })),
        setColor: (color: HexColor) => update(state => {
            LocalStorageService.update({ textColor: color });
            return { ...state, textColor: color }
        }),
        setcenterTextOffset: (offset: number) => update(state => {
            LocalStorageService.update({ centerTextOffset: offset });
            return { ...state, centerTextOffset: offset }
        })
    };
}

export const configStore = createStore();
