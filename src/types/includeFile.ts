//record about .inc file
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
