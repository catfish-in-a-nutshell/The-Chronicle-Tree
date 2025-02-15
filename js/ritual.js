// Ritual, a.k.a Reincarnation, Rebirth, Abdicate, Prestige...

var skill2id = {"swimming": 11, "communication": 12, "laboring": 13, "cooking": 21, "trading": 22, "fishing": 23, "hunting": 31}

var id2skill = {11: "swimming", 12: "communication", 13: "laboring", 21: "cooking", 22: "trading", 23: "fishing", 31: "hunting"}

let ritual_buyable_style = {
    "width": "200px",
    "height": "120px",
    "margin-top": "10px",
    "border-radius": "0px",
    "border": "1px",
    "border-color": "rgba(0, 0, 0, 0.125)"
}

let sigil_template = (symbol) => {
    return `<p class='sigilSymbol'>${symbol}</p>`
}

let sigil_offer_grid_style = {
    "width": "120px",
    "margin": "5px",
    "border-radius": "0px",
    "border": "1px",
    "border-color": "rgba(0, 0, 0, 0.125)",
    "--stripe-sub-color": "var(--bg-sub-color, #74b9ff)",
    "--stripe-main-color": "var(--bg-sub-color, #3498db)",
    "background": "repeating-linear-gradient(120deg, var(--stripe-main-color) 0 15px, var(--stripe-sub-color) 0, var(--stripe-sub-color) 30px)"
}

let sigils = ["sigil0"]

let sigil_offering_res = {
    sigil0: ["gold", "wood", "fur", "bones", "scale"]
}

