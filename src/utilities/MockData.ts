import { ToDoItemImportance, ToDoItemStatus } from "../models/ToDoItem";
import { TimeZone } from "../models/TimeZone";
import { isWorker } from "cluster";
import { ToDoItem } from "../ToDoProvider";

export class MockData {
  todoItem: ToDoItem[] = [];

  public getData(): ToDoItem[] {
    this.populateTasks();
    this.populateFlaggedEmails();
    return this.todoItem;
  }

  private populateTasks() {
    var defaultTasksList = new ToDoItem(
      "1_AAMkADNjZjQxOWU0LThiNzctNDlhOC1iNTM5LWUxMDA4OTZiOTc5ZgAuAAAAAAA5mBoHDfNWRaP--opJjKXGAQBtQpkFnUZ3R47jgf39pUnDAAAANp0uAAA=",
      "Tasks",
      true,
      false,
      "defaultList"
    );
    defaultTasksList.children = [];
    var task1 = new ToDoItem(
      "2_AAMkADNjZjQxOWU0LThiNzctNDlhOC1iNTM5LWUxMDA4OTZiOTc5ZgBGAAAAAAA5mBoHDfNWRaP--opJjKXGBwBtQpkFnUZ3R47jgf39pUnDAAAANp0uAACXu-_HCID9Q4OFzDCWsjFqAALrzD8NAAA=",
      "First Task",
      false,
      false,
      ""
    );
    task1.importance = ToDoItemImportance.normal;
    task1.isReminderOn = false;

    var task2 = new ToDoItem(
      "3_AAMkADNjZjQxOWU0LThiNzctNDlhOC1iNTM5LWUxMDA4OTZiOTc5ZgBGAAAAAAA5mBoHDfNWRaP--opJjKXGBwBtQpkFnUZ3R47jgf39pUnDAAAANp0uAACXu-_HCID9Q4OFzDCWsjFqAALrzD8NAAA=",
      "Second Task",
      false,
      false,
      ""
    );
    task2.importance = ToDoItemImportance.normal;
    task2.isReminderOn = false;

    defaultTasksList.children.push(task1);
    defaultTasksList.children.push(task2);
    this.todoItem.push(defaultTasksList);
  }

  private populateFlaggedEmails() {
    var flaggedEmailsList = new ToDoItem(
      "4_AAMkADNjZjQxOWU0LThiNzctNDlhOC1iNTM5LWUxMDA4OTZiOTc5ZgAuAAAAAAA5mBoHDfNWRaP--opJjKXGAQBtQpkFnUZ3R47jgf39pUnDAAAANp0uAAA=",
      "Flagged Emails",
      true,
      false,
      "flaggedEmails"
    );
    flaggedEmailsList.children = [];
    var task1 = new ToDoItem(
      "5_AAMkADNjZjQxOWU0LThiNzctNDlhOC1iNTM5LWUxMDA4OTZiOTc5ZgBGAAAAAAA5mBoHDfNWRaP--opJjKXGBwBtQpkFnUZ3R47jgf39pUnDAAAANp0uAACXu-_HCID9Q4OFzDCWsjFqAALrzD8NAAA=",
      "Flagged Emails - First Task",
      false,
      false,
      ""
    );
    task1.importance = ToDoItemImportance.normal;
    task1.isReminderOn = false;

    var task2 = new ToDoItem(
      "6_AAMkADNjZjQxOWU0LThiNzctNDlhOC1iNTM5LWUxMDA4OTZiOTc5ZgBGAAAAAAA5mBoHDfNWRaP--opJjKXGBwBtQpkFnUZ3R47jgf39pUnDAAAANp0uAACXu-_HCID9Q4OFzDCWsjFqAALrzD8NAAA=",
      "Flagged Emails - Second Task",
      false,
      false,
      ""
    );
    task2.importance = ToDoItemImportance.normal;
    task2.isReminderOn = false;

    flaggedEmailsList.children.push(task1);
    flaggedEmailsList.children.push(task2);
    this.todoItem.push(flaggedEmailsList);
  }
}
