export enum LptExitState {
    default = "AVRDUDE leaves the parallel port in the same state at exit as it has been found at startup",
    reset = "The ‘/RESET’ signal will be left activated at program exit",
    noreset = "The ‘/RESET’ line will be deactivated at program exit",
    vcc = "This option will leave those parallel port pins active (i. e. high) that can be used to supply ‘Vcc’ power to the MCU",
    novcc = "This option will pull the ‘Vcc’ pins of the parallel port down at program exit",
    d_high = "This option will leave the 8 data pins on the parallel port active (i. e. high)",
    d_low = "This option will leave the 8 data pins on the parallel port inactive (i. e. low)"
  }