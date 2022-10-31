var full_equip_list = [
    "sword0", "bow0", "dagger0", "shield0", "armor0", "cloth", "grassring",
    "fishingrod0", "axe0", "pickaxe0", "goldenring"
]

var full_equips = {
    // fishingrod
    "fishingrod0": {
        dispn: "鱼竿",
        etype: "fishingrod",
        cost: {
            wood: d(20),
            fiber: d(30)
        },
        unlocked: () => true
    },

    // axe
    "axe0": {
        dispn: "斧头",
        etype: "axe",
        cost: {
            wood: d(10),
            mineral: d(5)
        },
        unlocked: () => true
    },

    // pickaxe
    "pickaxe0": {
        dispn: "铁镐",
        etype: "pickaxe", 
        cost: {
            wood: d(10),
            mineral: d(10)
        },
        unlocked: () => true
    },

    // weapon
    "sword0": {
        dispn: "铁剑", 
        etype: "weapon",
        cost: {
            mineral: d(5)
        },
        atk: d(10),
        desc: (number) => `ATK ${format(number.mul(10))}`,
        unlocked: () => true
    },
    
    "bow0": {
        dispn: "长弓",
        etype: "weapon",
        cost: {
            wood: d(30),
            fiber: d(20)
        },
        atk: d(18),
        desc: (number) => `ATK ${format(number.mul(18))}
            速度x0.9
            预行动50%`,
        applyEffect: () => {
            player.b.pl.speed = player.b.pl.speed.mul(0.9)
            player.b.pl_action = tmp.b.fullActionBar.mul(0.5)
        },
        unlocked: () => true
    },
    
    "dagger0": {
        dispn: "匕首",
        etype: "weapon",
        cost: {
            wood: d(10),
            mineral: d(3)
        },
        atk: d(8),
        desc: (number) => `ATK ${format(number.mul(8))}
            速度x1.2
            攻击附加流血`,
        applyEffect: () => {
            player.b.pl.speed = player.b.pl.speed.mul(1.2)
            player.b.pl.traits["induce_bleeding"] = undefined
        },

        unlocked: () => true
    },

    // shield
    "shield0": {
        dispn: "铁盾",
        etype: "shield",
        cost: {
            mineral: d(8)
        },
        def: d(3),
        desc: (number) => `DEF ${format(number.mul(3))}`,
        unlocked: () => true
    },

    // armor
    "armor0": {
        dispn: "铁甲",
        etype: "armor",
        cost: {
            mineral: d(10)
        },
        def: d(3),
        desc: (number) => `DEF ${format(number.mul(3))}`,
        unlocked: () => true
    },
    
    "cloth": {
        dispn: "软甲",
        etype: "armor",
        cost: {
            fiber: d(10),
            fur: d(40)
        },
        def: d(1),
        desc: (number) => `DEF ${format(number.mul(1))}
            速度x1.2`,
        applyEffect: () => {
            player.b.pl.speed = player.b.pl.speed.mul(1.2)
        },
        unlocked: () => true
    },

    // ring
    "grassring": {
        dispn: "草叶戒指",
        etype: "ring",
        cost: {
            fiber: d(10)
        },
        desc: (number) => `幂次原野投入时间 x${format(number.add(1.5).log(1.5))}`,
        effect: (number) => number.add(2).log(2),
        unlocked: () => true
    },

    "goldenring": {
        dispn: "黄金戒指",
        etype: "ring",
        cost: {
            gold: d(200)
        },
        desc: (number) => `战斗奖励 x${format(number.add(2).log(2))}`,
        effect: (number) => number.add(2).log(2),
        unlocked: () => player.mk.goldenring_unlocked
    }
}