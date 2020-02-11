import * as vscode from "vscode";
import { AvrDudeMcu } from "./avrdudemcu";
import { AvrDudeProgrammer } from "./avrdudeprogrammer";
import { OutputFormatEnum } from "./outputFormat";
import { LptExitState } from "./lptExitState";

function getEnumKeyByEnumValue(enumValue: string) {
  let keys = Object.keys(AvrDudeProgrammer).filter(
    x => AvrDudeProgrammer[x as keyof typeof AvrDudeProgrammer] === enumValue
  );
  return keys.length > 0 ? keys[0] : null;
}

class DefaultValues {
  //save all before build
  saveOnBuild = false;

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

  //----------compile-----------
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
}

export class ParametersManager {

  _defaultValues = new DefaultValues();
  _workspaceState: vscode.Memento;

  constructor(workspaceState: vscode.Memento){
    this._workspaceState = workspaceState;
  }

  getParam(key: string) : any
  {
    let value = this._workspaceState.get(key);
    if(value === undefined)
    {
      value = (this._defaultValues as any)[key];
    }

    return value;
  }

  setParam(key: string, value: any) : void
  {
    this._workspaceState.update(key, value);
  }

  setParams(params: any) {    
    if (params["resettodefault"]) {
      this.resetToDefault();
    }

    var properties = Object.getOwnPropertyNames(params);
    for (let property of properties) {
      this.setParam(property, params[property]);
    }
  }

  resetToDefault() {
    var properties = Object.getOwnPropertyNames(this._defaultValues);
    for (let property of properties) {
      this.setParam(property, (this._defaultValues as any)[property]);
    }
  }
}
