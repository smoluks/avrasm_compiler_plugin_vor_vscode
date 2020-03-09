import * as vscode from "vscode";
import * as fs from 'fs';
import { ParametersManager } from "./types/parameters";
import { LptExitState } from "./types/lptExitState";

export class FlashManager {
  static async flash(
    extensionPath: string,
    _params: ParametersManager,
    outputChannel: import("vscode").OutputChannel
  ) {

    var binaryFilePath = _params.getParam("outputFile") ?
      _params.getParam("outputFile") :
      _params.getParam("mainAsmFile").replace(".asm", ".hex");

    if (!fs.existsSync(binaryFilePath)) {

      let file = binaryFilePath.replace(/^.*[\\\/]/, '');
      var files = await vscode.workspace.findFiles(
        file,
        "**/node_modules/**",
        1
      );

      if (files.length === 0) {
        vscode.window.showErrorMessage(
          `${file} not found. Please set correct main asm file.`
        );
        return;
      }
      binaryFilePath = files[0].fsPath;
    }

    var command = `"${_params.getParam("avrdudeFile")}" -p ${_params.getParam("avrdudeMcu")} -c ${_params.getParam("programmer")}  -U flash:w:"${binaryFilePath}":i`;

    if (_params.getParam("uartBaudrate")) {
      command += ` -b ${_params.getParam("uartBaudrate")}`;
    }

    if (_params.getParam("bitrate")) {
      command += ` -B ${_params.getParam("bitrate")}`;
    }

    if (_params.getParam("disableErase")) {
      command += " -D";
    }

    if (_params.getParam("chipErase")) {
      command += " -e";
    }

    if (_params.getParam("lptExitState") !== LptExitState.default) {
      command += ` -E ${_params.getParam("lptExitState")}`;
    }

    if (_params.getParam("disableSignatureCheck")) {
      command += " -F";
    }

    if (_params.getParam("delay")) {
      command += ` -i ${_params.getParam("delay")}`;
    }

    if (_params.getParam("port")) {
      command += ` -P ${_params.getParam("port")}`;
    }

    //clean outputChannel
    outputChannel.clear();
    outputChannel.show();
    outputChannel.appendLine("Start flashing...");

    //call compiler
    console.log(command);
    const cp = require("child_process");
    cp.exec(command, (err: string, stdout: string, stderr: string) => {
      outputChannel.append(stdout.toString());
      outputChannel.append(stderr.toString());
      if (err) {
        outputChannel.append(err.toString());
      }

      outputChannel.appendLine("Done!");
    });
  }
}
