import * as vscode from "vscode";
import { pathToFileURL } from "url";
import path = require("path");

export class ToDoProvider implements vscode.TreeDataProvider<Dependency> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    Dependency | undefined
  > = new vscode.EventEmitter<Dependency | undefined>();

  readonly onDidChangeTreeData?:
    | vscode.Event<Dependency | null | undefined>
    | undefined = this._onDidChangeTreeData.event;

  data: Dependency[];
  constructor() {
    this.data = this.getGroups();

    vscode.window.showInformationMessage("Calling ToDoProvider constructor");
  }

  refresh(): void {
    //this._onDidChangeTreeData.fire();
  }

  getTreeItem(
    element: Dependency
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: Dependency | undefined): Thenable<Dependency[]> {
    // if (!this.workspaceRoot) {
    //   vscode.window.showInformationMessage("No tasks to perform!");
    //   return Promise.resolve([]);
    // }

    if (element === undefined) {
      return Promise.resolve(this.data);
    } else {
      vscode.window.showInformationMessage("No tasks to show....");
      return Promise.resolve([]);
    }
  }

  generateItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  private getGroups(): Dependency[] {
    var myDay = new Dependency(
      "MyDay",
      vscode.TreeItemCollapsibleState.Collapsed
    );
    var all = new Dependency("All", vscode.TreeItemCollapsibleState.Collapsed);
    var groups: Dependency[] = [myDay, all];

    return groups;
  }
}

export class Dependency extends vscode.TreeItem {
  children: Dependency[] | undefined;

  constructor(
    public readonly groupName: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(groupName, collapsibleState);
  }
  iconPath = {
    light: path.join(__filename, "..", "..", "src", "resources", "logo.png"),
    dark: path.join(__filename, "..", "..", "Src", "resources", "logo.png"),
  };

  contextValue = "dependency";
}
