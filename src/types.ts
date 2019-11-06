export class IncludeFile {
  filename = "";
  mcu = "";

  constructor(filename: string, mcus: string[]) {
    this.filename = filename;

    var first = true;
    for (let mcu of mcus) {
      mcu = mcu
        .replace("Target MCU", "")
        .replace(":", "")
        .trim();

      if (first) {
        this.mcu = mcu;
        first = false;
      } else {
        this.mcu += ", " + mcu;
      }
    }
  }
}

export enum OutputFormatEnum {
  AtmelStudio,
  MotorolaHex,
  IntelHex,
  GenericHex,
  NoOutput
}

export function GetOutputFormatDescription(outputFormat: OutputFormatEnum) {
  switch (outputFormat) {
    case OutputFormatEnum.AtmelStudio:
      return "Debug info for simulation in AVR Studio";
    case OutputFormatEnum.MotorolaHex:
      return "Motorola HEX";
    case OutputFormatEnum.IntelHex:
      return "Intel HEX";
    case OutputFormatEnum.GenericHex:
      return "Generic HEX format";
    case OutputFormatEnum.NoOutput:
      return "No output file";
  }
}

export class CompilerParams {
  compilerFile =
    "C:\\Program Files (x86)\\Atmel\\Studio\\7.0\\toolchain\\avr8\\avrassembler\\avrasm2.exe";
  mainAsmFile = "main.asm";
  includeFile = "m8adef.inc";
  outputFormat = OutputFormatEnum.IntelHex;
  outputFile: string = "";
  saveOnBuild = true;

  resetToDefault() {
    this.compilerFile =
      "C:\\Program Files (x86)\\Atmel\\Studio\\7.0\\toolchain\\avr8\\avrassembler\\avrasm2.exe";
    this.mainAsmFile = "main.asm";
    this.includeFile = "m8adef.inc";
    this.outputFormat = OutputFormatEnum.IntelHex;
    this.outputFile = "";
    this.saveOnBuild = true;
  }
}