addLayer("r", {
    name: "重生", // This is optional, only used in a few places, If absent it just uses the layer id.
    disp_symbol: "重生",
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
        points: d(0),
        score: d(0),
        sigil0_pool: d(0),
        sigil0_score: d(0),
        deaths: d(0),
        is_dead: false
    }},
    color: "#3498db",
    subcolor: "#74b9ff",
    requires: d(1), // Can be a function that takes requirement increases into account
    resource: "重生点", // Name of prestige currency
    baseResource: "重生分数", // Name of resource prestige is based on
    baseAmount() {return player.r.score.add(1)}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = d(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return d(1)
    },
    scoreGainMult() {
        let mult = d(10)
        return mult
    },
    scoreGainExp() {
        let score_exp = d(1)
        return score_exp
    },
    number() {
        let n = d(1).mul(tmp.r.sigil0Effect)
        return n
    },


    // effect 0: add extra levels to skill;
    // effect 1: multiplies skill exp gain
    extraExpEffect(id) {
        let cur_amount = getBuyableAmount("r", id)
        let mult_gain = cur_amount.add(1).log(5).add(1)
        return [cur_amount, mult_gain]
    },

    // get effect by skill name
    getExtraExpEffect(skill) {
        return layers.r.extraExpEffect(skill2id[skill])
    },

    extraExpDisplay(id, cost) {
        let skill = id2skill[id]
        let effect = buyableEffect("r", id)
        return `提升${skill_dispn[skill]}技能额外等级 +${format(effect[0], 0)},
        提升${skill_dispn[skill]}技能经验获取 x${format(effect[1])}

        下一级价格: ${format(cost)} 重生点`
    },

    upgrades: {
        11: {
            title: "自动化 - 皮亚诺村",
            description: "在皮亚诺村，每秒自动获得0.5投入时间（受怠惰与数字加成）",
            unlocked: () => hasAchievement("m", 22),
            cost: d(100),
        },

        12: {
            title: "破序 I",
            description: "为什么一定要买武器？没有武器时，视作持有拳头(数字1, ATK 3)，且现在可以无需 升级-从皮亚诺村启程，即可直接到达幂次原野。",
            unlocked: () => hasUpgrade("r", 11),
            cost: d(300),
        },
        
        13: {
            title: "简单化 I",
            description: "在皮亚诺村的酒馆、农家自动投入一定时间。",
            unlocked: () => hasUpgrade("r", 12),
            cost: d(2000),
        },

        14: {
            title: "我无法起步",
            description: "在古戈尔之海解锁潜水，一种获得资源的途径",
            unlocked: () => hasUpgrade("r", 13),
            cost: d(300000)
        }
    },

    buyables: {
        11: {
            title: "游泳",
            cost(x) { return d(1).mul(x.add(1).pow(2)) },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return layers.r.extraExpDisplay(this.id, this.cost(cur_amount))
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() { return layers.r.extraExpEffect(this.id) },
            style: ritual_buyable_style
        },
        
        12: {
            title: "交流", 
            cost(x) { return d(1).mul(x.add(1).pow(2)) },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return layers.r.extraExpDisplay(this.id, this.cost(cur_amount))
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() { return layers.r.extraExpEffect(this.id) },
            unlocked: () => hasAchievement("m", 12), 
            style: ritual_buyable_style
        },
        
        13: {
            title: "劳务",
            cost(x) { return d(1).mul(x.add(1).pow(2)) },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return layers.r.extraExpDisplay(this.id, this.cost(cur_amount))
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() { return layers.r.extraExpEffect(this.id) },
            unlocked: () => hasAchievement("m", 12), 
            style: ritual_buyable_style
        },
        
        21: {
            title: "烹饪",
            cost(x) { return d(1).mul(x.add(1).pow(2)) },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return layers.r.extraExpDisplay(this.id, this.cost(cur_amount))
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() { return layers.r.extraExpEffect(this.id) },
            unlocked: () => hasAchievement("m", 12), 
            style: ritual_buyable_style
        },

        22: {
            title: "贸易",
            cost(x) { return d(1).mul(x.add(1).pow(2)) },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return layers.r.extraExpDisplay(this.id, this.cost(cur_amount))
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() { return layers.r.extraExpEffect(this.id) },
            unlocked: () => hasAchievement("m", 12), 
            style: ritual_buyable_style
        },

        23: {
            title: "钓鱼",
            cost(x) { return d(1).mul(x.add(1).pow(2)) },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return layers.r.extraExpDisplay(this.id, this.cost(cur_amount))
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() { return layers.r.extraExpEffect(this.id) },
            unlocked: () => hasAchievement("m", 12), 
            style: ritual_buyable_style
        },
        
        31: {
            title: "索敌",
            cost(x) { return d(1).mul(x.add(1).pow(2)) },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return layers.r.extraExpDisplay(this.id, this.cost(cur_amount))
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() { return layers.r.extraExpEffect(this.id) },
            unlocked: () => hasAchievement("m", 12), 
            style: ritual_buyable_style
        },
    },

    clickables: {},

    grid: {
        // This is for sigil offering
        rows: 1,
        cols: 5,
        getStartData(id) {
            if (!id) return
            let sigil = sigils[Math.floor(id / 100) - 1] 
            return {
                offered: d(0), 
                sigil: sigil,
                res: sigil_offering_res[sigil][id % 100 - 1]
            }
        },
        getUnlocked(id) {
            let sigil = sigils[Math.floor(id / 100) - 1] 
            let sigil_unlocked_attr = `${sigil}_unlocked`
            return hasAchievement("m", 23) && player.m[sigil_unlocked_attr] 
        },
        getCanClick(data, id) {
            return player.i[data.res].gt(0)
        },
        getEffect(data, id) {
            if (id) return data.offered.add(1000).log(10).div(3)
        },
        getTitle(data, id) {
            return res_name[data.res]
        },
        getDisplay(data, id) {
            if (!id) return
            switch (data.sigil) {
                case 'sigil0':
                    return `投入 ${format(data.offered)}
                        符号0 x${format(gridEffect("r", id))}`
            }
        },
        onClick(data, id) {
            let offer = player.i[data.res]
            data.offered = data.offered.add(offer)
            player.i[data.res] = d(0)
        },
        getStyle: sigil_offer_grid_style
    },


    infoboxes: {
        lore: {
            title: "故事",
            body() { return "\t在死亡的一刻，双眼被黑暗笼罩，你的意识逐渐变得模糊。一切感知都离你远去，你觉得仿佛身处现实与梦境的边界。\n你很快意识到，自己并没有真的死亡。" }
        },
        systemintro: {
            title: "数字",
            body() {
                return `
                    <p style='font-size:20px'>数字是世界的核心系统。</p>
                    <br>
                    数字直接影响你作为一个生物的物理尺寸，也即长宽高的倍率。<br>
                    你的质量和数字的立方成正比，使战斗中的HP, ATK, DEF全部等比例提升。<br>
                    你的一些行动消耗也会相应上升。<br>
                    最后，你的时间速度受到数字的立方根加成。包括战斗时的行动速度。<br>
                    不过别忘了，这一切对你的敌人同样适用。小心高数字的敌人！<br>
                    <br>

                    <p style='font-size:20px'>装备中的数字</p>
                    <br>
                    武器装备也拥有各自的数字，代表其各自的尺寸。<br>
                    你在战斗中的攻防数字，可以看作你与装备两者数字的几何平均。<br>
                    <br>
                    实际HP = 基础HP * 角色数字<sup>3</sup><br>
                    实际ATK = 武器基础ATK * (武器数字 * 角色数字)<sup>1.5</sup><br>
                    实际DEF = 盾牌DEF + 护甲DEF<br>
                    盾牌DEF = 盾牌基础DEF * (盾牌数字 * 角色数字)<sup>1.5</sup><br>
                    护甲DEF = 护甲基础DEF * (护甲数字 * 角色数字)<sup>1.5</sup><br>
                    <br>
                    戒指虽不提供战斗数值，但其特殊效果受到自身数字影响。<br>
                    <br>
                    生产工具的数字，同样直接提升相关行动的产出。<br>
                    <br>
                    生产工具产出 = 基础产出 * 技能加成 * (工具数字 * 角色数字)<sup>1.5</sup><br>
                `
            }
        }
    },
    youDied(death_cause) {
        console.log("you died")
        player.r.is_dead = true
        player.r.last_death_cause = death_cause
        player.r.deaths = player.r.deaths.add(1)
    },
    addRawScore(score) {
        score = score.pow(tmp.r.scoreGainExp)
        score = score.mul(tmp.r.scoreGainMult)
        player.r.score = player.r.score.add(score)
    },
    addSigil0Score(score) {
        player.r.sigil0_score = player.r.sigil0_score.add(score)
    },

    row: 10, // Row the layer is in on the tree (0 is the first row)
    displayRow: "side",
    hotkeys: [
        {key: "r", description: "r: 重生", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer) {
        if (resettingLayer == "r") {
            player.r.is_dead = false
            player.r.last_death_cause = ""
            player.r.score = d(0)

            if (player.m.sigil0_unlocked) {
                player.r.sigil0_pool = player.r.sigil0_pool.add(player.r.sigil0_score)
            }
            player.r.sigil0_score = d(0)
        }
    },
    layerShown() {
        return player.r.deaths.gte(1)
    },
    physicalEffect() {
        return tmp.r.number
    },
    consumptionEffect() {
        return tmp.r.number.pow(3)
    },
    speedUp() {
        return tmp.r.number.cbrt()
    },

    sigil0OfferEffect() {
        let mult = gridEffect("r", 101).mul(gridEffect("r", 102)).mul(gridEffect("r", 103))
        mult = mult.mul(gridEffect("r", 104)).mul(gridEffect("r", 105))
        return mult
    },
    

    sigil0Effect() {
        if (!player.m.sigil0_unlocked) return d(1)
        return player.r.sigil0_pool.div(400).add(3).log(3).mul(tmp.r.sigil0OfferEffect).max(1)
    },

    sigil0EffectNext() {
        if (!player.m.sigil0_unlocked) return d(1)
        let next_sigil0_pool = player.r.sigil0_pool.add(player.r.sigil0_score)
        return next_sigil0_pool.div(400).add(3).log(3).mul(tmp.r.sigil0OfferEffect).max(1)
    },

    tabFormat: {
        "技能": {
            content: ["main-display",
                "prestige-button", "resource-display",
                "blank",
                ["infobox", "lore"],
                "blank",
                "upgrades",
                "blank",
                "buyables"]
        },

        "数字": {
            content: [["display-text", function(){
                let ret = `<p style='font-size: 20px; margin-bottom: 20px'>你目前的数字为 ${format(tmp.r.number)}</p>`

                ret += `<p>你的物理尺寸提升 x${format(tmp.r.physicalEffect)}</p>`
                ret += `<p>你的资源消耗提升 x${format(tmp.r.consumptionEffect)}</p>`
                ret += `<p>你的时间速度提升 x${format(tmp.r.speedUp)}</p>`

                return ret
            }],
            "blank",
            ["row", [["display-text", function() {
                if (!player.m.sigil0_unlocked) return
                let ret = sigil_template("0")
                return ret
            }], ["display-text", function() {
                if (!player.m.sigil0_unlocked) return
                let ret = `角质构成的椭圆形符号，带有浅浅的麝香味。<br>
                    根据所获战斗经验总量得到成长，提升下一次重生的数字。<br>
                    目前效果: x${format(tmp.r.sigil0Effect)} 重生后: x${format(tmp.r.sigil0EffectNext)}`
                return ret
            }]]],
            "blank",

            "grid",
            "blank",
            ["infobox", "systemintro"]],
            unlocked() {
                return hasAchievement("m", 14)
            }
        }

    },

    canReset() {
        return player.r.is_dead && tmp.r.baseAmount.gte(tmp.r.requires)
    },

    update(diff) {

    }
})
