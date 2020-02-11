import * as vscode from "vscode";
import * as path from "path";
import { ParametersManager } from "./types/parameters";
import { TextDecoder } from "util";
import { IncludeFile } from "./types/includeFile";
import { AvrDudeMcu } from "./types/avrdudemcu";
import { AvrDudeProgrammer } from "./types/avrdudeprogrammer";
import { GetOutputFormatDescription } from "./types/outputFormat";

//pattern to find mcu name in inc file
const targetMcuRegex = /Target MCU.*/i;

export class OptionsPanel {
  public static panelIdentifier = "avrasm";
  public static currentPanel: OptionsPanel | undefined;

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;
  private readonly _compilerParams: ParametersManager;
  private readonly _outputChannel: vscode.OutputChannel;
  private _includeFiles: IncludeFile[] = [];
  private _disposables: vscode.Disposable[] = [];
  outputChannel: any;

  private constructor(
    panel: vscode.WebviewPanel,
    extensionPath: string,
    compilerParams: ParametersManager,
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
        console.log("Message: " + JSON.stringify(message));

        this._compilerParams.setParams(message);

        if (message["resettodefault"]) {
          this._updateWebViewHtml();
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
    compilerParams: ParametersManager,
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
          retainContextWhenHidden: true,
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
    const jsnonce = this.getNonce();

    return `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${jsnonce}'; style-src ${
      webview.cspSource
    };"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <link href="${cssUri}" rel="stylesheet">
                  <title>AVRASM: settings</title>
              </head>
              <body>
              Compiler options
              <table>
              <col width="10%">
              <col width="1">            
              <tr>         
                <td>Main file:</td>
                <td><input id="mainAsmFile" value="${
                  this._compilerParams.getParam("mainAsmFile")
                }" type="text"></td>
              </tr>
              <tr>
                <td>MCU:</td>
                <td><select id="includeFile">
                ${this.getIncludesHtmlselector()}             
                </select></td>
              </tr>
              <tr>
                <td>AVRASM binary:</td>
                <td><input id="compilerFile" value="${
                  this._compilerParams.getParam("compilerFile")
                }" type="text"></td>
              </tr>
              <tr>
                <td>Output format:</td>
                <td><select id="outputFormat">
                ${this.getOutputFormatHtmlselector()}             
                </select></td>
              </tr>
              <tr>
                <td>Output file:</td>
                <td><input id="outputFile" value="${
                  this._compilerParams.getParam("outputFile")
                }" type="text"></td>
              </tr>
              <tr>
                <td>Save all before build:</td>
                <td>
                <input type="checkbox" id="saveOnBuild" ${
                  this._compilerParams.getParam("saveOnBuild") ? "checked" : ""
                }>
                </td>
              </tr>
              <tr>
                <td>Print full statistics:</td>
                <td>
                <input type="checkbox" id="fullStatistic" ${
                  this._compilerParams.getParam("fullStatistic") ? "checked" : ""
                }>
                </td>
              </tr>
              <tr>
                <td>Defines:</td>
                <td>
                <textarea id="defines" rows="4">${
                  this._compilerParams.getParam("defines")
                }</textarea>
                </td>
              </tr>
              </table>
              <hr>
              Programmer options
              <table>
              <col width="10%">
              <col width="1">  
              <tr>         
                <td>AVRDUDE binary file:</td>
                <td><input id="avrdudeFile" value="${
                  this._compilerParams.getParam("avrdudeFile")
                }" type="text"></td>
              </tr>
              <tr>
                <td>MCU:</td>
                <td><select id="avrdudeMcu">
                ${this.getAvrDudeMCUHtmlselector()}             
                </select></td>
              </tr>
              <tr>         
                <td>Bitrate:</td>
                <td><input id="bitrate" value="${
                  this._compilerParams.getParam("bitrate")
                }" type="text"></td>
              </tr>
              <tr>
                <td>Programmer:</td>
                <td><select id="programmer">
                ${this.getProgrammerHtmlselector()}             
                </select></td>
              </tr>
              <tr>
                <td>Full erase chip before flash:</td>
                <td>
                <input type="checkbox" id="chipErase" ${
                  this._compilerParams.getParam("chipErase") ? "checked" : ""
                }>
                </td>
              </tr>
              <tr>
                <td>Disable signature check:</td>
                <td>
                <input type="checkbox" id="disableSignatureCheck" ${
                  this._compilerParams.getParam("disableSignatureCheck") ? "checked" : ""
                }>
                </td>
              </tr>
              <tr>
                <td>Disable auto erase:</td>
                <td>
                <input type="checkbox" id="disableErase" ${
                  this._compilerParams.getParam("disableErase") ? "checked" : ""
                }>
                </td>
              </tr>
              <tr>
                <td>Disable verify after flashing:</td>
                <td>
                <input type="checkbox" id="disableVerify" ${
                  this._compilerParams.getParam("disableVerify") ? "checked" : ""
                }>
                </td>
              </tr>
              </table>
              <hr>
              <button id="reset-button" type="button">Reset to default</button>
              <script nonce="${jsnonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
  }

  getProgrammerHtmlselector(): string {
    var result = "";

    for (let item in AvrDudeProgrammer) {
      if (this._compilerParams.getParam("programmer") === item) {
        result += `<option value="${item}" selected>${item}</option>`;
      } else {
        result += `<option value="${item}">${item}</option>`;
      }
    }

    return result;
  }

  getAvrDudeMCUHtmlselector(): string {
    var result = "";

    for (let item in AvrDudeMcu) {
      if (this._compilerParams.getParam("avrdudeMcu") === item) {
        result += `<option value="${item}" selected>${item}</option>`;
      } else {
        result += `<option value="${item}">${item}</option>`;
      }
    }

    return result;
  }

  //Generate HTML select element values
  getIncludesHtmlselector(): string {
    var result = "";

    for (let includeFile of this._includeFiles) {
      if (this._compilerParams.getParam("includeFile") === includeFile.filename) {
        result += `<option value="${includeFile.filename}" selected>${includeFile.mcu}</option>`;
      } else {
        result += `<option value="${includeFile.filename}">${includeFile.mcu}</option>`;
      }
    }
    return result;
  }

  //Generate HTML select element values
  getOutputFormatHtmlselector(): string {
    var result = "";

    for (var i = 0; i < 5; i++) {
      if (+this._compilerParams.getParam("outputFormat") === i) {
        result += `<option value="${i}" selected>${GetOutputFormatDescription(
          i
        )}</option>`;
      } else {
        result += `<option value="${i}">${GetOutputFormatDescription(
          i
        )}</option>`;
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
