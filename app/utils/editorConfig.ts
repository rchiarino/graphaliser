export const defaultValue = `// Basic cobegin-end example
BEGIN
    A
    COBEGIN
            B
            C
    COEND
    D
END`;
