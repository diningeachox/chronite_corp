const volume = {
    "button_click": {"src": "./audio/button_click.ogg", "type": "sfx", "loop": false, "vol": 1.0},
    "speed": {"src": "./audio/speed_field.opus", "type": "sfx", "loop": false, "vol": 1.0},
    "slow": {"src": "./audio/slow_field.opus", "type": "sfx", "loop": false, "vol": 1.0},
    "nebula": {"src": "./audio/nebula_field.opus", "type": "sfx", "loop": false, "vol": 1.0},
    "pyrite": {"src": "./audio/pyrite_field.opus", "type": "sfx", "loop": false, "vol": 1.0},
    "click": {"src": "./audio/click.opus", "type": "sfx", "loop": false, "vol": 1.0},
    "main": {"src": "./audio/main.opus", "type": "music", "loop": true, "vol": 0.4},
    "menu": {"src": "./audio/menu.wav", "type": "music", "loop": true, "vol": 1.0},
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
    "field_radius": 10,
    "end": 1000,
    "max_ships": 6
};

export {volume, stats};
