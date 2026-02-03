import { CANVAS_CONFIG, dayTexts, LABEL_TEXTS, slotAddTexts, slotShortTexts, TOTAL_SCHEDULE_ITEMS } from "$lib/constants";
import type { ConfigState } from "$lib/stores/config";
import type { SchedulesState } from "$lib/stores/schedule";
import type { ScheduleItem, HexColor } from "$lib/types";
import { chunks } from "$lib/utils";

export interface Position {
    x: number;
    y: number;
}

export interface TextConfig {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
    fill: HexColor;
    align: CanvasTextAlign;
    verticalAlign: CanvasTextBaseline;
    wrap?: 'none';
    ellipsis: boolean;
    rotation?: number;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOpacity?: number;
    shadowEnabled?: boolean,
}


export const defaultTextConfig: TextConfig = {
    text: "",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    align: 'left',
    verticalAlign: 'top',
    fontSize: 30,
    fontFamily: 'Gilroy-Bold',
    fill: "#000000",
    shadowColor: 'white',
    shadowBlur: 10,
    shadowOpacity: 1,
    shadowEnabled: true,
    wrap: 'none',
    ellipsis: true
};

export class CanvasService {

    // Large Canvas Title
    static generateTitleConfig(configState: ConfigState): TextConfig {
        return {
            ...defaultTextConfig,
            fill: configState.textColor,
            text: LABEL_TEXTS.title,
            fontSize: 60,
            x: configState.centerTextOffset,
            y: 0,
            height: CANVAS_CONFIG.titleLineHeight,
            width: CANVAS_CONFIG.totalWidth - CANVAS_CONFIG.rightBorderWidth,
            align: 'center',
            verticalAlign: 'middle'
        }
    }

    // Large Canvas footnote
    static generateFootNoteConfig(configState: ConfigState): TextConfig {
        return {
            ...defaultTextConfig,
            fill: configState.textColor,
            text: LABEL_TEXTS.footNote,
            x: CANVAS_CONFIG.columnGap,
            y: CANVAS_CONFIG.totalHeight - CANVAS_CONFIG.titleLineHeight,
            height: CANVAS_CONFIG.titleLineHeight,
            width: CANVAS_CONFIG.totalWidth - CANVAS_CONFIG.rightBorderWidth,
            align: 'left',
            verticalAlign: 'bottom'
        }
    }

    // Large Canvas days of week positions
    static getDayTextPositions(configState: ConfigState): Position[] {
        return dayTexts.map((_, idx) => {
            let x = CANVAS_CONFIG.columnGap;
            if (idx >= 3) {
                x += CANVAS_CONFIG.columnWidth + CANVAS_CONFIG.columnGap;
            }
            if (idx >= 6) {
                x = CANVAS_CONFIG.columnGap + configState.centerTextOffset;
            }
            let y = CANVAS_CONFIG.titleLineHeight;
            if (idx >= 6) {
                y = CANVAS_CONFIG.titleLineHeight + CANVAS_CONFIG.textLineHeight * 9;
            } else {
                y = CANVAS_CONFIG.titleLineHeight + (idx % 3) * (CANVAS_CONFIG.textLineHeight * 3);
            }
            return {
                x,
                y
            }
        })
    }

    // Large Canvas days of week labels
    static generateDayTextConfigs(configState: ConfigState): TextConfig[] {
        let positions = this.getDayTextPositions(configState);
        return dayTexts.map((text, idx) => {
            return {
                ...defaultTextConfig,
                fill: configState.textColor,
                fontSize: 36,
                text,
                x: positions[idx].x,
                y: positions[idx].y,
                align: idx >= 6 ? 'center' : 'left',
                width: idx >= 6
                    ? CANVAS_CONFIG.columnWidth * 2 + CANVAS_CONFIG.columnGap
                    : CANVAS_CONFIG.columnWidth,
            }
        });
    }

    // Large Canvas schedule slots positions
    static getSlotTextPositions(schedulesState: SchedulesState, configState: ConfigState): Position[] {
        return schedulesState.map((_, idx) => {
            let x = CANVAS_CONFIG.columnGap;
            if (idx >= 6) {
                x += CANVAS_CONFIG.columnWidth + CANVAS_CONFIG.columnGap;
            }
            if (idx >= 12) {
                x = CANVAS_CONFIG.columnGap + configState.centerTextOffset;
            }
            let y = CANVAS_CONFIG.titleLineHeight;
            if (idx >= 12) {
                y = CANVAS_CONFIG.titleLineHeight + CANVAS_CONFIG.textLineHeight * (10 + idx - 12);
            } else {
                const add = Math.floor((idx % 6) / 2) + 1;
                y = CANVAS_CONFIG.titleLineHeight + ((idx % 6) + add) * CANVAS_CONFIG.textLineHeight;
            }
            return {
                x,
                y
            }
        })
    }

