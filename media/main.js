(function() {
  const vscode = acquireVsCodeApi();
  const oldState = vscode.getState();

  const mcuSelect = document.getElementById("mcu-select");
  mcuSelect.addEventListener("change", mcuSelectionHandler);

  const mainfileInput = document.getElementById("mainfile-input");
  mainfileInput.addEventListener("input", mainfileInputHandler);

  const compilerFolderInput = document.getElementById("compiler-folder-input");
  compilerFolderInput.addEventListener("input", compilerFolderInputHandler);

  function setState() {
    vscode.setState({
      incfile: mcuSelect.options[mcuSelect.selectedIndex].value,
      mainfile: mainfileInput.value,
      compilerFolder: compilerFolderInput.value
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
  }

  function compilerFolderInputHandler() {
    vscode.postMessage({
      compilerFolder: compilerFolderInput.value
    });
  }
})();
