class EventManager {
    constructor(){
        this.listeners = {};
    }

    subscribe(event_type, listener){
        if (event_type in this.listeners){
            this.listeners[event_type].push(listener);
        } else {
            this.listeners[event_type] = [listener];
        }

    }

    unsubsribe(event_type, listener){
        delete this.listeners[event_type];
    }

    notify(event_type, data){
        if (event_type in this.listeners){
            for (const listener of this.listeners[event_type]){
                listener.process(event_type, data);
            }
        }
    }
}

export {EventManager}
