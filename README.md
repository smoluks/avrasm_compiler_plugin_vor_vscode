# AVRASM Complier plugin

Allows to compile projects written in AVR assembler

## Features

Add commands: AVRASM: configure and AVRASM: build

![Settings](/images/Feature_settings.png)
![Compile](/images/Feature_compile.png)

Output format: Intel Hex

## Requirements

Atmel Studio 7 (https://www.microchip.com/mplab/avr-support/atmel-studio-7) or separate AVRASM2

## Notes

When 'Settings' page opening, it scans all \*.inc files from <inc> folder in plugin directory (_%USERPROFILE%\\.vscode\extensions\smoluks.avrasmcompiler-0.0.3\inc_). You can delete unused to speed up the opening settings page, or add another if needed. You can take inc files from Atmel Studio (_C:\Program Files (x86)\Atmel\Studio\7.0\packs\atmel\\[family]\\[version]\avrasm\inc_).
