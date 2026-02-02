import { LocalStorageService } from '$lib/services/LocalStorageService';
import type { HexColor } from '$lib/types';
import { writable } from 'svelte/store';

interface UIState {
    viewCanvas: boolean;
    viewGrid: boolean;
    viewPreviewModal: boolean;
    textColor: HexColor;
    titleOffset: number;
}

function createStore() {
    let data = LocalStorageService.load();
    const { subscribe, set, update } = writable<UIState>({
        viewCanvas: true,
        viewGrid: false,
        viewPreviewModal: false,
        textColor: data.textColor,
        titleOffset: data.titleOffset,
    });

    return {
        subscribe,
        toggleCanvas: () => update(state => ({ ...state, viewCanvas: !state.viewCanvas, viewGrid: false })),
        toggleGrid: () => update(state => ({ ...state, viewGrid: !state.viewGrid })),
        toggleModal: () => update(state => ({ ...state, viewPreviewModal: !state.viewPreviewModal })),
        setColor: (color: HexColor) => update(state => {
            LocalStorageService.update({ textColor: color });
            return { ...state, textColor: color }
        }),
        setTitleOffset: (offset: number) => update(state => {
            LocalStorageService.update({ titleOffset: offset });
            return { ...state, titleOffset: offset }
        })
    };
}

export const configStore = createStore();
