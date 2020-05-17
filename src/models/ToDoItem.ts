import { TimeZone } from "./TimeZone";

export class ToDoItem {
  public id: string | undefined;
  public name: string | undefined;
  public isOwner: boolean | undefined;
  public isShared: boolean | undefined;
  public importance: ToDoItemImportance | undefined;
  public isReminderOn: string | undefined;
  public reminderDateTime: TimeZone | undefined;
  public status: ToDoItemStatus | undefined;
  public dueDateTime: TimeZone | undefined;
  public creationDateTime: Date | undefined;
  public lastModifiedDateTime: Date | undefined;
  public children: ToDoItem[] | undefined;
}

export enum ToDoItemStatus {
  notStarted,
  completed,
}

export enum ToDoItemImportance {
  normal,
  high,
}
