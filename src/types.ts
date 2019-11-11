export class IncludeFile {
  //inc file path
  filename = "";
  //inc file target
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
  //save oll before build
  saveOnBuild = true;

  //compiler binary path
  compilerFile =
    "C:\\Program Files (x86)\\Atmel\\Studio\\7.0\\toolchain\\avr8\\avrassembler\\avrasm2.exe";

  //main file
  mainAsmFile = "main.asm";

  //include file
  includeFile = "m8adef.inc";

  //Supported formats are generic/Intel/Motorola hex, and AVR Object files.
  outputFormat = OutputFormatEnum.IntelHex;

  //Output binary file path
  outputFile: string = "";

  //Define and undefine a preprocessor macro, respectively. Note that function-type preprocessor macros may not be defined from the command line. If -D is given no value, it is set to 1.
  defines: string = "DEBUG=1";

  //Print use statistics for register, instruction and memory on standard output. By default, only the memory statistic is printed. Note: The full statistics will always be printed to the list file, if one is specified.
  fullStatistic = false;

  setParams(params: any) {
    if (params["resettodefault"]) {
      this.resetToDefault();
    }
    if (params && params["incfile"]) {
      this.includeFile = params["incfile"];
    }
    if (params && params["mainfile"]) {
      this.mainAsmFile = params["mainfile"];
    }
    if (params && params["compilerfile"]) {
      this.compilerFile = params["compilerfile"];
    }
    if (params && params["outputtype"]) {
      this.outputFormat = params["outputtype"];
    }
    if (params && params["outputfile"]) {
      this.outputFile = params["outputfile"];
    }
    if (params && params["saveonbuild"] !== undefined) {
      this.saveOnBuild = params["saveonbuild"];
    }
    if (params && params["defines"]) {
      this.defines = params["defines"];
    }
    if (params && params["fullstatistic"] !== undefined) {
      this.fullStatistic = params["fullstatistic"];
    }
  }

  resetToDefault() {
    this.compilerFile =
      "C:\\Program Files (x86)\\Atmel\\Studio\\7.0\\toolchain\\avr8\\avrassembler\\avrasm2.exe";
    this.mainAsmFile = "main.asm";
    this.includeFile = "m8adef.inc";
    this.outputFormat = OutputFormatEnum.IntelHex;
    this.outputFile = "";
    this.saveOnBuild = true;
    this.defines = "DEBUG=1";
    this.fullStatistic = false;
  }
}
