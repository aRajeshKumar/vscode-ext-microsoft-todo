import * as vscode from "vscode";
import { pathToFileURL } from "url";
import path = require("path");
import { ToDoItemImportance, ToDoItemStatus } from "./models/ToDoItem";
import { TimeZone } from "./models/TimeZone";
import * as axios from "axios";

export class ToDoProvider implements vscode.TreeDataProvider<ToDoItem> {
  todoItemGroup: ToDoItem[] = [];
  listItem: ToDoItem | undefined;
  private httpClient: any;
  private isRefreshing: boolean = false;
  private accessToken: string =
    "eyJ0eXAiOiJKV1QiLCJub25jZSI6IkNHN1FVWG5rcm1nckcxMTZCY0pkRnJucXlDS3RxZkg0RU5LWms0dDVHZmsiLCJhbGciOiJSUzI1NiIsIng1dCI6IkN0VHVoTUptRDVNN0RMZHpEMnYyeDNRS1NSWSIsImtpZCI6IkN0VHVoTUptRDVNN0RMZHpEMnYyeDNRS1NSWSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNTg5ODkwMzY2LCJuYmYiOjE1ODk4OTAzNjYsImV4cCI6MTU4OTg5NDI2NiwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhQQUFBQTlxNlE5QkdhQi9QM25NMllBbGNua0g5N0ErNGxQeE8zYXU5Qlo0TkIwU2ViaFpvUExITXJMc251aDFqb2F0YldpRFVFVUJTVzhEaDN1OXFsRVovTDF3PT0iLCJhbXIiOlsicnNhIiwibWZhIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIGV4cGxvcmVyIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJkZXZpY2VpZCI6IjlhYzllMTE2LWE1NjQtNGU1Yy1iZWRjLThjOTg4MjFmZTg1YSIsImZhbWlseV9uYW1lIjoiQWdnYW5pIiwiZ2l2ZW5fbmFtZSI6IlJhamVzaCBLdW1hciIsImlwYWRkciI6IjE4My44My4xMzguMTc4IiwibmFtZSI6IlJhamVzaCBLdW1hciBBZ2dhbmkiLCJvaWQiOiI5MjVkZjZiMC0zY2UxLTRkZGEtYjdlOS0wNTM3Y2Q3ZTM3MzAiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjE0Njc3MzA4NS05MDMzNjMyODUtNzE5MzQ0NzA3LTE1Njk4NzciLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzNGRkY4NEUzNTQyMiIsInNjcCI6IkNhbGVuZGFycy5SZWFkV3JpdGUgQ29udGFjdHMuUmVhZFdyaXRlIERldmljZU1hbmFnZW1lbnRBcHBzLlJlYWRXcml0ZS5BbGwgRGV2aWNlTWFuYWdlbWVudENvbmZpZ3VyYXRpb24uUmVhZC5BbGwgRGV2aWNlTWFuYWdlbWVudENvbmZpZ3VyYXRpb24uUmVhZFdyaXRlLkFsbCBEZXZpY2VNYW5hZ2VtZW50TWFuYWdlZERldmljZXMuUHJpdmlsZWdlZE9wZXJhdGlvbnMuQWxsIERldmljZU1hbmFnZW1lbnRNYW5hZ2VkRGV2aWNlcy5SZWFkLkFsbCBEZXZpY2VNYW5hZ2VtZW50TWFuYWdlZERldmljZXMuUmVhZFdyaXRlLkFsbCBEZXZpY2VNYW5hZ2VtZW50UkJBQy5SZWFkLkFsbCBEZXZpY2VNYW5hZ2VtZW50UkJBQy5SZWFkV3JpdGUuQWxsIERldmljZU1hbmFnZW1lbnRTZXJ2aWNlQ29uZmlnLlJlYWQuQWxsIERldmljZU1hbmFnZW1lbnRTZXJ2aWNlQ29uZmlnLlJlYWRXcml0ZS5BbGwgRGlyZWN0b3J5LkFjY2Vzc0FzVXNlci5BbGwgRGlyZWN0b3J5LlJlYWRXcml0ZS5BbGwgRmlsZXMuUmVhZFdyaXRlLkFsbCBHcm91cC5SZWFkV3JpdGUuQWxsIElkZW50aXR5Umlza0V2ZW50LlJlYWQuQWxsIE1haWwuUmVhZFdyaXRlIE1haWxib3hTZXR0aW5ncy5SZWFkV3JpdGUgTm90ZXMuUmVhZFdyaXRlLkFsbCBvcGVuaWQgUGVvcGxlLlJlYWQgcHJvZmlsZSBSZXBvcnRzLlJlYWQuQWxsIFNpdGVzLlJlYWRXcml0ZS5BbGwgVGFza3MuUmVhZFdyaXRlIFVzZXIuUmVhZCBVc2VyLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkV3JpdGUgVXNlci5SZWFkV3JpdGUuQWxsIGVtYWlsIiwic2lnbmluX3N0YXRlIjpbImR2Y19tbmdkIiwiZHZjX2NtcCIsImR2Y19kbWpkIiwia21zaSJdLCJzdWIiOiJkM0t5ZlpKNmFlLUhLM3V6OVVQQThNY0ZsRkRjSlFGM0MteF9SSjA0V2NvIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidW5pcXVlX25hbWUiOiJyYWFnZ2FuaUBtaWNyb3NvZnQuY29tIiwidXBuIjoicmFhZ2dhbmlAbWljcm9zb2Z0LmNvbSIsInV0aSI6IjZ5eUJBRkZlTzBhX1JmM2JCNmlQQVEiLCJ2ZXIiOiIxLjAiLCJ4bXNfc3QiOnsic3ViIjoidmtDakZkNDZHTVVaam1CYm13Q1dPZDRPWlQ1SEpCNmNPVUU0OV93VTI1OCJ9LCJ4bXNfdGNkdCI6MTI4OTI0MTU0N30.IcuH86cWVEz-LUMr0gLpSSKmLTGhNjH7ZQ2WhXd0M41sfeRPt6D_WBOo6s2MSbrS7mRyOzF42lNBLVdpV7XKSgupDgJ4mUC9ecHDNRB6pfDCveX6BF5zUuPWGsOFDX7YCBNP1_b1PLJiFSSrpOzvbwQ6PlWKzgKawqVBFfeFKRB14mtVmxmAIT326aigmP0WAbbRGF5HMB6LOSc3KDfwVQp83x0PKnB_bGA-gWS3LqyamllCh8t2Wg3OzDmivhWRK1jaQXVUrqINVXn__AVpxM6r1tapuMTYXUQJuC2jNRMo7oVXUbpDdMS1EpfRnttFJC7z2-2kOUQtELRHqCLvAw";

