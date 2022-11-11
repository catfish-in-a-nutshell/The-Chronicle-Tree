// Contains all enemy data, combined with 

var areas = {
    "mphunting": {
        weights: [0.6,    0.15,       0.25],
        targets: ["hare", "cheetah", "deer"]
    },
    "mphunting2": {
        weights: [0.05,    0.1,      0.3,        0.15,     0.2,        0.2],
        targets: ["hare", "cheetah", "elephant", "monkey", "crocodile", "lizard"]
    },
    
}
// var areas = {
//     "mphunting": {
//         weights: [0,    1,       0],
//         targets: ["hare", "cheetah", "deer"]
//     }
// }

var zones = {
    "mpcave": {
        dispn: "洞穴",
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
            number: 1.8,
            weights: [1],
            targets: ["goblinleader"]
        },
        ],

        onComplete: () => {
            player.m.sigil0_unlocked = true,
            player.mk.mpcave_reward_unlocked = true
        },
    },

    "mphorde": {
        dispn: "“农场”",
        len: 4,

        encounters: [{
            number: 32,
            weights: [1],
            targets: ["peeledcheetah"]
        }, {
            number: 38,
            weights: [1],
            targets: ["peeledhound"]
        }, {
            number: 44,
            weights: [1],
            targets: ["thefarmer"]
        }, {
            number: 50,
            weights: [1],
            targets: ["omegaworms"]
        }],

        onComplete: () => {
            player.mk.mphorde_reward_unlocked = true
        }
    },
    "mpannazone": {
        dispn: "后院",
        len: 1,
        encounters: [{
            number: d(1400000),
            weights: [1],
            targets: ["annasindexfinger"]
        }],

        onComplete: () => {
            player.m.mp_layer_clear = true
        }
    },
}

