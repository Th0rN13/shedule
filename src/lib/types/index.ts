export type HexColor = `#${string}`

export interface ScheduleItem {
    text: string;
    enabled: boolean;
}

export interface TimeSlot {
    day: number;
    time: 'morning' | 'evening';
}

export interface TextConfig {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
    fill: string;
    align: CanvasTextAlign;
    verticalAlign: CanvasTextBaseline;
    rotation?: number;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOpacity?: number;
}

export interface CanvasState {
    viewCanvas: boolean;
    viewGrid: boolean;
    textColor: string;
    centerOffset: number;
    scheduleItems: ScheduleItem[];
}