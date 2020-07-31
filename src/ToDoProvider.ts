import * as vscode from "vscode";
import path = require("path");
import * as _ from "lodash";
import { ToDoItemImportance, ToDoItemStatus } from "./models/ToDoItem";
import { TimeZone } from "./models/TimeZone";
import { accessToken } from "./config/tokenConfig";
import { APIs } from './config/graphAPIs'
import { httpClient } from './common/httpClient'

export class ToDoProvider implements vscode.TreeDataProvider<ToDoTaskFolder> {
    private toDoTaskFloderLists: ToDoTaskFolder[] = [];
    private isRefreshing: boolean = false;

    private accessToken = process.env.ACCESS_TOKEN || accessToken;

    private _onDidChangeTreeData: vscode.EventEmitter<ToDoTaskFolder | null | undefined | void> = new vscode.EventEmitter(); // Here your types do not include undefined.
    readonly onDidChangeTreeData?: vscode.Event<ToDoTaskFolder | undefined | null | void> = this._onDidChangeTreeData.event; // Here you specify ToDoItem | undefined | null as the types for the generic

    refresh(): void {
        this._onDidChangeTreeData.fire(null);
    }

    refreshList(): void {
        this._onDidChangeTreeData.fire(null);
    }

    getTreeItem(element: ToDoTaskFolder): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    async getChildren(element?: ToDoTaskFolder): Promise<ToDoTaskFolder[]> {
        if (this.isRefreshing) {
            return Promise.resolve([]);
        }

        if (element === undefined) {
            await this.getAllTaskFolders();
            let folderList: ToDoTaskFolder[] = [];
            this.toDoTaskFloderLists.forEach((element: any) => {
                let folderItem: ToDoTaskFolder = new ToDoTaskFolder(element.id ? element.id : "", element.displayName ? element.displayName : "", vscode.TreeItemCollapsibleState.Collapsed);
                folderList.push(folderItem);
            });
            await this.__setTasksOfAllFoldersAsChildren(folderList);
            return Promise.resolve(folderList);
        } else {
            if (!element.children.length)
                vscode.window.showInformationMessage("No tasks to show....");
            return Promise.resolve(element.children);
        }
    }

    private __setTasksOfAllFoldersAsChildren(folderLists: ToDoTaskFolder[]): Promise<void> {
        let findTasksList: any[] = [];

        // create an array of promises for promise.all call. we want 
        // to fetch the tasks from folders in parallel to improve the perf.
        for (let i = 0; i < folderLists.length; i++) {
            let folderId: string = folderLists[i].id || "";
            if (folderId && folderId.length > 0)
                findTasksList.push(this.__getTasksFromFolderId(folderId));
        }
        return new Promise<void>((resolve, reject) => {
            Promise.all(findTasksList)
                .then((responseArray) => {
                    // set the children property of class ToDoTaskFolder
                    if (!responseArray || !responseArray.length)
                        return resolve();
                    for (let i = 0; i < responseArray.length; i++) {
                        if (!_.get(responseArray[i], 'err')     
                            && _.get(responseArray[i], 'result') 
                            && _.get(responseArray[i], 'result.data') 
                            && _.get(responseArray[i], 'result.data.value').length > 0) {
                            let tasksList: any[] = _.get(responseArray[i], 'result.data.value');
                            for (let j = 0; j < tasksList.length; j++) {
                                let task: ToDoTaskFolder = new ToDoTaskFolder(tasksList[j].id, tasksList[j].title, vscode.TreeItemCollapsibleState.None);
                                folderLists[i].children.push(task);
                            }
                        }
                    }
                    return resolve();
                })
                .catch((err) => { return resolve()})
        })
    }

    private async __getTasksFromFolderId(folderId: string) {
        return new Promise<{ err: any, result: any[] }>(async (resolve, reject) => {
            // call the API to get all the tasks inside a folder. If not return []
            let tasksAPIOptions: any = {
                url: APIs.taskAPI.url.replace("{}", folderId),
                timeout: APIs.taskAPI.timeout,
                method: APIs.taskAPI.method,
                headers: {
                    Authorization: "Bearer " + this.accessToken
                }
            }
            let result: { err: any, response: any } = await httpClient.GET(tasksAPIOptions);
            if (result.err || !result.response) {
                /*  we don't want to reject here, in case we get any error from any folder we will
                    send empty array. we will not show any task under this folder
                    but we will not block the folder's which are having the tasks under it.
                 */
                return resolve({ err: result.err, result: [] });
            }
            return resolve({ err: null, result: result.response });
        })
    }

    generateItem(element: ToDoTaskFolder): vscode.TreeItem {
        return element;
    }

    /**
     * @param null
     * @returns list of folders (every folder contaning tasks)
     */
    private async getAllTaskFolders() {

        let options = {
            url: APIs.listAPI.url,
            timeout: APIs.listAPI.timeout,
            method: APIs.listAPI.method,
            headers: {
                Authorization: "Bearer " + this.accessToken
            }
        }

        let apiResult = await httpClient.GET(options);
        if (apiResult.err) {
            this.handleListsError(apiResult.err);
        } else {
            this.toDoTaskFloderLists = apiResult.response &&
                apiResult.response.data &&
                apiResult.response.data.value || [];
        }
    }

    handleListsError = (error: any) => {
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
export class ToDoTaskFolder extends vscode.TreeItem {
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
    public children: ToDoTaskFolder[];
    public collapsibleState : vscode.TreeItemCollapsibleState | vscode.TreeItemCollapsibleState.Collapsed

    constructor(id: string, name: string, collapseState : vscode.TreeItemCollapsibleState) {
        super(name);
        this.id = id;
        this.name = name;
        this.children = [];
        this.collapsibleState = collapseState;
    }
    iconPath = {
        light: path.join(__filename, "..", "..", "resources", "light", "logo.png"),
        dark: path.join(__filename, "..", "..", "resources", "dark", "logo.png"),
    };
    get tooltip(): string {
        return `${this.name}`
    }
}


