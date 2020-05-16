export class ToDoItem {
  public id: string | undefined;
  public name: string | undefined;
  public isOwner: boolean | undefined;
  public isShared: boolean | undefined;
  public importance: string | undefined;
  public isReminderOn: string | undefined;
  public status: string | undefined;
  public creationDateTime: Date | undefined;
  public lastModifiedDateTime: Date | undefined;
  public children: ToDoItem[] | undefined;
}
