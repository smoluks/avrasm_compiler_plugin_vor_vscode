import * as vscode from "vscode";
import * as path from "path";
import { IncludeFile, CompilerParams } from "./types";
import { TextDecoder } from "util";

export class OptionsPanel {
  public static currentPanel: OptionsPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;
  private readonly _compilerParams: CompilerParams;
  private _includeFiles: IncludeFile[] = [];
  private targetMcuRegex = /Target MCU.*/i;

  private _disposables: vscode.Disposable[] = [];

  private constructor(
    panel: vscode.WebviewPanel,
    extensionPath: string,
    compilerParams: CompilerParams
  ) {
    this._panel = panel;
    this._extensionPath = extensionPath;
    this._compilerParams = compilerParams;

    this._updateWebViewHtml(true);

    this.parceIncludeFiles();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // User changed current opened tab
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

    this._panel.webview.onDidReceiveMessage(
      message => {
        console.log(`Got message: ${JSON.stringify(message)}`);

        if (message["incfile"]) {
          compilerParams.incfile = message["incfile"];
        }
        if (message["mainfile"]) {
          compilerParams.mainfile = message["mainfile"];
        }
        if (message["compilerFolder"]) {
          compilerParams.avrasmfolder = message["compilerFolder"];
        }
      },
      null,
      this._disposables
    );
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
        "avrasm",
        "avrasm options",
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
      compilerParams
    );
  }

  private _updateWebViewHtml(isLoading?: boolean) {
    const webview = this._panel.webview;

    if (isLoading) {
      this._panel.webview.html = this._getHtmlForLoading(webview);
    } else {
      this._panel.webview.html = this._getHtmlForWebview(webview);
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Local path to main script run in the webview
    const scriptPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, "media", "main.js")
    );

    // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

    // Use a nonce to whitelist which scripts can be run
    const nonce = this.getNonce();

    return `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${
                    webview.cspSource
                  } https:; script-src 'nonce-${nonce}';">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>AVRASM: settings</title>
              </head>
              <body>
              <div>          
                Main file:
                <input id="mainfile-input" name="mainfile" value="${
                  this._compilerParams.mainfile
                }" type="text">
              </div>
              <div>
                MCU:
                <select id="mcu-select">
                ${this.getIncludesHtmlselector()}             
                </select>
              </div>
              <div>
                AVRASM binary folder:
                <input id="compiler-folder-input" name="folder" value="${
                  this._compilerParams.avrasmfolder
                }" type="text">
              </div>
              <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
  }

  private _getHtmlForLoading(webview: vscode.Webview) {
    // Local path to main script run in the webview
    const scriptPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, "media", "main.js")
    );

    // And the uri we use to load this script in the webview
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

    // Use a nonce to whitelist which scripts can be run
    const nonce = this.getNonce();

    return `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>AVRASM: settings</title>
              </head>
              <body>
              Parsing inc files...
              </body>
              </html>`;
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

  parceIncludeFiles(): void {
    vscode.workspace.fs
      .readDirectory(vscode.Uri.file(path.join(this._extensionPath, "inc")))
      .then(
        value => {
          var count = value.length;
          for (let file of value) {
            vscode.workspace.fs
              .readFile(
                vscode.Uri.file(path.join(this._extensionPath, "inc", file[0]))
              )
              .then(
                binary => {
                  var str = new TextDecoder("utf-8").decode(binary);
                  var targetMcus = str.match(this.targetMcuRegex);

                  if (targetMcus && targetMcus.length > 0) {
                    this._includeFiles.push(
                      new IncludeFile(file[0], targetMcus)
                    );
                  } else {
                    this._includeFiles.push(
                      new IncludeFile(file[0], [file[0]])
                    );
                  }

                  if (--count === 0) {
                    this._updateWebViewHtml();
                  }
                },
                error => {
                  //this.outputChannel.appendLine("Error: " + error);
                  if (--count === 0) {
                    this._updateWebViewHtml();
                  }
                }
              );
          }
        },
        error => {
          //this.outputChannel.appendLine("Error: " + error);
        }
      );
  }

  getIncludesHtmlselector(): string {
    var result = "";

    for (let includeFile of this._includeFiles) {
      if (this._compilerParams.incfile === includeFile.filename) {
        result += `<option value="${includeFile.filename}" selected>${includeFile.mcu}</option>`;
      } else {
        result += `<option value="${includeFile.filename}">${includeFile.mcu}</option>`;
      }
    }
    return result;
  }
}
