import * as vscode from "vscode";
import * as path from "path";
import { ParametersManager } from "./types/parameters";
import { workspace } from "vscode";
import { OutputFormatEnum } from "./types/outputFormat";

export class CompileManager {
  public static async compile(
    extensionPath: string,
    compilerParams: ParametersManager,
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
      compilerParams.getParam("mainAsmFile"),
      "**/node_modules/**",
      1
    );

    if (files.length === 0) {
      vscode.window.showErrorMessage(
        `${compilerParams.getParam("mainAsmFile")} not found. Please set correct main asm file.`
      );
      return;
    }

    var mainFileUri = files[0];

    //
    if (compilerParams.getParam("saveOnBuild")) {
      workspace.saveAll();
    }

    //----build compile command----
    var compilerString = `"${compilerParams.getParam("compilerFile")}"`;

    //output format
    switch (+compilerParams.getParam("outputFormat")) {
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
    if (compilerParams.getParam("outputFile") && compilerParams.getParam("outputFile").length > 0) {
      compilerString += ` -o "${compilerParams.getParam("outputFile")}"`;
    }

    //inc file
    compilerString += ` -i "${path.join(
      extensionPath,
      "inc",
      compilerParams.getParam("includeFile")
    )}"`;

    //workspace folders
    vscode.workspace.workspaceFolders.forEach(folder => {
      compilerString += ` -l "${folder.uri.fsPath}"`;
    });

    //defines
    if (compilerParams.getParam("defines") && compilerParams.getParam("defines").length > 0) {
      for (let def of compilerParams.getParam("defines").split("\n")) {
        compilerString += ` -D "${def}"`;
      }
    }

    //full statistic
    if (compilerParams.getParam("fullStatistic")) {
      compilerString += ` -vs`;
    }

    //main file
    compilerString += ` "${mainFileUri.fsPath}"`;

    //clean outputChannel
    outputChannel.clear();
    outputChannel.show();
    outputChannel.appendLine("Start compile...");

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
