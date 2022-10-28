var areas = {
    "mphunting": {
        weights: [0.5,    0.2,       0.3],
        targets: ["hare", "cheetah", "deer"]
    }
}

var zones = {
    "mpcave": {
        len: 3,

        encounters: [{
            number: 1.2,
            weights: [0.5, 0.5],
            targets: ["goblinworker", "goblinscout"]
        }, {
            number: 1.5,
            weights: [1],
            targets: ["goblinwarrior"]
        }, {
            number: 2,
            weights: [1],
            targets: ["goblinleader"]
        },
        ],

        drop: []
    },

    "mphorde": [],
    "mpannazone": [],
}

var full_enemies = {
    "hare": {
        dispn: "野兔",
        drop: {
            exp: new Decimal(100),
            loots: [{
                droprate: 0.6,
                is_equip: false,
                res: "food",
                base: new Decimal(10)
            }, {
                droprate: 0.6,
                is_equip: false,
                res: "fiber",
                base: new Decimal(10)
            }]
        },
        stat: {
            rel_number: new Decimal(1),
            hp: new Decimal(20),
            mp: new Decimal(0),
            speed: new Decimal(1),
            crit: new Decimal(0),
            critdmg: new Decimal(0),
            atk: new Decimal(10),
            def: new Decimal(0),
            init_buffs: []
        },
        traits: []
    },
    
    "deer": {
        dispn: "野鹿",
        drop: {
            exp: new Decimal(200),
            loots: [{
                droprate: 1,
                is_equip: false,
                res: "food",
                base: new Decimal(30)
            }, {
                droprate: 0.8,
                is_equip: false,
                res: "fiber",
                base: new Decimal(15)
            }]
        },
        stat: {
            rel_number: new Decimal(1),
            hp: new Decimal(40),
            mp: new Decimal(0),
            speed: new Decimal(0.8),
            crit: new Decimal(0.2),
            critdmg: new Decimal(1.5),
            atk: new Decimal(10),
            def: new Decimal(5),
            init_buffs: []
        },
        traits: []
    },
    
    "cheetah": {
        dispn: "猎豹",
        drop: {
            exp: new Decimal(500),
            loots: [{
                droprate: 1,
                is_equip: false,
                res: "food",
                base: new Decimal(30)
            }, {
                droprate: 0.6,
                is_equip: false,
                res: "fiber",
                base: new Decimal(20)
            }]
        },
        stat: {
            rel_number: new Decimal(1),
            hp: new Decimal(50),
            mp: new Decimal(0),
            speed: new Decimal(1.4),
            crit: new Decimal(0.2),
            critdmg: new Decimal(1.5),
            atk: new Decimal(10),
            def: new Decimal(0),
            init_buffs: [
                {name: "comboatk", moves: 5, times: 3, discnt: 0.6}
            ]
        },
        traits: []
    },


}