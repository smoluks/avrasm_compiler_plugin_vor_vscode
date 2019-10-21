import * as vscode from "vscode";
import * as path from "path";
import { IncludeFile, CompilerParams } from "./types";
import { TextDecoder } from "util";

//pattern to find mcu name in inc file
const targetMcuRegex = /Target MCU.*/i;

export class OptionsPanel {
  public static panelIdentifier = "avrasm";
  public static currentPanel: OptionsPanel | undefined;

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;
  private readonly _compilerParams: CompilerParams;
  private readonly _outputChannel: vscode.OutputChannel;
  private _includeFiles: IncludeFile[] = [];
  private _disposables: vscode.Disposable[] = [];
  outputChannel: any;

  private constructor(
    panel: vscode.WebviewPanel,
    extensionPath: string,
    compilerParams: CompilerParams,
    outputChannel: vscode.OutputChannel
  ) {
    this._panel = panel;
    this._extensionPath = extensionPath;
    this._compilerParams = compilerParams;
    this._outputChannel = outputChannel;

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // User changed current opened tab handler
    this._panel.onDidChangeViewState(
      e => {
        //if user select this panel
        if (this._panel.visible) {
          this._updateWebViewHtml();
        }
      },
      null,
      this._disposables
    );

    //request from front handler
    this._panel.webview.onDidReceiveMessage(
      message => {
        if (message["incfile"]) {
          compilerParams.includeFile = message["incfile"];
        }
        if (message["mainfile"]) {
          compilerParams.mainAsmFile = message["mainfile"];
        }
        if (message["compilerfile"]) {
          compilerParams.compilerFile = message["compilerfile"];
        }
      },
      null,
      this._disposables
    );

    this.parceIncludeFiles().then(() => {
      this._updateWebViewHtml();
    });
  }

  public dispose() {
    OptionsPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  public static createOrShow(
    extensionPath: string,
    compilerParams: CompilerParams,
    outputChannel: vscode.OutputChannel,
    webviewpanel?: vscode.WebviewPanel
  ) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (OptionsPanel.currentPanel) {
      OptionsPanel.currentPanel._panel.reveal(column);
      return;
    }

    // Otherwise, create a new panel.
    const panel =
      webviewpanel ||
      vscode.window.createWebviewPanel(
        OptionsPanel.panelIdentifier,
        "AVRASM Compiler options",
        column || vscode.ViewColumn.One,
        {
          // Enable javascript in the webview
          enableScripts: true,

          // And restrict the webview to only loading content from our extension's `media` directory.
          localResourceRoots: [
            vscode.Uri.file(path.join(extensionPath, "media"))
          ]
        }
      );

    OptionsPanel.currentPanel = new OptionsPanel(
      panel,
      extensionPath,
      compilerParams,
      outputChannel
    );
  }

  private _updateWebViewHtml() {
    const webview = this._panel.webview;

    this._panel.webview.html = this._getHtmlForWebview(webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Local path to main script run in the webview
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.file(path.join(this._extensionPath, "media", "main.js"))
    );

    const cssUri = webview.asWebviewUri(
      vscode.Uri.file(path.join(this._extensionPath, "media", "main.css"))
    );

    // Use a nonce to whitelist which scripts can be run
    const nonce = this.getNonce();

    return `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${
                    webview.cspSource
                  } https:; script-src 'nonce-${nonce}'; style-src ${
      webview.cspSource
    };"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <link href="${cssUri}" rel="stylesheet">
                  <title>AVRASM: settings</title>
              </head>
              <body>
              <table style="width:100%">
              <col width="10%">
              <col width="1">
              <tr>         
                <td>Main file:</td>
                <td><input id="mainfile-input" name="mainfile" value="${
                  this._compilerParams.mainAsmFile
                }" type="text"></td>
              </tr>
              <tr>
                <td>MCU:</td>
                <td><select id="mcu-select">
                ${this.getIncludesHtmlselector()}             
                </select></td>
              </tr>
              <tr>
                <td>AVRASM binary:</td>
                <td><input id="compiler-folder-input" name="folder" value="${
                  this._compilerParams.compilerFile
                }" type="text"></td>
              </tr>
              </table>
              <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
  }

  //Generate HTML select element values
  getIncludesHtmlselector(): string {
    var result = "";

    for (let includeFile of this._includeFiles) {
      if (this._compilerParams.includeFile === includeFile.filename) {
        result += `<option value="${includeFile.filename}" selected>${includeFile.mcu}</option>`;
      } else {
        result += `<option value="${includeFile.filename}">${includeFile.mcu}</option>`;
      }
    }
    return result;
  }

  getNonce() {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  //Create list of inc files name and target mcu
  async parceIncludeFiles(): Promise<void> {
    try {
      var incFiles = await vscode.workspace.fs.readDirectory(
        vscode.Uri.file(path.join(this._extensionPath, "inc"))
      );

      for (let file of incFiles) {
        try {
          var binary = await vscode.workspace.fs.readFile(
            vscode.Uri.file(path.join(this._extensionPath, "inc", file[0]))
          );

          var str = new TextDecoder("utf-8").decode(binary);
          var targetMcus = str.match(targetMcuRegex);

          if (targetMcus && targetMcus.length > 0) {
            this._includeFiles.push(new IncludeFile(file[0], targetMcus));
          } else {
            this._includeFiles.push(new IncludeFile(file[0], [file[0]]));
          }
        } catch (e) {
          this._outputChannel.appendLine(`Error reading file ${file[0]}: ` + e);
        }
      }
    } catch (e) {
      this._outputChannel.appendLine("Error reading inc directory: " + e);
    }
  }
}
