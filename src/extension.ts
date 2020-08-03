/**
 * reference --
 * https://code.visualstudio.com/api/extension-guides/tree-view
 */

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ToDoProvider, ToDoTaskFolder } from "./ToDoProvider";
import * as _ from "lodash"
import * as addTasks from "./addTask";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "todo" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("todo.helloWorld", (e) => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    console.log("%j", e);
    vscode.window.showInformationMessage("Hello World from ToDo!");
  });


  async function handleAddTask() {
    vscode.window.showInformationMessage("Add Task cmd");
    let listOfFolders: string = _.map(ToDoProvider.toDoTaskFloderLists, 'displayName').join(',').toString();
    let options: vscode.InputBoxOptions = {
      value: "Add your task",
      prompt: "Add your task subject in the input box(Ex - Buy milk on sunday in groceryList)" +
        "select from your folder Lists - " + listOfFolders,
      placeHolder: "Add Task",
      ignoreFocusOut: true
    }
    let userInput: any = await vscode.window.showInputBox(options);
    console.log(userInput);
    addTasks.addTask.addTask(userInput);
  }

  const todoProvider = new ToDoProvider();
  vscode.window.registerTreeDataProvider("todoView", todoProvider);
  vscode.commands.registerCommand("todoView.refreshEntry", () =>
    todoProvider.refresh()
  );

  // to do add task command palette.
  let addTask = vscode.commands.registerCommand('todo.addTask', handleAddTask);

  context.subscriptions.push(disposable, addTask);
}

// this method is called when your extension is deactivated
export function deactivate() { }
