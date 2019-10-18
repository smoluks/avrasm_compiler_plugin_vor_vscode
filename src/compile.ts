import * as vscode from "vscode";
import * as path from "path";
import { CompilerParams } from "./types";

export class CompileManager {
  public static async compile(
    extensionPath: string,
    compilerParams: CompilerParams,
    outputChannel: vscode.OutputChannel
  ) {
    if (vscode.workspace.workspaceFolders === undefined) {
      vscode.window.showErrorMessage("No folders opened");
      return;
    }

    const compilerPath = `"${compilerParams.avrasmfolder}/avrasm2"`;

    var compilerString = ` -fI -i "${path.join(
      extensionPath,
      "inc",
      compilerParams.incfile
    )}"`;

    vscode.workspace.workspaceFolders.forEach(folder => {
      compilerString += ` -l "${folder.uri.fsPath}"`;
    });

    compilerString += ` "${vscode.workspace.workspaceFolders[0].uri.fsPath}/main.asm"`;

    outputChannel.clear();
    outputChannel.show();

    const cp = require("child_process");
    cp.exec(
      compilerPath + compilerString,
      (err: string, stdout: string, stderr: string) => {
        console.log("stdout: " + stdout);
        outputChannel.append(stdout.toString());
        console.log("stderr: " + stderr);
        if (err) {
          console.log("error: " + err);
          outputChannel.append(err.toString());
        }
      }
    );

    outputChannel.append("Done!");
  }
}
