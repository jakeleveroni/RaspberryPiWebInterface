export type PinDtoDirection = 'out' | 'in' | 'high' | 'low';
export type PinDtoState = 0 | 1;

export interface PinDto {
    pinNumber: number;
    pinDirection: PinDtoDirection;
    pinStatus: PinDtoState
}

export interface PinMap {
    [pinNumber: number]: PinDto
}

export enum PinStateEnum {
    DISABLED,
    ENABLED
}
