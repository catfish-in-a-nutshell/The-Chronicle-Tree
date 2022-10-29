var full_equip_list = [
    "sword0", "bow0", "dagger0", "shield0", "armor0", "cloth", "grassring",
    "fishingrod0", "axe0", "pickaxe0"
]

var full_equips = {
    // fishingrod
    "fishingrod0": {
        dispn: "鱼竿",
        etype: "fishingrod",
        cost: {
            wood: d(10),
            fiber: d(2)
        },
        unlocked: () => true
    },

    // axe
    "axe0": {
        dispn: "斧头",
        etype: "axe",
        cost: {
            wood: d(10),
            mineral: d(10)
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
            mineral: d(10)
        },
        atk: d(10),
        unlocked: () => true
    },
    
    "bow0": {
        dispn: "长弓",
        etype: "weapon",
        cost: {
            wood: d(10),
            fiber: d(10)
        },
        atk: d(15),
        unlocked: () => true
    },
    
    "dagger0": {
        dispn: "匕首",
        etype: "weapon",
        cost: {
            wood: d(10),
            mineral: d(10)
        },
        atk: d(8),
        unlocked: () => true
    },

    // shield
    "shield0": {
        dispn: "铁盾",
        etype: "shield",
        cost: {
            mineral: d(10)
        },
        def: d(3),
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
        unlocked: () => true
    },
    
    "cloth": {
        dispn: "布甲",
        etype: "armor",
        cost: {
            fiber: d(10)
        },
        def: d(1),
        unlocked: () => true
    },

    // ring
    "grassring": {
        dispn: "纸质戒指",
        etype: "ring",
        cost: {
            mineral: d(10)
        },
        unlocked: () => true
    },
    
}