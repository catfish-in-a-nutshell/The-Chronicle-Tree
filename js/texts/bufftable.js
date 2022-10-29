var full_buffs = {
    "burning": {
        name: "燃烧",
        params: ["time", "dot"],
        desc: (buff) => `燃烧：每秒损失${buff.dot}生命值，剩余${buff.time}秒`
    },
    
    "weakened": {
        name: "虚弱",
        params: ["moves", "atkrate"],
        desc: (buff) => `虚弱：攻击力x${buff.atkrate}，剩余${buff.moves}次行动`
    },

    "pierce": {
        name: "穿透",
        params: ["moves", "piercerate"],  
        desc: (buff) => `穿透：使对方防御力x${buff.piercerate}，剩余${buff.moves}次行动`
    },

    "bleeding": {
        name: "流血",
        params: ["moves", "dmgrate"],
        desc: (buff) => `流血：每次行动损失生命上限x${buff.dmgrate}的生命值，剩余${buff.moves}次行动`
    },

    "raging": {
        name: "暴怒",
        params: ["moves"],
        desc: (buff) => `暴怒：必定暴击，剩余${buff.moves}次行动`
    },

    "comboatk": {
        name: "连击",
        params: ["moves", "times", "discnt"],
        desc: (buff) => `连击：每次以${buff.discnt}x的攻击力攻击${buff.times}次，剩余${buff.moves}次行动`
    },

    "stunned": {
        name: "眩晕",
        params: ["moves"],
        desc: (buff) => `眩晕：无法行动，剩余${buff.moves}次行动`
    }
}

var full_traits = {
    "induce_bleeding": {
        
    }
}