# AVRASM Complier plugin

Allows to compile projects written in AVR assembler

## Features

Add commands: AVRASM: configure and AVRASM: build

![Settings](/images/Feature_settings.png)
![Compile](/images/Feature_compile.png)

## Requirements

Atmel Studio 7 (https://www.microchip.com/mplab/avr-support/atmel-studio-7) or separate AVRASM2

## Notes

When the 'Settings' page is being loaded, the plugin scans for every .inc file in the plugin directory (%USERPROFILE%\\.vscode\extensions\smoluks.avrasmcompiler-0.0.11\inc). You can delete unused .inc files to speed up the loading process, or add additional files if needed. You can take .inc from Atmel Studio (C:\Program Files (x86)\Atmel\Studio\7.0\packs\atmel\\[family]\\[version]\avrasm\inc).
