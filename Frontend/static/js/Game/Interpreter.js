import { toast } from "../userdata.js";
import { RoomManager } from "./RoomManager.js";

export class Interpreter {
    static interpretRequest(type, action, data) {

        switch (type) {
            case 'rooms':
                RoomManager.processRoomRequest(action, data);
                break;
            case 'game':
                break
        }
    }

    static interpretResponse(response) {

        const type = response.request;
        const action = response.action;
        const status = response.status;
        const message = response.message;
        const data = response.data;

        if (!this.invokeStatus(status, message))
            return;

        this.invokeResponseAction(type, action, data);
    }

    static invokeStatus(status, message) {
        switch (status) {
            case 'success':
                // toast(message, 'bg-success');
                return true;
            case 'fail':
                toast(message, 'bg-danger');
                return false;
        }
        return false;
    }

    static invokeResponseAction(type, action, data) {
        switch (type) {
            case 'rooms':
                RoomManager.roomAction(action, data);
                break;
            case 'game':
                // this.gameAction(action, data);
                break;
        }
    }
}