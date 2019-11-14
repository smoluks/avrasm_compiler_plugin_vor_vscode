import { AvrDudeMcu } from "./avrdudemcu";
import { AvrDudeProgrammer } from "./avrdudeprogrammer";

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

export enum LptExitState {
  default = "AVRDUDE leaves the parallel port in the same state at exit as it has been found at startup",
  reset = "The ‘/RESET’ signal will be left activated at program exit",
  noreset = "The ‘/RESET’ line will be deactivated at program exit",
  vcc = "This option will leave those parallel port pins active (i. e. high) that can be used to supply ‘Vcc’ power to the MCU",
  novcc = "This option will pull the ‘Vcc’ pins of the parallel port down at program exit",
  d_high = "This option will leave the 8 data pins on the parallel port active (i. e. high)",
  d_low = "This option will leave the 8 data pins on the parallel port inactive (i. e. low)"
}

export class Parameters {
  //----------compile-----------
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

  //----------flash-----------
  avrdudeFile =
    "C:\\Program Files (x86)\\Arduino\\hardware\\tools\\avr\\bin\\avrdude.exe";

  avrdudeMcu = AvrDudeMcu.ATmega8;

  //Specify the bit clock period for the JTAG interface or the ISP clock (JTAG ICE only).
  bitrate = "";

  //Override the RS-232 connection baud rate specified in the respective programmer’s entry of the configuration file.
  uartBaudrate = "";

  //
  programmer = AvrDudeProgrammer.usbasp;

  //Causes a chip erase to be executed. This will reset the contents of the flash ROM and EEPROM to the value ‘0xff’, and clear all lock bits
  chipErase = false;

  //This option modifies the state of the ‘/RESET’ and ‘Vcc’ lines the parallel port is left at, according to the exitspec arguments provided, as follows
  lptExitState = LptExitState.default;

  //Since it can happen from time to time that a device has a broken (erased or overwritten) device signature but is otherwise operating normally, this options is provided to override the check
  disableSignatureCheck = false;

  //Disable auto erase for flash
  disableErase = false;

  //
  disableVerify = false;

  //For bitbang-type programmers, delay for approximately delay microseconds between each bit state change.
  delay = 0;

  //Perform a RC oscillator run-time calibration according to Atmel application note AVR053. This is only supported on the STK500v2, AVRISP mkII, and JTAG ICE mkII hardware.
  //Note that the result will be stored in the EEPROM cell at address 0
  RCcalibration = false;

  //Use port to identify the device to which the programmer is attached
  port = "";

  //Pass extended param to the chosen programmer implementation as an extended parameter
  extendedParams = "";

  setParams(params: any) {
    //----------compile-----------
    if (params["resettodefault"]) {
      this.resetToDefault();
    }
    if (params && params["incfile"]) {
      this.avrdudeMcu = params["incfile"];
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

    //----------flash-----------
    if (params && params["avrdudefile"]) {
      this.avrdudeFile = params["avrdudefile"];
    }

    if (params && params["avrdudemcu"]) {
      this.avrdudeMcu = params["avrdudemcu"];
    }

    if (params && params["bitrate"]) {
      this.bitrate = params["bitrate"];
    }

    if (params && params["uartbaudrate"]) {
      this.uartBaudrate = params["uartbaudrate"];
    }

    if (params && params["programmer"]) {
      this.programmer = params["programmer"];
    }

    if (params && params["chiperase"]) {
      this.chipErase = params["chiperase"];
    }

    if (params && params["lptexitstate"]) {
      this.lptExitState = params["lptexitstate"];
    }

    if (params && params["disablesignaturecheck"]) {
      this.disableSignatureCheck = params["disablesignaturecheck"];
    }

    if (params && params["disableerase"]) {
      this.disableErase = params["disableerase"];
    }

    if (params && params["disableverify"]) {
      this.disableVerify = params["disableverify"];
    }

    if (params && params["delay"]) {
      this.delay = params["delay"];
    }

    if (params && params["rccalibration"]) {
      this.RCcalibration = params["rccalibration"];
    }

    if (params && params["port"]) {
      this.port = params["port"];
    }

    if (params && params["extendedparams"]) {
      this.extendedParams = params["extendedparams"];
    }
  }

  resetToDefault() {
    //
    this.compilerFile =
      "C:\\Program Files (x86)\\Atmel\\Studio\\7.0\\toolchain\\avr8\\avrassembler\\avrasm2.exe";
    this.mainAsmFile = "main.asm";
    this.includeFile = "m8adef.inc";
    this.outputFormat = OutputFormatEnum.IntelHex;
    this.outputFile = "";
    this.saveOnBuild = true;
    this.defines = "DEBUG=1";
    this.fullStatistic = false;
    //
    this.avrdudeFile =
      "C:\\Program Files (x86)\\Arduino\\hardware\\tools\\avr\\bin\\avrdude.exe";
    this.avrdudeMcu = AvrDudeMcu.ATmega8;
    this.bitrate = "";
    this.uartBaudrate = "";
    this.programmer = AvrDudeProgrammer.usbasp;
    this.chipErase = false;
    this.lptExitState = LptExitState.default;
    this.disableSignatureCheck = false;
    this.disableErase = false;
    this.disableVerify = false;
    this.delay = 0;
    this.RCcalibration = false;
    this.port = "";
    this.extendedParams = "";
  }
}
