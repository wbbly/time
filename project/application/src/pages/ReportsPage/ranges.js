import {
    addDays,
    endOfDay,
    startOfDay,
    startOfMonth,
    endOfMonth,
    addMonths,
    startOfWeek,
    endOfWeek,
    isSameDay,
    differenceInCalendarDays,
} from 'date-fns';

const defineds = {
    startOfWeek: startOfWeek(new Date(), { weekStartsOn: 1 }),
    endOfWeek: endOfWeek(new Date(), { weekStartsOn: 1 }),
    startOfLastWeek: startOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 }),
    endOfLastWeek: endOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 }),
    startOfToday: startOfDay(new Date()),
    endOfToday: endOfDay(new Date()),
    startOfYesterday: startOfDay(addDays(new Date(), -1)),
    endOfYesterday: endOfDay(addDays(new Date(), -1)),
    startOfMonth: startOfMonth(new Date()),
    endOfMonth: endOfMonth(new Date()),
    startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
    endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
};

const staticRangeHandler = {
    range: {},
    isSelected(range) {
        const definedRange = this.range();
        return isSameDay(range.startDate, definedRange.startDate) && isSameDay(range.endDate, definedRange.endDate);
    },
};

function createStaticRanges(ranges) {
    return ranges.map(range => ({ ...staticRangeHandler, ...range }));
}

export const staticRanges = (today, yesterday, thisWeek, lastWeek, thisMonth, lastMonth) =>
    createStaticRanges([
        {
            label: today,
            range: () => ({
                startDate: defineds.startOfToday,
                endDate: defineds.endOfToday,
            }),
        },
        {
            label: yesterday,
            range: () => ({
                startDate: defineds.startOfYesterday,
                endDate: defineds.endOfYesterday,
            }),
        },

        {
            label: thisWeek,
            range: () => ({
                startDate: defineds.startOfWeek,
                endDate: defineds.endOfWeek,
            }),
        },
        {
            label: lastWeek,
            range: () => ({
                startDate: defineds.startOfLastWeek,
                endDate: defineds.endOfLastWeek,
            }),
        },
        {
            label: thisMonth,
            range: () => ({
                startDate: defineds.startOfMonth,
                endDate: defineds.endOfMonth,
            }),
        },
        {
            label: lastMonth,
            range: () => ({
                startDate: defineds.startOfLastMonth,
                endDate: defineds.endOfLastMonth,
            }),
        },
    ]);

export const inputRanges = (daysUpToToday, daysStartingToday) => [
    {
        label: daysUpToToday,
        range(value) {
            return {
                startDate: addDays(defineds.startOfToday, (Math.max(Number(value), 1) - 1) * -1),
                endDate: defineds.endOfToday,
            };
        },
        getCurrentValue(range) {
            if (!isSameDay(range.endDate, defineds.endOfToday)) return '-';
            if (!range.startDate) return '∞';
            return differenceInCalendarDays(defineds.endOfToday, range.startDate) + 1;
        },
    },
    {
        label: daysStartingToday,
        range(value) {
            const today = new Date();
            return {
                startDate: today,
                endDate: addDays(today, Math.max(Number(value), 1) - 1),
            };
        },
        getCurrentValue(range) {
            if (!isSameDay(range.startDate, defineds.startOfToday)) return '-';
            if (!range.endDate) return '∞';
            return differenceInCalendarDays(range.endDate, defineds.startOfToday) + 1;
        },
    },
];
