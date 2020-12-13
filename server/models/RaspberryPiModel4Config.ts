import {Gpio} from 'onoff';
import {PinDto, PinDtoState, PinMap, PinStateEnum} from './dtos/PinDto';

/* TODO after any operation completes with the pins update the RaspberryPiModel4Config.pinConfig
   TODO so that the in memory object reflects the state of the actual hardware */
export class RaspberryPiModel4Config {
    private static instance: RaspberryPiModel4Config;
    private _startPinNumber: number = 2;
    private _endPinNumber: number = 26;
    private _pinConfig: PinMap = null;

    private constructor() {
        this.pinConfig = {};
        for (let i = this.startPinNumber; i <= this.endPinNumber; ++i) {
            this.pinConfig[i] = {
                pinNumber: i,
                pinDirection: 'out',
                pinStatus: 0
            };
        }
    }

    public static getInstance(): RaspberryPiModel4Config {
        if (!RaspberryPiModel4Config.instance) {
            RaspberryPiModel4Config.instance = new RaspberryPiModel4Config();
        }
        return RaspberryPiModel4Config.instance;
    }

    get startPinNumber(): number {
        return this._startPinNumber;
    }

    set startPinNumber(value: number) {
        this._startPinNumber = value;
    }

    get endPinNumber(): number {
        return this._endPinNumber;
    }

    set endPinNumber(value: number) {
        this._endPinNumber = value;
    }

    get pinConfig(): PinMap {
        return this._pinConfig;
    }

    set pinConfig(value: PinMap) {
        this._pinConfig = value;
    }

    getAllGpioPins(): Array<Gpio> {
        return Object.keys(this.pinConfig).map(x => {
            const pin: PinDto = this.pinConfig[x];
            return new Gpio(pin.pinNumber, pin.pinDirection);
        });
    }

    isValidPinNumber(pin: number): boolean {
        return (pin < 2 && pin > 26);
    }

    async getPinStatus(pinId: number): Promise<number> {
        if (this.isValidPinNumber(pinId)) {
            const pin = new Gpio(pinId, 'out');
            const pinValue = await pin.read();
            return pinValue.valueOf();
        } else {
            console.error(`Invalid GPIO pin value: ${pinId} must be between ${this.startPinNumber} and ${this.endPinNumber}`);
            return null;
        }
    }

    async updatePin(pinNumber: number, pinState: PinDtoState): Promise<Gpio> {
        const pin = new Gpio(pinNumber, 'out');
        await pin.write(pinState);
        return pin;
    }

    async resetPins(): Promise<void> {
        const pins = this.getAllGpioPins();
        const promises = pins.map(x => x.write(PinStateEnum.DISABLED)
            .then(res => ({success: true, message: null}))
            .catch(err => ({success: false, message: err}))
        );

        // TODO handle any errors in the promise array here
        // @ts-ignore
        await Promise.allSettled(promises);
    }
}
