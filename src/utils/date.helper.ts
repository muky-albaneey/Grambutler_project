import { PeriodEnum } from './filter.dto';

export const getStartDate = (date: Date, period: PeriodEnum): Date => {
  let startDate: Date;
  if (period === PeriodEnum.WEEKLY) {
    // Start of the current week (Sunday)
    startDate = new Date(date);
    startDate.setDate(date.getDate() - date.getDay());
    startDate.setHours(0, 0, 0, 0);
  } else if (period === PeriodEnum.DAILY) {
    // Start of the current day
    startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
  }

  return startDate;
};

export const generateDateRange = (
  startDate: Date,
  endDate: Date,
  unit: 'day' | 'hour',
): Date[] => {
  const dates = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    if (unit === 'day') {
      current.setDate(current.getDate() + 1);
    } else {
      current.setHours(current.getHours() + 1);
    }
  }

  return dates;
};
