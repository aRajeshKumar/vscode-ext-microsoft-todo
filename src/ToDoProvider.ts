import * as vscode from "vscode";
import { pathToFileURL } from "url";
import path = require("path");
import { ToDoItemImportance, ToDoItemStatus } from "./models/ToDoItem";
import { TimeZone } from "./models/TimeZone";
import { MockData } from "./utilities/MockData";
import { isWorker } from "cluster";

export class ToDoProvider implements vscode.TreeDataProvider<ToDoItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    ToDoItem | undefined
  > = new vscode.EventEmitter<ToDoItem | undefined>();

  readonly onDidChangeTreeData?:
    | vscode.Event<ToDoItem | null | undefined>
    | undefined = this._onDidChangeTreeData.event;

  //data: ToDoItem[];
  constructor() {
    //this.data = this.getGroups();

    vscode.window.showInformationMessage("Calling ToDoProvider constructor");
  }

  refresh(): void {
    //this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ToDoItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: ToDoItem | undefined): Thenable<ToDoItem[]> {
    // if (!this.workspaceRoot) {
    //   vscode.window.showInformationMessage("No tasks to perform!");
    //   return Promise.resolve([]);
    // }

    if (element === undefined) {
      var md = new MockData();
      return Promise.resolve(md.getData());
    } else {
      //      vscode.window.showInformationMessage("No tasks to show....");
      return Promise.resolve(element.children);
    }
  }

  generateItem(element: ToDoItem): vscode.TreeItem {
    return element;
  }

  // private getGroups(): ToDoItem[] {
  //
  //  return groups;
  // }
}

export class ToDoItem extends vscode.TreeItem {
  public id: string | undefined;
  public name: string | undefined;
  public isOwner: boolean | undefined;
  public isShared: boolean | undefined;
  public importance: ToDoItemImportance | undefined;
  public isReminderOn: boolean | undefined;
  public reminderDateTime: TimeZone | undefined;
  public status: ToDoItemStatus | undefined;
  public dueDateTime: TimeZone | undefined;
  public creationDateTime: Date | undefined;
  public lastModifiedDateTime: Date | undefined;
  public wellknownListName: string | undefined;
  public children: ToDoItem[];

  constructor(
    id: string,
    name: string,
    isOwner = false,
    isShared = false,
    wellknownListName: string
  ) {
    super(name);

    this.id = id;
    this.name = name;
    this.isOwner = isOwner;
    this.isShared = isShared;
    this.children = [];

    if (isOwner || isShared) {
      this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;

      this.iconPath = {
        light: path.join(
          __filename,
          "..",
          "..",
          "resources",
          "light",
          "logo.png"
        ),
        dark: path.join(
          __filename,
          "..",
          "..",
          "resources",
          "dark",
          "logo.png"
        ),
      };
    }
  }

  // contextValue = "dependency";
}