    // Large Canvas schedule slots labels
    static generatSlotTextConfigs(schedulesState: SchedulesState, configState: ConfigState): TextConfig[] {
        let positions = this.getSlotTextPositions(schedulesState, configState);
        return schedulesState.map(({ text, enabled }, idx) => {
            return {
                ...defaultTextConfig,
                fill: configState.textColor,
                text: enabled ? `${slotAddTexts[idx]}${text}` : '',
                x: positions[idx].x,
                y: positions[idx].y,
                align: idx >= 12 ? 'center' : 'left',
                width:
                    idx >= 12
                        ? CANVAS_CONFIG.columnWidth * 2 + CANVAS_CONFIG.columnGap
                        : CANVAS_CONFIG.columnWidth,
            }
        });

    }

    // Large Canvas days off positions
    static getDaysOffTextPositions(days: boolean[], configState: ConfigState): Position[] {
        return days.map((_, idx) => {
            let x = CANVAS_CONFIG.columnGap - 40;
            if (idx >= 3) {
                x += CANVAS_CONFIG.columnWidth + CANVAS_CONFIG.columnGap;
            }
            if (idx >= 6) {
                x = CANVAS_CONFIG.columnGap + configState.centerTextOffset;
            }
            let y = CANVAS_CONFIG.titleLineHeight;
            if (idx >= 6) {
                y = CANVAS_CONFIG.titleLineHeight + (3 * 3 + 2) * CANVAS_CONFIG.textLineHeight;
            } else {
                y = CANVAS_CONFIG.titleLineHeight + ((idx % 3) * 3 + 1) * CANVAS_CONFIG.textLineHeight;
            }
            return {
                x,
                y
            }
        })
    }

    // Large Canvas days off labels
    static generatDaysOffTextConfigs(schedulesState: SchedulesState, configState: ConfigState): TextConfig[] {
        const daysOff = [...chunks(schedulesState, 2)].map((day) => day.every((slot) => !slot.enabled));
        let positions = this.getDaysOffTextPositions(daysOff, configState);
        return daysOff.map((isOff, idx) => {
            return {
                ...defaultTextConfig,
                fill: configState.textColor,
                fontSize: 50,
                text: isOff ? LABEL_TEXTS.dayOff : '',
                x: positions[idx].x,
                y: positions[idx].y,
                align: 'center',
                verticalAlign: 'middle',
                height: CANVAS_CONFIG.textLineHeight * 2 + 30,
                width:
                    idx >= 6
                        ? CANVAS_CONFIG.columnWidth * 2 + CANVAS_CONFIG.columnGap
                        : CANVAS_CONFIG.columnWidth,
            }
        });

    }

    // Small Canvas line height for spread lines
    static calculateSmallLineHeight(schedulesState: SchedulesState): number {
        let count = schedulesState.filter((el) => el.enabled).length;
        if (count < 3) {
            return 140;
        }
        return Math.floor((TOTAL_SCHEDULE_ITEMS * 30) / count);
    }


    static generateSmallTitleConfig(configState: ConfigState): TextConfig {
        return {
            ...defaultTextConfig,
            fill: configState.textColor,
            text: LABEL_TEXTS.title,
            fontSize: 30,
            x: 0,
            y: 0,
            height: 100,
            width: 400,
            align: 'center',
            verticalAlign: 'middle'
        }
    }

    static generateSmallLabelsConfigs(schedulesState: SchedulesState, configState: ConfigState): TextConfig[] {
        let labels = schedulesState.filter(({ enabled }, idx) => enabled);

        return labels.map((_, idx) => {
            let x = 20;
            let y = 100 + idx * this.calculateSmallLineHeight(schedulesState);
            return {
                ...defaultTextConfig,
                fill: configState.textColor,
                fontSize: 22,
                text: slotShortTexts[idx],
                align: 'left',
                width: 100,
                x,
                y
            };
        });
    }

    static generateSmallTextConfigs(schedulesState: SchedulesState, configState: ConfigState): TextConfig[] {
        let labels = schedulesState.filter(({ enabled }, idx) => enabled);

        return labels.map(({ text }, idx) => {
            let x = 140;
            let y = 100 + idx * this.calculateSmallLineHeight(schedulesState);
            return {
                ...defaultTextConfig,
                fill: configState.textColor,
                fontSize: 22,
                text,
                align: 'left',
                width: 240,
                x,
                y
            };
        });

    }
}
