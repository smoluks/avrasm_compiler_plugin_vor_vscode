(function() {
  const vscode = acquireVsCodeApi();
  //const oldState = vscode.getState();

  const mcuSelect = document.getElementById("mcu-select");
  mcuSelect.addEventListener("change", setState);

  const mainfileInput = document.getElementById("mainfile-input");
  mainfileInput.addEventListener("change", setState);

  const compilerFolderInput = document.getElementById("compiler-folder-input");
  compilerFolderInput.addEventListener("change", setState);

  const outputformatSelect = document.getElementById("output-format-select");
  outputformatSelect.addEventListener("change", setState);

  const outputFileInput = document.getElementById("output-file-input");
  outputFileInput.addEventListener("change", setState);

  const saveOnBuildCheckbox = document.getElementById("save-on-build-checkbox");
  saveOnBuildCheckbox.addEventListener("change", setState);

  const fullStatisticsCheckbox = document.getElementById(
    "full-statistic-checkbox"
  );
  fullStatisticsCheckbox.addEventListener("change", setState);

  const definesTextarea = document.getElementById("defines-textarea");
  definesTextarea.addEventListener("change", setState);

  const resetButton = document.getElementById("reset-button");
  resetButton.addEventListener("click", resetToDefault);

  function setState() {
    var state = {
      incfile: mcuSelect.options[mcuSelect.selectedIndex].value,
      mainfile: mainfileInput.value,
      compilerfile: compilerFolderInput.value,
      outputtype:
        outputformatSelect.options[outputformatSelect.selectedIndex].value,
      outputfile: outputFileInput.value,
      saveonbuild: saveOnBuildCheckbox.checked,
      defines: definesTextarea.value,
      fullstatistic: fullStatisticsCheckbox.checked
    };

    vscode.setState(state);
    vscode.postMessage(state);
  }

  function resetToDefault() {
    vscode.postMessage({
      resettodefault: true
    });

    vscode.setState({});
  }
})();