  private _onDidChangeTreeData: vscode.EventEmitter<
    ToDoItem | null | undefined | void
  > = new vscode.EventEmitter(); // Here your types do not include undefined.
  readonly onDidChangeTreeData?: vscode.Event<
    ToDoItem | undefined | null | void
  > = this._onDidChangeTreeData.event; // Here you specify ToDoItem | undefined | null as the types for the generic

  constructor() {
    this.httpClient = require("axios").default;
    this.getLists();
  }

  refresh(item: ToDoItem): void {
    this._onDidChangeTreeData.fire(item);
  }

  refreshList(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ToDoItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  async getChildren(element?: ToDoItem | undefined): Promise<ToDoItem[]> {
    if (this.isRefreshing) {
      return Promise.resolve([]);
    }

    if (element === undefined) {
      return Promise.resolve(this.todoItemGroup);
    } else {
      vscode.window.showInformationMessage("No tasks to show....");
      return Promise.resolve(element.children);
    }
  }

  generateItem(element: ToDoItem): vscode.TreeItem {
    return element;
  }

  public getLists(): ToDoItem[] {
    this.httpClient
      .get("https://graph.microsoft.com/beta/me/todo/lists", {
        headers: {
          Authorization: "Bearer " + this.accessToken,
        },
      })
      .then(this.handleListsResponse)
      .catch(this.handleListsError);

    return [];
  }

  public getTasks(list: ToDoItem): void {
    vscode.window.showInformationMessage(
      "https://graph.microsoft.com/beta/me/todo/lists/" + list.id + "/tasks"
    );

    this.httpClient
      .get(
        "https://graph.microsoft.com/beta/me/todo/lists/" + list.id + "/tasks",
        {
          headers: {
            Authorization: "Bearer " + this.accessToken,
          },
        }
      )
      .then((response: axios.AxiosResponse) => {
        list.children = [];

        response.data.value.forEach((element: any) => {
          var taskItem = new ToDoItem(
            element.id,
            element.title,
            false,
            false,
            ""
          );
          list.children.push(taskItem);
          vscode.window.showInformationMessage(element.title);
        });

        const index = this.todoItemGroup.findIndex(
          (item) => item.id === list.id
        );
        const tempArray = [
          ...this.todoItemGroup.slice(0, index),
          list,
          ...this.todoItemGroup.slice(index + 1),
        ];
        this.todoItemGroup = [...tempArray];
      })
      .catch(this.handleListsError);
  }

  handleListsResponse = (response: axios.AxiosResponse) => {
    response.data.value.forEach((element: any) => {
      var listItem = new ToDoItem(
        element.id,
        element.displayName,
        element.isOwner,
        element.isShared,
        element.wellKnownListName
      );
      this.listItem = listItem;
      this.todoItemGroup.push(this.listItem);
      this.getTasks(listItem);
    });
    //this.isRefreshing = true;
    this.refreshList();
    //this.isRefreshing = false;
  };

  handleListsError = (error: axios.AxiosError) => {
    vscode.window.showErrorMessage(error.message);
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else {
      console.log(error.message);
    }
  };
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
