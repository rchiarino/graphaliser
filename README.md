# Grapaliser

Grapaliser is an interactive web-based tool that helps students visualize and verify concurrent programming constructs using BEGIN-END and COBEGIN-COEND notation. It automatically transpiles your code into a visual graph representation in real-time, making it easier to understand and validate concurrent program structures.

## Features

- **Live Transpilation**: As you type your BEGIN-END/COBEGIN-COEND code, see the corresponding graph update in real-time
- **Visual Verification**: Easily verify if your concurrent programming constructs match your intended design
- **Educational Tool**: Perfect for students learning about concurrent programming and graph theory
- **Export Options**: Save your graphs as PNG files for use in assignments or documentation

## Usage

1. Enter your BEGIN-END/COBEGIN-COEND code in the left panel:

```
BEGIN
  A
  COBEGIN
    B
    C
  COEND
  D
END
```

2. The corresponding graph will automatically appear in the right panel
3. Verify if the graph matches your intended concurrent structure
4. Make adjustments to your code as needed and see the graph update in real-time
