import moment from 'moment';
import {
    addDays,
    endOfDay,
    startOfDay,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    addMonths,
    addYears,
    startOfWeek,
    endOfWeek,
    isSameDay,
    differenceInCalendarDays,
} from 'date-fns';

const defineds = weekStartsOn => ({
    startOfWeek: startOfWeek(new Date(), { weekStartsOn }),
    endOfWeek: endOfWeek(new Date(), { weekStartsOn }),
    startOfLastWeek: startOfWeek(addDays(new Date(), -7), { weekStartsOn }),
    endOfLastWeek: endOfWeek(addDays(new Date(), -7), { weekStartsOn }),
    startOfToday: startOfDay(new Date()),
    endOfToday: endOfDay(new Date()),
    startOfYesterday: startOfDay(addDays(new Date(), -1)),
    endOfYesterday: endOfDay(addDays(new Date(), -1)),
    startOfMonth: startOfMonth(new Date()),
    endOfMonth: endOfMonth(new Date()),
    startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
    endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
    startOfYear: startOfYear(new Date()),
    endOfYear: endOfYear(new Date()),
    startOfLastYear: startOfYear(addYears(new Date(), -1)),
    endOfLastYear: endOfYear(addYears(new Date(), -1)),
});

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

export const staticRanges = (
    today,
    yesterday,
    thisWeek,
    lastWeek,
    thisMonth,
    lastMonth,
    thisYear,
    lastYear,
    weekStartsOn
) =>
    createStaticRanges([
        {
            label: today,
            range: () => ({
                startDate: defineds(weekStartsOn).startOfToday,
                endDate: defineds(weekStartsOn).endOfToday,
            }),
        },
        {
            label: yesterday,
            range: () => ({
                startDate: defineds(weekStartsOn).startOfYesterday,
                endDate: defineds(weekStartsOn).endOfYesterday,
            }),
        },

        {
            label: thisWeek,
            range: () => ({
                startDate: defineds(weekStartsOn).startOfWeek,
                endDate: defineds(weekStartsOn).endOfWeek,
            }),
        },
        {
            label: lastWeek,
            range: () => ({
                startDate: defineds(weekStartsOn).startOfLastWeek,
                endDate: defineds(weekStartsOn).endOfLastWeek,
            }),
        },
        {
            label: thisMonth,
            range: () => ({
                startDate: defineds(weekStartsOn).startOfMonth,
                endDate: defineds(weekStartsOn).endOfMonth,
            }),
        },
        {
            label: lastMonth,
            range: () => ({
                startDate: defineds(weekStartsOn).startOfLastMonth,
                endDate: defineds(weekStartsOn).endOfLastMonth,
            }),
        },
        {
            label: thisYear,
            range: () => ({
                startDate: defineds(weekStartsOn).startOfYear,
                endDate: defineds(weekStartsOn).endOfYear,
            }),
        },
        {
            label: lastYear,
            range: () => ({
                startDate: defineds(weekStartsOn).startOfLastYear,
                endDate: defineds(weekStartsOn).endOfLastYear,
            }),
        },
    ]);

export const inputRanges = (daysUpToToday, daysStartingToday, weekStartsOn) => [
    {
        label: daysUpToToday,
        range(value) {
            if (value > 366) {
                value = 366;
            }
            return {
                startDate: addDays(defineds(weekStartsOn).startOfToday, Math.max(Number(value), 0) * -1),
                endDate: defineds(weekStartsOn).endOfToday,
            };
        },
        getCurrentValue(range) {
            if (!isSameDay(range.endDate, defineds(weekStartsOn).endOfToday)) return '';
            if (!range.startDate) return '∞';
            return differenceInCalendarDays(defineds(weekStartsOn).endOfToday, range.startDate)
                ? differenceInCalendarDays(defineds(weekStartsOn).endOfToday, range.startDate)
                : '';
        },
    },
    {
        label: daysStartingToday,
        range(value) {
            if (value > 366) {
                value = 366;
            }
            const today = new Date();
            return {
                startDate: today,
                endDate: addDays(today, Math.max(Number(value), 0)),
            };
        },
        getCurrentValue(range) {
            if (!isSameDay(range.startDate, defineds(weekStartsOn).startOfToday)) return '';
            if (!range.endDate) return '∞';
            return differenceInCalendarDays(range.endDate, defineds(weekStartsOn).startOfToday)
                ? differenceInCalendarDays(range.endDate, defineds(weekStartsOn).startOfToday)
                : '';
        },
    },
];
