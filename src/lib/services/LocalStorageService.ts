import { TOTAL_SCHEDULE_ITEMS } from "$lib/constants";
import type { HexColor, ScheduleItem } from "$lib/types";

export interface LocalStorageData {
    slots: Array<ScheduleItem>,
    textColor: HexColor;
    titleOffset: number;
};

// function updateLocalStorage(current: LocalStorageData, update: Partial<LocalStorageData>): LocalStorageData {
//     for (let key in update) {
//         if (update[key] !== undefined) {
//             current[key] = update[key];
//         }
//     }
//     return current
// }

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
            // init defaults
            slots: Array.from({ length: TOTAL_SCHEDULE_ITEMS }).map(() => ({ text: '', enabled: true })),
            titleOffset: 0,
            textColor: '#000000'
        };
        try {
            let raw = JSON.parse(data);
            result = updateLocalStorage(result, { ...(raw?.daysText && { daysText: raw.daysText }) })
            result = updateLocalStorage(result, { ...(raw?.daysText && { daysText: raw.daysText }) })
            result = updateLocalStorage(result, { ...(raw?.daysText && { daysText: raw.daysText }) })
            result = updateLocalStorage(result, { ...(raw?.daysText && { daysText: raw.daysText }) })
            result = updateLocalStorage(result, { ...(raw?.daysText && { daysText: raw.daysText }) })
            // result = {
            //     ...result,
            //     ...(raw?.daysText && { daysText: raw.daysText }),
            //     ...(raw?.daysToggle && { daysToggle: raw.daysToggle }),
            //     ...(raw?.centerOffset && { titleOffset: raw.centerOffset }),
            //     ...(raw?.titleOffset && { titleOffset: raw.titleOffset }),
            //     ...(raw?.textColor && { textColor: raw.textColor })
            // };
        } catch (e) {
            console.warn('Error parsing old data');
        }
        return result;
    }
}