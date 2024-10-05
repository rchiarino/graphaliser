export const defaultValue = `BEGIN
    A
    COBEGIN
            BEGIN
                B
                X
                Y
                Z
            END
            C
    COEND
    D
END`;
