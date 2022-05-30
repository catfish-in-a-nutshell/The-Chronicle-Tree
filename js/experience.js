// Experience, a.k.a exp, habit, adv. training(?)

var prices = {
    "swimming": {
        priceStart: new Decimal(10),
        priceAdd: new Decimal(20),
        lvlDivider: new Decimal(5)
    }
}

addLayer("e", {
    name: "经验", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: decimalZero,
        lvlpoints: decimalZero,
        communication: {
            cur_exp: decimalZero,
            lvl: decimalZero,
            nxt_exp: new Decimal(100),
        },
        swimming: {
            cur_exp: decimalZero,
            lvl: decimalZero,
            nxt_exp: new Decimal(100)
        },
        laboring: {
            cur_exp: decimalZero,
            lvl: decimalZero,
            nxt_exp: new Decimal(100)
        },
        cooking: {
            cur_exp: decimalZero,
            lvl: decimalZero,
            nxt_exp: new Decimal(100)
        },
        trading: {
            cur_exp: decimalZero,
            lvl: decimalZero,
            nxt_exp: new Decimal(100)
        },
        fishing: {
            cur_exp: decimalZero,
            lvl: decimalZero,
            nxt_exp: new Decimal(100)
        },
        hunting: {
            cur_exp: decimalZero,
            lvl: decimalZero,
            nxt_exp: new Decimal(100)
        },
    }},
    color: "#27ae60",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "重生点", // Name of prestige currency
    baseResource: "重生分数", // Name of resource prestige is based on
    baseAmount() {return player.r.score}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    tooltip:() => "能力栏",
    tooltipLocked:() => "能力栏",
    prestigeNotify: () => false,


    // upgrades: {
    //     11: {
    //         title: "",
    //         description: "",
    //     }
    // },

    addBattleExp(exp) {
        // TODO: implement battle related system
    },

    communicationGainMult() {
        return new Decimal(1)
    },

    swimmingGainMult() {
        return new Decimal(1)
    },

    laboringGainMult() {
        return new Decimal(1)
    }, 

    cookingGainMult() {
        return new Decimal(1)
    }, 

    tradingGainMult() {
        return new Decimal(1)
    }, 

    fishingGainMult() {
        return new Decimal(1)
    }, 

    huntingGainMult() {
        return new Decimal(1)
    }, 

    communicationEffect() {
        let lvl = player.e.communication.lvl
        return lvl.mul(0.2).add(1)
    },

    swimmingEffect() {
        let lvl = player.e.swimming.lvl.add(buyableEffect("r", 11))
        return lvl.mul(0.5).add(1)
    },

    laboringEffect() {
        return player.e.laboring.lvl.mul(0.2).add(1)
    }, 

    cookingEffect() {
        return player.e.cooking.lvl.mul(0.3).add(1)
    },

    tradingEffect() {
        return player.e.trading.lvl.mul(0.15).add(1)
    },

    fishingEffect() {
        return player.e.fishing.lvl.mul(0.5).add(1)
    }, 

    huntingEffect() {
        return player.e.hunting.lvl.sqrt().mul(0.1).add(1)
    }, 


    row: 0, // Row the layer is in on the tree (0 is the first row)
    displayRow: "side",
    
    layerShown() {
        return hasAchievement("m", 11)
    },

    lvlpEffect() {
        return player.e.lvlpoints.add(1).cbrt()
    },

    tabFormat: 
        [
        ["display-text", "</b>你的躯体会随着冒险变强，但如果死去，此页面的内容将被重置！</b>", {"font-size": "20px"}],
        "blank",
        ["display-text", function() {
            return `你目前总技能点 ${format(player.e.lvlpoints, 0)}, 提升技能经验值获取 x${format(tmp.e.lvlpEffect)}`
        }, {"font-size": "20px"}],
        "blank",
        ["display-text", function() {
            return `交流lv${format(player.e.communication.lvl, 0)}: 降低一切与人交流的时间花费，目前效果 x${format(tmp.e.communicationEffect)}`
        }],
        ["bar", "communicationBar"],
        "blank",
        ["display-text", function() {
            return `游泳lv${format(player.e.swimming.lvl, 0)}+${buyableEffect("r", 11)}: 加快游泳速度，目前效果 x${format(tmp.e.swimmingEffect)}`
        }],
        ["bar", "swimmingBar"],
        "blank",
        ["display-text", function() {
            return `劳务lv${format(player.e.laboring.lvl, 0)}: 提升体力劳动的产出，目前效果 x${format(tmp.e.laboringEffect)}`
        }],
        ["bar", "laboringBar"],
        "blank",
        ["display-text", function() {
            return `烹饪lv${format(player.e.cooking.lvl, 0)}: 提升食物转化效率，目前效果 x${format(tmp.e.cookingEffect)}`
        }],
        ["bar", "cookingBar"],
        "blank",
        ["display-text", function() {
            return `贸易lv${format(player.e.trading.lvl, 0)}: 降低购买时的成本、提升卖出时的收益，目前效果 x${format(tmp.e.tradingEffect)}`
        }],
        ["bar", "tradingBar"],
        "blank",
        ["display-text", function() {
            return `钓鱼lv${format(player.e.fishing.lvl, 0)}: 提升水中资源的产出，目前效果 x${format(tmp.e.fishingEffect)}`
        }],
        ["bar", "fishingBar"],
        "blank",
        ["display-text", function() {
            return `索敌lv${format(player.e.hunting.lvl, 0)}: 提升发现敌人的概率，目前效果 x${format(tmp.e.huntingEffect)}`
        }],
        ["bar", "huntingBar"]],

    
    bars: {
        communicationBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#27ae60"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {}},
            progress() { return player.e.communication.cur_exp.div(player.e.communication.nxt_exp) },
            display() { return `下一级经验: ${format(player.e.communication.cur_exp)}/${format(player.e.communication.nxt_exp)}`},
            unlocked: true
        },
        swimmingBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#27ae60"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {}},
            progress() { return player.e.swimming.cur_exp.div(player.e.swimming.nxt_exp) },
            display() { return `下一级经验: ${format(player.e.swimming.cur_exp)}/${format(player.e.swimming.nxt_exp)}`},
            unlocked: true
        },
        laboringBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#27ae60"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {}},
            progress() { return player.e.laboring.cur_exp.div(player.e.laboring.nxt_exp) },
            display() { return `下一级经验: ${format(player.e.laboring.cur_exp)}/${format(player.e.laboring.nxt_exp)}`},
            unlocked: true
        },
        cookingBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#27ae60"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {}},
            progress() { return player.e.cooking.cur_exp.div(player.e.cooking.nxt_exp) },
            display() { return `下一级经验: ${format(player.e.cooking.cur_exp)}/${format(player.e.cooking.nxt_exp)}`},
            unlocked: true
        },
        tradingBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#27ae60"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {}},
            progress() { return player.e.trading.cur_exp.div(player.e.trading.nxt_exp) },
            display() { return `下一级经验: ${format(player.e.trading.cur_exp)}/${format(player.e.trading.nxt_exp)}`},
            unlocked: true
        },
        fishingBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#27ae60"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {}},
            progress() { return player.e.fishing.cur_exp.div(player.e.fishing.nxt_exp) },
            display() { return `下一级经验: ${format(player.e.fishing.cur_exp)}/${format(player.e.fishing.nxt_exp)}`},
            unlocked: true
        },
        huntingBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#27ae60"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {}},
            progress() { return player.e.hunting.cur_exp.div(player.e.hunting.nxt_exp) },
            display() { return `下一级经验: ${format(player.e.hunting.cur_exp)}/${format(player.e.hunting.nxt_exp)}`},
            unlocked: true
        }
    },

    update(diff) {
        skill_list = ["communication", "swimming", "laboring", "cooking", "trading", "fishing", "hunting"]
        for (let i = 0; i < skill_list.length; i++) {
            let skill = skill_list[i]
            let data = player.e[skill]
            if (data.cur_exp.gte(data.nxt_exp)) {

                let priceStart = new Decimal(100)
                let priceAdd = new Decimal(100)
                let lvlDivider = new Decimal(1)

                if (prices[skill]) {
                    priceStart = prices[skill].priceStart
                    priceAdd = prices[skill].priceAdd
                    lvlDivider = prices[skill].lvlDivider
                }

                let affordLvls = Decimal.affordArithmeticSeries(data.cur_exp, priceStart, priceAdd, data.lvl)
                let sumPrice = Decimal.sumArithmeticSeries(affordLvls, priceStart, priceAdd, data.lvl)
    
                data.cur_exp = data.cur_exp.sub(sumPrice)
                data.lvl = data.lvl.add(affordLvls)
                player.e.lvlpoints = player.e.lvlpoints.add(affordLvls.div(lvlDivider))

                data.nxt_exp = priceStart.add(priceAdd.mul(data.lvl))
                layers["r"].addRawScore(affordLvls.div(lvlDivider))
            }
        }
    }
})
