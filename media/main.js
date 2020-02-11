(function() {
  const vscode = acquireVsCodeApi();
  const params = [
    "compilerFile",
    "mainAsmFile",
    "includeFile",
    "outputFormat",
    "outputFile",
    "saveOnBuild",
    "defines",
    "fullStatistic",
    //
    "avrdudeFile",
    "avrdudeMcu",
    "bitrate",
    "uartBaudrate",
    "programmer",
    "chipErase",
    "lptExitState",
    "disableSignatureCheck",
    "disableErase",
    "disableVerify",
    "delay",
    "RCcalibration",
    "port",
    "extendedParams"
  ];

  var readMethods = {};

  params.forEach(param => {
    const element = document.getElementById(param);
    if (element == null) {
      console.log(param + " not found");
      return;
    }
    element.addEventListener("change", setState);

    switch (element.type) {
      case "text":
        readMethods[param] = () => element.value;
        break;
      case "select-one":
        readMethods[param] = () => element.options[element.selectedIndex].value;
        break;
      case "checkbox":
        readMethods[param] = () => element.checked;
        break;
      case "textarea":
        readMethods[param] = () => element.value;
        break;
      default:
        console.log("type " + element.type + " not recognized");
    }
  });

  function setState() {
    var state = vscode.getState() || {};

    params.forEach(param => {
      if (readMethods[param]) state[param] = readMethods[param]();
    });

    vscode.postMessage(state);
    vscode.setState(state);    
  }

  const resetButton = document.getElementById("reset-button");
  resetButton.addEventListener("click", () => {
    vscode.postMessage({
      resettodefault: true
    });

    vscode.setState({});
  });
})();