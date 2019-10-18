import * as vscode from "vscode";
import { OptionsPanel } from "./options";
import { CompileManager } from "./compile";
import { CompilerParams } from "./types";

export function activate(context: vscode.ExtensionContext) {
  //output
  var outputChannel = vscode.window.createOutputChannel("avrasm2 output");
  var compilerParams = new CompilerParams();

  //command: open settings
  context.subscriptions.push(
    vscode.commands.registerCommand("avrasm.options", () => {
      OptionsPanel.createOrShow(context.extensionPath, compilerParams);
    })
  );

  context.subscriptions.push(
    vscode.window.registerWebviewPanelSerializer("avrasm", {
      async deserializeWebviewPanel(
        webviewPanel: vscode.WebviewPanel,
        state: any
      ) {
        console.log(`Got state: ${JSON.stringify(state)}`);

        if (state["incfile"]) {
          compilerParams.incfile = state["incfile"];
        }
        if (state["mainfile"]) {
          compilerParams.mainfile = state["mainfile"];
        }
        if (state["compilerFolder"]) {
          compilerParams.avrasmfolder = state["compilerFolder"];
        }

        OptionsPanel.createOrShow(
          context.extensionPath,
          compilerParams,
          webviewPanel
        );
      }
    })
  );

  //command: compile
  context.subscriptions.push(
    vscode.commands.registerCommand("avrasm.compile", () =>
      CompileManager.compile(
        context.extensionPath,
        compilerParams,
        outputChannel
      )
    )
  );
}

export function deactivate() {}
