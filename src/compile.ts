import * as vscode from "vscode";
import * as path from "path";
import { CompilerParams, OutputFormatEnum } from "./types";

export class CompileManager {
  public static async compile(
    extensionPath: string,
    compilerParams: CompilerParams,
    outputChannel: vscode.OutputChannel
  ) {
    //----checks----
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

    //----build compile command----
    var compilerString = `"${compilerParams.compilerFile}"`;

    //output format
    switch (+compilerParams.outputFormat) {
      case OutputFormatEnum.AtmelStudio:
        compilerString += " -fO";
        break;
      case OutputFormatEnum.MotorolaHex:
        compilerString += " -fM";
        break;
      case OutputFormatEnum.IntelHex:
        compilerString += " -fI";
        break;
      case OutputFormatEnum.GenericHex:
        compilerString += " -fG";
        break;
      case OutputFormatEnum.NoOutput:
        compilerString += " -f-";
        break;
    }

    //output file
    if (compilerParams.outputFile && compilerParams.outputFile.length > 0) {
      compilerString += ` -o "${compilerParams.outputFile}"`;
    }

    //inc file
    compilerString += ` -i "${path.join(
      extensionPath,
      "inc",
      compilerParams.includeFile
    )}"`;

    //workspace folders
    vscode.workspace.workspaceFolders.forEach(folder => {
      compilerString += ` -l "${folder.uri.fsPath}"`;
    });

    //main file
    compilerString += ` "${mainFileUri.fsPath}"`;

    //---- ----
    //clean outputChannel
    outputChannel.clear();
    outputChannel.show();

    //call compiler
    console.log(compilerString);
    const cp = require("child_process");
    cp.exec(compilerString, (err: string, stdout: string, stderr: string) => {
      outputChannel.append(stdout.toString());
      if (err) {
        outputChannel.append(err.toString());
      }

      outputChannel.appendLine("Done!");
    });
  }
}
