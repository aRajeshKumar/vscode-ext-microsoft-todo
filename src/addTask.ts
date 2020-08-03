import * as vscode from "vscode";
import { v1 as uuidv1 } from "uuid";
import { ToDoTaskFolder, ToDoProvider } from './ToDoProvider';
import { ITask } from "./interfaces/ITask";
export class addTask {

    constructor() {

    }

    public static addTask(subject: string) {
        let splitSubjectFolder: string[] = subject.split("in");
        let destinationFolder = splitSubjectFolder[1];
        let actualSubject = splitSubjectFolder[0];

        for (let i = 0; i < ToDoProvider.folderList.length; i++) {
            if (ToDoProvider.folderList[i].name === destinationFolder) {

                // call the Add Task API with folder Id(folderList[i].id).
                // To Do Find out the add task API on graph and integrate it.
                ToDoProvider.folderList[i].children.push(new ToDoTaskFolder('new task', actualSubject, vscode.TreeItemCollapsibleState.None));
                // break here once the adding task completed.
                break;
            }
        }
        vscode.window.showInformationMessage(subject);
    }

    private __preapreTaskData(data : ITask): ITask {
        let localId: string = this.__generateLocalId();
        let taskData: ITask = {
            Id: localId,
            Subject: data.Subject
        }
        return taskData;
    }

    private __generateLocalId(): string {

        return "LOCAL_ID_" + uuidv1();
    }

}