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
  