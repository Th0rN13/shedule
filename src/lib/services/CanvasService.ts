import type { ScheduleItem } from "$lib/stores/schedule";
import type { HexColor } from "$lib/types";

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
    wrap?: string;
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
    static createTextConfig(options: Partial<TextConfig>): TextConfig {
        return defaultTextConfig
    }

    static calculatePosition(index: number, isSmall: boolean): Position {
        return {
            x: 0,
            y: 0
        }
    }

    static generateTextConfigs(data: ScheduleItem, isSmall: boolean): TextConfig {
        return defaultTextConfig
    }
}