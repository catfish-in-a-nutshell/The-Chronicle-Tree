// var areas = {
//     "mphunting": {
//         weights: [0.5,    0.2,       0.3],
//         targets: ["hare", "cheetah", "deer"]
//     }
// }
var areas = {
    "mphunting": {
        weights: [0,    1,       0],
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
            exp: d(100),
            loots: [{
                droprate: 0.6,
                is_equip: false,
                res: "food",
                base: d(10)
            }, {
                droprate: 1,
                is_equip: false,
                res: "fur",
                base: d(10)
            }]
        },
        stat: {
            rel_number: d(1),
            hp: d(20),
            mp: d(0),
            speed: d(1),
            crit: d(0),
            critdmg: d(0),
            atk: d(10),
            def: d(0),
            init_buffs: []
        },
        traits: []
    },
    
    "deer": {
        dispn: "野鹿",
        drop: {
            exp: d(200),
            loots: [{
                droprate: 1,
                is_equip: false,
                res: "food",
                base: d(30)
            }, {
                droprate: 1,
                is_equip: false,
                res: "fur",
                base: d(30)
            }]
        },
        stat: {
            rel_number: d(1),
            hp: d(40),
            mp: d(0),
            speed: d(0.8),
            crit: d(0.2),
            critdmg: d(1.5),
            atk: d(10),
            def: d(5),
            init_buffs: []
        },
        traits: []
    },
    
    "cheetah": {
        dispn: "猎豹",
        drop: {
            exp: d(500),
            loots: [{
                droprate: 1,
                is_equip: false,
                res: "food",
                base: d(30)
            }, {
                droprate: 0.6,
                is_equip: false,
                res: "fiber",
                base: d(20)
            }, {
                droprate: 0.8,
                is_equip: false,
                res: "fur",
                base: d(100)
            }]
        },
        stat: {
            rel_number: d(1),
            hp: d(50),
            mp: d(0),
            speed: d(1.8),
            crit: d(0.2),
            critdmg: d(1.5),
            atk: d(10),
            def: d(3),
            init_buffs: [
                {name: "comboatk", moves: 5, times: 3, discnt: 0.8}
            ]
        },
        traits: []
    },


}