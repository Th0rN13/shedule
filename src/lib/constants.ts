export const TOTAL_SCHEDULE_ITEMS = 14;

export const CANVAS_CONFIG = {
    totalWidth: 1920,
    totalHeight: 1080,
    rightBorderWidth: 480,
    columnGap: 120,
    columnWidth: (1920 - 480 - 120 * 3) / 2, // (totalWidth - rightBorderWidth - columnGap * 3) / 2
    textLineHeight: 67,
    titleLineHeight: 200
};

export const TEXT_CONFIGS = {
    defaultFontSize: 30,
    titleFontSize: 60,
    dayOffFontSize: 56,
    smallFontSize: 22,
    fontFamily: 'Gilroy-Bold'
};

export const slotNames = [
    'Понедельник, 9:00',
    'Понедельник, 19:00',
    'Вторник, 9:00',
    'Вторник, 19:00',
    'Среда, 9:00',
    'Среда, 19:00',
    'Четверг, 9:00',
    'Четверг, 19:00',
    'Пятница, 9:00',
    'Пятница, 19:00',
    'Суббота, 10:00',
    'Суббота, 19:00',
    'Воскресенье, 10:00',
    'Воскресенье, 19:00'
];

export const slotAddTexts = [
    '9:00 - ',
    '19:00 - ',
    '9:00 - ',
    '19:00 - ',
    '9:00 - ',
    '19:00 - ',
    '9:00 - ',
    '19:00 - ',
    '9:00 - ',
    '19:00 - ',
    '10:00 - ',
    '19:00 - ',
    '10:00 - ',
    '19:00 - '
];

export const dayTexts = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье'
];

export const dayOrders = [0, 2, 4, 1, 3, 5, 6];

export const slotShortAddTexts = [
    'Пн 09:00',
    'Пн 19:00',
    'Вт 09:00',
    'Вт 19:00',
    'Ср 09:00',
    'Ср 19:00',
    'Чт 09:00',
    'Чт 19:00',
    'Пт 09:00',
    'Пт 19:00',
    'Сб 10:00',
    'Сб 19:00',
    'Вс 10:00',
    'Вс 19:00'
];
