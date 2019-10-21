import * as vscode from "vscode";
import * as path from "path";
import { CompilerParams } from "./types";

export class CompileManager {
  public static async compile(
    extensionPath: string,
    compilerParams: CompilerParams,
    outputChannel: vscode.OutputChannel
  ) {
    //check workspace folders exist
    if (vscode.workspace.workspaceFolders === undefined) {
      vscode.window.showErrorMessage("No workspace folders opened");
      return;
    }

    //find main file
    var files = await vscode.workspace.findFiles(
      compilerParams.mainAsmFile,
      "**/node_modules/**",
      1
    );

    if (files.length === 0) {
      vscode.window.showErrorMessage(
        `${compilerParams.mainAsmFile} not found. Please set correct main asm file.`
      );
      return;
    }

    var mainFileUri = files[0];

    //build compile command
    var compilerString = `"${compilerParams.compilerFile}" -fI -i "${path.join(
      extensionPath,
      "inc",
      compilerParams.includeFile
    )}"`;

    vscode.workspace.workspaceFolders.forEach(folder => {
      compilerString += ` -l "${folder.uri.fsPath}"`;
    });

    compilerString += ` "${mainFileUri.fsPath}"`;

    //
    outputChannel.clear();
    outputChannel.show();

    //call compiler
    const cp = require("child_process");
    cp.exec(compilerString, (err: string, stdout: string, stderr: string) => {
      outputChannel.append(stdout.toString());
      if (err) {
        outputChannel.append(err.toString());
      }
    });

    outputChannel.append("Done!");
  }
}
