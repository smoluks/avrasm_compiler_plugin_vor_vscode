import * as vscode from "vscode";
import { OptionsPanel } from "./optionsManager";
import { CompileManager } from "./compilemanager";
import { Parameters } from "./types/parameters";
import { FlashManager } from "./flashManager";

var outputChannel = vscode.window.createOutputChannel("avrasm2 output");

export function activate(context: vscode.ExtensionContext) {
  var _params = new Parameters();

  //restore params handler
  context.subscriptions.push(
    vscode.window.registerWebviewPanelSerializer(OptionsPanel.panelIdentifier, {
      async deserializeWebviewPanel(
        webviewPanel: vscode.WebviewPanel,
        state: any
      ) {
        console.log("State: " + JSON.stringify(state));

        _params.setParams(state);

        OptionsPanel.createOrShow(
          context.extensionPath,
          _params,
          outputChannel,
          webviewPanel
        );
      }
    })
  );

  //command: open settings
  context.subscriptions.push(
    vscode.commands.registerCommand("avrasm.options", () => {
      OptionsPanel.createOrShow(context.extensionPath, _params, outputChannel);
    })
  );

  //command: compile
  context.subscriptions.push(
    vscode.commands.registerCommand("avrasm.compile", () =>
      CompileManager.compile(context.extensionPath, _params, outputChannel)
    )
  );

  //command: flash
  context.subscriptions.push(
    vscode.commands.registerCommand("avrasm.flash", () =>
      FlashManager.flash(context.extensionPath, _params, outputChannel)
    )
  );
}

export function deactivate() {
  outputChannel.dispose();
}
