# AVRASM Compiler plugin

Allows to compile projects written in AVR assembler via AVRASM and flash over AVRDUDE

## Features

Add commands: AVRASM: configure and AVRASM: build

![Settings](/images/Feature_settings.png)
![Compile](/images/Feature_compile.png)

## Requirements

AVRASM (Can be taken from Atmel Studio 7 (https://www.microchip.com/mplab/avr-support/atmel-studio-7))
AVRDUDE (Arduino version not working now, Windows binary can be taken from AVRDUDE_PROG(https://www.yourdevice.net/proekty/avrdude-prog))

## Notes

When the 'Settings' page is being loaded, the plugin scans for every .inc file in the plugin directory (%USERPROFILE%\\.vscode\extensions\smoluks.avrasmcompiler-0.0.14\inc). You can delete unused .inc files to speed up the loading process, or add additional files if needed. You can take .inc from Atmel Studio (C:\Program Files (x86)\Atmel\Studio\7.0\packs\atmel\\[family]\\[version]\avrasm\inc).
