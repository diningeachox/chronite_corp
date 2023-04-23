const volume = {
    "button_click": {"src": "./audio/button_click.ogg", "type": "sfx", "loop": false, "vol": 1.0},
    "main": {"src": "./audio/main.opus", "type": "music", "loop": true, "vol": 0.2}
};

const stats = {
    "costs":
    {
        "speed": {"resource": "Hyperchronite", "quantity": 6},
        "slow": {"resource": "Infrachronite", "quantity": 6},
        "nebula": {"resource": "Deuterium", "quantity": 6},
        "pyrite": {"resource": "Pyrite", "quantity": 6}
    },
    "effects":
    {
        "speed": 1.8,
        "slow": 1.8
    },
    "end": 1000,
    "max_ships": 10
};

export {volume, stats};
