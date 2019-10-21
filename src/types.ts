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

export class CompilerParams {
  compilerFile =
    "C:\\Program Files (x86)\\Atmel\\Studio\\7.0\\toolchain\\avr8\\avrassembler\\avrasm2.exe";
  mainAsmFile = "main.asm";
  includeFile = "m8adef.inc";
}
