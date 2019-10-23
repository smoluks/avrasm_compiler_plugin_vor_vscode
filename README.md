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

When the 'Settings' page is being loaded, the plugin scans for every _.inc file in the plugin directory (%USERPROFILE%\.vscode\extensions\smoluks.avrasmcompiler-0.0.7\inc). You can delete unused _.inc files to speed up the loading process, or include additional _.inc if needed. You can use _.inc from Atmel Studio configuration (C:\Program Files (x86)\Atmel\Studio\7.0\packs\atmel\[family]\[version]\avrasm\inc).

# Changelog

## [0.0.7] - 2019-10-23

### Added

- Output file select
- Output file type select
