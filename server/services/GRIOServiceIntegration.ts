import {Gpio} from 'onoff';
import {PinDtoState, PinMap} from '../models/dtos/PinDto';
import {RaspberryPiModel4Config} from '../models/RaspberryPiModel4Config';

export class GPIOServiceIntegration {
    constructor() {}

    async getPinStatus(pinId: number): Promise<string> {
        try {
            const controllerConfig = RaspberryPiModel4Config.getInstance();
            const pinValue = await controllerConfig.getPinStatus(pinId);
            return pinValue.toString();
        } catch (e) {
            console.error('Error in [getPinStatus]', e);
            return JSON.stringify(e);
        }
    }

    getAllPinStatus(): PinMap {
        const controllerConfig = RaspberryPiModel4Config.getInstance();
        return controllerConfig.pinConfig;
    }

    async updatePinStatus(pinId: number, status: PinDtoState): Promise<Gpio> {
        try {
            const controllerConfig = RaspberryPiModel4Config.getInstance();
            return await controllerConfig.updatePin(pinId, status);
        } catch (e) {
            console.error('Error in [getPinStatus]', e);
            return null;
        }
    }

    async resetPins(): Promise<void> {
        try {
            const controllerConfig = RaspberryPiModel4Config.getInstance();
            await controllerConfig.resetPins();
        } catch (e) {
            console.error('Error in [resetPins]', e);
        }
    }
}