var full_enemies = {
    "template": {
        dispn: "",
        drop: {
            exp: d(0),
            loots: [{
                droprate: 0,
                is_equip: false,
                res: "food",
                base: d(0)
            }]
        },
        stat: {
            rel_number: d(1),
            hp: d(1),
            mp: d(0),
            speed: d(1),
            crit: d(0.2),
            critdmg: d(1.5),
            atk: d(10),
            def: d(0),
            init_buffs: []
        },
        traits: []
    },
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
                base: d(25)
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
            speed: d(1.2),
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

    "goblinworker": {
        dispn: "哥布林矿工",
        drop: {
            exp: d(200),
            loots: [{
                droprate: 1,
                is_equip: false,
                res: "mineral",
                base: d(15)
            }]
        },
        stat: {
            rel_number: d(1),
            hp: d(75),
            mp: d(0),
            speed: d(0.8),
            crit: d(0.2),
            critdmg: d(1.5),
            atk: d(8),
            def: d(0),
            init_buffs: []
        },
        traits: []

    },

    "goblinscout": {
        dispn: "哥布林哨兵",
        drop: {
            exp: d(300),
            loots: [{
                droprate: 1,
                is_equip: false,
                res: "fiber",
                base: d(30)
            }, {
                droprate: 1,
                is_equip: false,
                res: "wood",
                base: d(75)
            }]
        },
        stat: {
            rel_number: d(1),
            hp: d(30),
            mp: d(0),
            speed: d(1.5),
            crit: d(0),
            critdmg: d(1.5),
            atk: d(15),
            def: d(3),
            init_buffs: [
                { name: "raging", moves: 2}
            ]
        },
        traits: ["furious"]
    },

    "goblinwarrior": {
        dispn: "哥布林战士",
        drop: {
            exp: d(400),
            loots: [{
                droprate: 1,
                is_equip: false,
                res: "food",
                base: d(20)
            }]
        },
        stat: {
            rel_number: d(1),
            hp: d(150),
            mp: d(0),
            speed: d(0.6),
            crit: d(0),
            critdmg: d(1.5),
            atk: d(10),
            def: d(10),
            init_buffs: []
        },
        traits: ["warcry"]

    },

    "goblinleader": {
        dispn: "哥布林首领",
        drop: {
            exp: d(500),
            loots: [{
                droprate: 1,
                is_equip: false,
                res: "gold",
                base: d(50)
            }]
        },
        stat: {
            rel_number: d(1),
            hp: d(60),
            mp: d(0),
            speed: d(1),
            crit: d(0.2),
            critdmg: d(1.5),
            atk: d(10),
            def: d(3),
            init_buffs: [{ name:"boss", moves:1, rate:1.2}]
        },

    },
    
    "peeledcheetah": {
        dispn: "无皮猎豹",
        drop: {
            exp: d(400),
            loots: [{
                droprate: 1,
                is_equip: false,
                res: "food",
                base: d(40)
            }]
        },
        stat: {
            rel_number: d(1),
            hp: d(250),
            mp: d(0),
            speed: d(1.8),
            crit: d(0.2),
            critdmg: d(1.5),
            atk: d(30),
            def: d(0),
            init_buffs: []
        },
        traits: ["peeled"]
    },
    
    "peeledhound": {
        dispn: "无皮猎犬",
        drop: {
            exp: d(400),
            loots: [{
                droprate: 0.8,
                is_equip: false,
                res: "food",
                base: d(40)
            }]
        },
        stat: {
            rel_number: d(1),
            hp: d(300),
            mp: d(0),
            speed: d(1.6),
            crit: d(0.2),
            critdmg: d(1.5),
            atk: d(40),
            def: d(0),
            init_buffs: []
        },
        traits: ["peeled", "induce_bleeding"]
    },
    
    "thefarmer": {
        dispn: "“农场主”",
        drop: {
            exp: d(400),
            loots: [{
                droprate: 1,
                is_equip: false,
                res: "fur",
                base: d(50)
            }]
        },
        stat: {
            rel_number: d(1),
            hp: d(90),
            mp: d(0),
            speed: d(1.8),
            crit: d(0.2),
            critdmg: d(1.5),
            atk: d(18),
            def: d(5),
            init_buffs: [{ name:"boss", moves:2, rate:1.1}]
        },
        traits: []
    },
    
    "omegaworms": {
        dispn: "蠕动虫群",
        drop: {
            exp: d(400),
            loots: []
        },
        stat: {
            rel_number: d(1),
            hp: d(3000),
            mp: d(0),
            speed: d(0.1),
            crit: d(0),
            critdmg: d(1),
            atk: d(1),
            def: d(0),
            init_buffs: []
        },
        traits: ["worms"]
    },
    

    "elephant": {
        dispn: "巨象",
        drop: {
            exp: d(100),
            loots: [{
                droprate: 1,
                is_equip: false,
                res: "bones",
                base: d(20)
            }]
        },
        stat: {
            rel_number: d(1),
            hp: d(500000),
            mp: d(0),
            speed: d(3),
            crit: d(0),
            critdmg: d(1.5),
            atk: d(50000),
            def: d(10000),
            init_buffs: [],
        },
        traits: []
    },

    "monkey": {
        dispn: "野猴",
        drop: {
            exp: d(100),
            loots: [{
                droprate: 1,
                is_equip: false,
                res: "bones",
                base: d(10)
            }]
        },
        stat: {
            rel_number: d(1),
            hp: d(500000),
            mp: d(0),
            speed: d(7),
            crit: d(0.2),
            critdmg: d(1.5),
            atk: d(20000),
            def: d(4000),
            init_buffs: [{ name:"comboatk", moves:2, times:2, discnt:0.9}],
        },
        traits: ["furious"]
    },
    
    "crocodile": {
        dispn: "鳄鱼",
        drop: {
            exp: d(300),
            loots: [{
                droprate: 1,
                is_equip: false,
                res: "scale",
                base: d(20)
            },{
                droprate: 0.8,
                is_equip: false,
                res: "bones",
                base: d(10)
            }
        ]
        },
        stat: {
            rel_number: d(1),
            hp: d(300000),
            mp: d(0),
            speed: d(10),
            crit: d(1),
            critdmg: d(1.5),
            atk: d(20000),
            def: d(5000),
            init_buffs: []
        },
        traits: ["induce_bleeding"]
    },

    "lizard": {
        dispn: "蜥蜴",
        drop: {
            exp: d(200),
            loots: [{
                droprate: 1,
                is_equip: false,
                res: "scale",
                base: d(5)
            }]
        },
        stat: {
            rel_number: d(1),
            hp: d(200000),
            mp: d(0),
            speed: d(12),
            crit: d(0),
            critdmg: d(1.5),
            atk: d(10000),
            def: d(10000),
            init_buffs: []
        },
        traits: ["losingtail"]
    },

    "annasindexfinger": {
        dispn: "安娜的右手食指",
        drop: {
            exp: d(0),
            loots: []
        },
        stat: {
            rel_number: d(1),
            hp: d(160000),
            mp: d(0),
            speed: d(5),
            crit: d(0.1),
            critdmg: d(1.5),
            atk: d(10000),
            def: d(0),
            init_buffs: [{ name:"boss", moves:1, rate:1.2 }]
        },
        traits: ["innocent"]
    }
}