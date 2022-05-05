// Ritual, a.k.a Reincarnation, Rebirth, Abdicate, Prestige...

addLayer("r", {
    name: "重生", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        score: new Decimal(0),
        deaths: new Decimal(0),
        number: new Decimal(1),
        is_dead: false
    }},
    color: "#3498db",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "重生点", // Name of prestige currency
    baseResource: "重生分数", // Name of resource prestige is based on
    baseAmount() {return player.r.score}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.8, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    scoreGainMult() {
        let mult = new Decimal(10)
        return mult
    },
    scoreGainExp() {
        let score_exp = new Decimal(1)
        return score_exp
    },
    // upgrades: {
    //     11: {
    //         title: "",
    //         description: "",
    //     }
    // },
    buyables: {
        11: {
            title: "游泳",
            cost(x) { return new Decimal(1).mul(x.add(1).pow(2)) },
            display() { 
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return `你可以游得更快。
                当前效果: ${format(this.effect(cur_amount))}, 下一级价格: ${format(this.cost(cur_amount)) }`
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return cur_amount.add(1).pow(2)
            }
        },
        12: {
            title: "游泳 II",
            cost(x) { return new Decimal(2).mul(x.add(1).pow(3))},
            display() { 
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return `你可以游得更快，但消耗氧气也等比例增加。 
                当前效果: ${format(this.effect(cur_amount))}, 下一级价格: ${format(this.cost(cur_amount)) }`
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return new Decimal(1.8).pow(cur_amount)
            }
        },
        13: {
            title: "游泳 III",
            cost(x) { return new Decimal(3).mul(x.add(1).pow(2))},
            display() { 
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return `消耗氧气速度降低。 
                当前效果: ${format(this.effect(cur_amount))}, 下一级价格: ${format(this.cost(cur_amount)) }`
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return new Decimal(0.6).pow(cur_amount)
            }
        }
    },


    infoboxes: {
        lore: {
            title: "故事",
            body() { return "\t在死亡的一刻，双眼被黑暗笼罩，你的意识逐渐变得模糊。一切感知都离你远去，你觉得仿佛身处现实与梦境的边界。\n你很快意识到，自己并没有真的死亡。" }
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

    row: 10, // Row the layer is in on the tree (0 is the first row)
    displayRow: "side",
    hotkeys: [
        {key: "r", description: "r: 重生", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer) {
        if (resettingLayer == "r") {
            player.r.is_dead = false
            player.r.last_death_cause = ""
            player.r.score = new Decimal(0)
        }
    },
    layerShown() {
        return player.r.deaths.gte(1)
    },
    physicalEffect() {
        return player.r.number
    },
    consumptionEffect() {
        return player.r.number.pow(3)
    },
    speedUp() {
        return player.r.number.cbrt()
    },
    

    tabFormat: {
        "技能": {
            content: ["main-display",
                "prestige-button", "resource-display",
                "blank",
                ["infobox", "lore"],
                "blank",
                "buyables"]
        },

        "数字": {
            content: [["display-text", function(){
                let ret = `<p style='font-size: 20px; margin-bottom: 20px'>你目前的数字为 ${format(player.r.number)}</p>`

                ret += `<p>你的物理尺寸提升 x${format(tmp.r.physicalEffect)}</p>`
                ret += `<p>你的资源消耗提升 x${format(tmp.r.consumptionEffect)}</p>`
                ret += `<p>你的时间速度提升 x${format(tmp.r.speedUp)}</p>`

                return ret
            }]],
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
