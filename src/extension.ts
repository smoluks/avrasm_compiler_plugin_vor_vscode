import * as vscode from "vscode";
import { OptionsPanel } from "./options";
import { CompileManager } from "./compile";
import { CompilerParams } from "./types";

var outputChannel = vscode.window.createOutputChannel("avrasm2 output");

export function activate(context: vscode.ExtensionContext) {
  var _compilerParams = new CompilerParams();

  //restore params handler
  context.subscriptions.push(
    vscode.window.registerWebviewPanelSerializer(OptionsPanel.panelIdentifier, {
      async deserializeWebviewPanel(
        webviewPanel: vscode.WebviewPanel,
        state: any
      ) {
        console.log("State: " + JSON.stringify(state));
        if (state && state["incfile"]) {
          _compilerParams.includeFile = state["incfile"];
        }
        if (state && state["mainfile"]) {
          _compilerParams.mainAsmFile = state["mainfile"];
        }
        if (state && state["compilerfile"]) {
          _compilerParams.compilerFile = state["compilerfile"];
        }
        if (state && state["outputtype"]) {
          _compilerParams.outputFormat = state["outputtype"];
        }
        if (state && state["outputfile"]) {
          _compilerParams.outputFile = state["outputfile"];
        }

        OptionsPanel.createOrShow(
          context.extensionPath,
          _compilerParams,
          outputChannel,
          webviewPanel
        );
      }
    })
  );

  //command: open settings
  context.subscriptions.push(
    vscode.commands.registerCommand("avrasm.options", () => {
      OptionsPanel.createOrShow(
        context.extensionPath,
        _compilerParams,
        outputChannel
      );
    })
  );

  //command: compile
  context.subscriptions.push(
    vscode.commands.registerCommand("avrasm.compile", () =>
      CompileManager.compile(
        context.extensionPath,
        _compilerParams,
        outputChannel
      )
    )
  );
}

export function deactivate() {
  outputChannel.dispose();
}
