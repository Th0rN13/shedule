import { TOTAL_SCHEDULE_ITEMS } from "$lib/constants";
import type { HexColor, ScheduleItem } from "$lib/types";

export interface LocalStorageData {
    slots: Array<ScheduleItem>,
    textColor: HexColor;
    centerTextOffset: number;
};

function updateLocalStorage<T extends LocalStorageData>(
    current: T,
    update: { [K in keyof T]?: T[K] } & Record<string, unknown>
): T {
    const result = { ...current };

    for (const key in update) {
        if (key in result && update[key] !== undefined) {
            (result as any)[key] = update[key];
        }
    }
    return result;
}

export class LocalStorageService {
    static save(data: LocalStorageData) {
        localStorage.setItem('schedule', JSON.stringify(data));
        localStorage.removeItem('shedule');
    }

    static update(data: Partial<LocalStorageData>) {
        let current = LocalStorageService.load();
        LocalStorageService.save({
            ...current,
            ...data
        });
    }

    static load() {
        let data = localStorage.getItem('schedule') || '';

        let result: LocalStorageData = {
            slots: Array.from({ length: TOTAL_SCHEDULE_ITEMS }).map(() => ({ text: '', enabled: true })),
            centerTextOffset: 0,
            textColor: '#000000'
        };
        try {
            let raw = JSON.parse(data);
            result = updateLocalStorage(result, raw);
        } catch (e) {
            this.save(result);
            console.warn('Error parsing old data');
        }
        return result;
    }
}
