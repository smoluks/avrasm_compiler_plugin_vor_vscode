import * as vscode from "vscode";
import { Parameters, LptExitState } from "./types/parameters";

export class FlashManager {
  static async flash(
    extensionPath: string,
    _params: Parameters,
    outputChannel: import("vscode").OutputChannel
  ) {
    var files = await vscode.workspace.findFiles(
      _params.mainAsmFile.replace(".asm", ".hex"),
      "**/node_modules/**",
      1
    );

    if (files.length === 0) {
      vscode.window.showErrorMessage(
        `${_params.mainAsmFile} not found. Please set correct main asm file.`
      );
      return;
    }
    var firmwareFile = files[0];

    var command = `"${_params.avrdudeFile}" -p ${_params.avrdudeMcu} -c usbasp -U flash:w:${firmwareFile.fsPath}:i`;

    if (_params.uartBaudrate) {
      command += ` -b ${_params.uartBaudrate}`;
    }

    if (_params.bitrate) {
      command += ` -B ${_params.bitrate}`;
    }

    if (_params.disableErase) {
      command += " -D";
    }

    if (_params.chipErase) {
      command += " -e";
    }

    if (_params.lptExitState !== LptExitState.default) {
      command += ` -E ${_params.lptExitState}`;
    }

    if (_params.disableSignatureCheck) {
      command += " -F";
    }

    if (_params.delay) {
      command += ` -i ${_params.delay}`;
    }

    if (_params.port) {
      command += ` -P ${_params.port}`;
    }

    //clean outputChannel
    outputChannel.clear();
    outputChannel.show();

    //call compiler
    console.log(command);
    const cp = require("child_process");
    cp.exec(command, (err: string, stdout: string, stderr: string) => {
      outputChannel.append(stdout.toString());
      if (err) {
        outputChannel.append(err.toString());
      }

      outputChannel.appendLine("Done!");
    });
  }
}
