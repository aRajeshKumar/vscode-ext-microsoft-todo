// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ToDoProvider, ToDoItem } from "./ToDoProvider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "todo" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("todo.helloWorld", () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage("Hello World from ToDo!");
  });

  const todoProvider = new ToDoProvider();
  vscode.window.registerTreeDataProvider("todoView", todoProvider);
  //vscode.commands.registerCommand("todoView.refreshEntry", () =>
  //  todoProvider.refresh()
  //);

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
