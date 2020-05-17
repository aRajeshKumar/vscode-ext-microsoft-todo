import { TimeZone } from "./TimeZone";

export class Recurrence {
  public pattern: RecurrencePattern | undefined;
  public range: RecurrenceRange | undefined;
}

export class RecurrencePattern {
  public type: RecurrencePatternType | undefined;
  public interval: number = 0;
  public month: number = 0;
  public dayOfMonth: number = 0;
  public daysOfWeek: WeekDay[] | undefined;
  public firstDayOfWeek: WeekDay = WeekDay.sunday;
  public index: string | undefined;
}

export class RecurrenceRange {
  public type: RecurrenceRangeType | undefined;
  public startDate: Date | undefined;
  public endDate: Date | undefined;
  public recurrenceTimeZone: TimeZone = TimeZone.UTC;
  public numberOfOccurrences: number = 0;
}

export enum RecurrencePatternType {
  daily,
  weekly,
  absoluteMonthly,
}

export enum RecurrenceRangeType {
  noEnd,
}

export enum WeekDay {
  sunday,
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
}
