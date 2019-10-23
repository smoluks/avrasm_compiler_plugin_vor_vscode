(function() {
  const vscode = acquireVsCodeApi();
  //const oldState = vscode.getState();

  const mcuSelect = document.getElementById("mcu-select");
  mcuSelect.addEventListener("change", mcuSelectionHandler);

  const mainfileInput = document.getElementById("mainfile-input");
  mainfileInput.addEventListener("change", mainfileInputHandler);

  const compilerFolderInput = document.getElementById("compiler-folder-input");
  compilerFolderInput.addEventListener("change", compilerFolderInputHandler);

  const outputformatSelect = document.getElementById("output-format-select");
  outputformatSelect.addEventListener("change", outputTypeSelectionHandler);

  const outputFileInput = document.getElementById("output-file-input");
  outputFileInput.addEventListener("change", outputFileInputHandler);

  const resetButton = document.getElementById("reset-button");
  resetButton.addEventListener("click", resetToDefault);

  function setState() {
    vscode.setState({
      incfile: mcuSelect.options[mcuSelect.selectedIndex].value,
      mainfile: mainfileInput.value,
      compilerfile: compilerFolderInput.value,
      outputtype:
        outputformatSelect.options[outputformatSelect.selectedIndex].value,
      outputfile: outputFileInput.value
    });
  }

  function mcuSelectionHandler() {
    vscode.postMessage({
      incfile: mcuSelect.options[mcuSelect.selectedIndex].value
    });

    setState();
  }

  function mainfileInputHandler() {
    vscode.postMessage({
      mainfile: mainfileInput.value
    });

    setState();
  }

  function compilerFolderInputHandler() {
    vscode.postMessage({
      compilerfile: compilerFolderInput.value
    });

    setState();
  }

  function outputTypeSelectionHandler() {
    vscode.postMessage({
      outputtype:
        outputformatSelect.options[outputformatSelect.selectedIndex].value
    });

    setState();
  }

  function outputFileInputHandler() {
    vscode.postMessage({
      outputfile: outputFileInput.value
    });

    setState();
  }

  function resetToDefault() {
    vscode.postMessage({
      resettodefault: true
    });

    vscode.setState({});
  }
})();
