var full_buffs = {
    "burning": {
        name: "燃烧",
        params: ["time", "dot"],
        desc: (buff) => `燃烧: 每秒损失${buff.dot} HP，剩余${buff.time}秒`
    },
    
    "weakened": {
        name: "虚弱",
        params: ["moves", "atkrate"],
        desc: (buff) => `虚弱: ATK x${buff.atkrate}，剩余${buff.moves}次行动`
    },

    "pierce": {
        name: "穿透",
        params: ["moves", "piercerate"],  
        desc: (buff) => `穿透: 本次攻击对方DEF x${buff.piercerate}，剩余${buff.moves}次行动`
    },

    "bleeding": {
        name: "流血",
        params: ["moves", "dmgrate"],
        desc: (buff) => `流血: 每次行动损失HP上限x${buff.dmgrate}的HP，剩余${buff.moves}次行动`
    },

    "raging": {
        name: "暴怒",
        params: ["moves"],
        desc: (buff) => `暴怒: 必定暴击，剩余${buff.moves}次行动`
    },

    "comboatk": {
        name: "连击",
        params: ["moves", "times", "discnt"],
        desc: (buff) => `连击: 每次以${buff.discnt}x的ATK 攻击${buff.times}次，剩余${buff.moves}次行动`
    },

    "stunned": {
        name: "眩晕",
        params: ["moves"],
        desc: (buff) => `眩晕: 无法行动，剩余${buff.moves}次行动`
    },

    "boss": {
        name: "精英",
        params: ["moves", "rate"],
        desc: (buff) => `精英: 在HP归0时，HP, ATK, DEFx${buff.rate}并恢复全部HP，剩余${buff.moves}次`
    },

    "engulfed": {
        name: "吞噬",
        params: ["rate"],
        desc: (buff) => `吞噬: 每层使得行动速度减半(最小x0.0001)，目前x${buff.rate}`
    },

    "losttail": {
        name: "残尾",
        params: ["rate"],
        desc: (buff) => `残尾: 打倒此敌人的奖励降低为 x${buff.rate}`
    },

    "tough": {
        name: "坚韧",
        params: ["rate"],
        desc: (buff) => `坚韧: 受到伤害 x${format(buff.rate)}`
    }
}

var full_traits = {
    "induce_bleeding": {
        dispn: "出血",
        desc: () => `出血: 攻击附加流血`
    },

    "furious": {
        dispn: "狂暴",
        desc: () => `狂暴: 暴击伤害翻倍(x1.5 -> x3)`
    },

    "warcry": {
        dispn: "战吼",
        desc: () => `战吼: 每次攻击后 ATK x1.2`
    },

    "peeled": {
        dispn: "被剥皮",
        desc: () => `无皮: DEF为0, 每次攻击或被攻击后 ATK x0.8`
    },

    "worms": {
        dispn: "虫群",
        desc: () => `虫群: 行动时造成百分比伤害(HP上限的1%)，并造成可叠加的吞噬`
    },

    "losingtail": {
        dispn: "断尾",
        desc: () => `断尾: 在半血以下时行动会使自己成为残尾，减少战斗奖励`
    },

    "innocent": {
        dispn: "童真",
        desc: () => `童真: 仅仅是孩子的玩闹。攻击 ATK在x0.1-x1之间，随心情而定`
    }
}