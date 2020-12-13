import {GPIOServiceIntegration} from '../services/GRIOServiceIntegration';
import {PinStateEnum} from '../models/dtos/PinDto';

export const actionRouter: Router = Router();

const PIN_URI = '/pin';
const PIN_ACTION_RESET_URI = `${PIN_URI}/reset`;
const PIN_ACTION_URI = `${PIN_URI}/action`;
const PIN_ACTION_ENABLE_URI = `${PIN_ACTION_URI}/enable`;
const PIN_ACTION_DISABLE_URI = `${PIN_ACTION_URI}/disable`;

// Initialize GPIO pins
actionRouter.get(PIN_ACTION_RESET_URI, async function (req: Request, res: Response, next: NextFunction) {
    try {
        const service: GPIOServiceIntegration = new GPIOServiceIntegration();
        const pinStatus = await service.resetPins();
        res.send(pinStatus);
    } catch (err) {
        return next(err);
    }
});

// Get all pin statuses
actionRouter.get(PIN_URI, async function (req: Request, res: Response, next: NextFunction) {
    try {
        const service: GPIOServiceIntegration = new GPIOServiceIntegration();
        const pinStatus = service.getAllPinStatus();
        res.send(pinStatus);
    } catch (err) {
        return next(err);
    }
});

// Get single pin status
actionRouter.get(`${PIN_URI}/:pinId`, async function (req: Request, res: Response, next: NextFunction) {
    try {
        const pinId = parseInt(req.params.pinId);
        if (pinId !== null && !isNaN(pinId)) {
            const service: GPIOServiceIntegration = new GPIOServiceIntegration();
            const pinStatus = await service.getPinStatus(pinId);
            res.send(pinStatus);
        } else {
            res.status(400).send('pinId was not provided in the request.');
        }
    } catch (err) {
        return next(err);
    }
});

// Update the status of a pin
actionRouter.post(`${PIN_ACTION_ENABLE_URI}/:pinId`, async function (req: Request, res: Response, next: NextFunction) {
    try {
        const pinId = parseInt(req.params.pinId);
        if (pinId !== null && !isNaN(pinId)) {
            const service: GPIOServiceIntegration = new GPIOServiceIntegration();
            const pin = await service.updatePinStatus(pinId, PinStateEnum.ENABLED);
            res.send(pin);
        } else {
            res.status(400).send('pinId was not provided in the request.');
        }
    } catch (err) {
        return next(err);
    }
});

actionRouter.post(`${PIN_ACTION_DISABLE_URI}/:pinId`, async function (req: Request, res: Response, next: NextFunction) {
    try {
        const pinId = parseInt(req.params.pinId);
        if (pinId !== null && !isNaN(pinId)) {
            const service: GPIOServiceIntegration = new GPIOServiceIntegration();
            const pinStatus = service.updatePinStatus(pinId, PinStateEnum.DISABLED);
            res.send(pinStatus);
        } else {
            res.status(400).send('pinId was not provided in the request.');
        }
    } catch (err) {
        return next(err);
    }
});
