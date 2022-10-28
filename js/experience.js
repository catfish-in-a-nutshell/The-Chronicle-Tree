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


        atk: {
            cur_exp: decimalZero,
            lvl: decimalZero,
            nxt_exp: new Decimal(100)
        },
        def: {
            cur_exp: decimalZero,
            lvl: decimalZero,
            nxt_exp: new Decimal(100)
        },
        speed: {
            cur_exp: decimalZero,
            lvl: decimalZero,
            nxt_exp: new Decimal(100)
        },
        hp: {
            cur_exp: decimalZero,
            lvl: decimalZero,
            nxt_exp: new Decimal(100)
        },
        battle_exp_strat: "hp"
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

    battleExpGainMult() {
        return new Decimal(1)
    },

    addBattleExp(exp) {
        let strat = player.e.battle_exp_strat
        exp = exp.mul(tmp.e.battleExpGainMult)

        switch (strat) {
            case "avg":
                player.e.hp.cur_exp = player.e.hp.cur_exp.add(exp.div(4))
                player.e.atk.cur_exp = player.e.atk.cur_exp.add(exp.div(4))
                player.e.def.cur_exp = player.e.def.cur_exp.add(exp.div(4))
                player.e.speed.cur_exp = player.e.speed.cur_exp.add(exp.div(4))
                break;

            case "hp":
            case "atk":
            case "def":
            case "speed":
                player.e[strat].cur_exp = player.e[strat].cur_exp.add(exp)
                break;

        }
        return exp
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
        let lvl = player.e.communication.lvl.add(buyableEffect("r", 12))
        return lvl.mul(0.2).add(1)
    },

    swimmingEffect() {
        let lvl = player.e.swimming.lvl.add(buyableEffect("r", 11))
        return lvl.mul(0.5).add(1)
    },

    laboringEffect() {
        let lvl = player.e.laboring.lvl.add(buyableEffect("r", 13))
        return lvl.mul(0.2).add(1)
    }, 

    cookingEffect() {
        let lvl = player.e.cooking.lvl.add(buyableEffect("r", 21))
        return lvl.mul(0.3).add(1)
    },

    tradingEffect() {
        let lvl = player.e.trading.lvl.add(buyableEffect("r", 22))
        return lvl.mul(0.15).add(1)
    },

    fishingEffect() {
        let lvl = player.e.fishing.lvl.add(buyableEffect("r", 23))
        return lvl.mul(0.5).add(1)
    }, 

    huntingEffect() {
        let lvl = player.e.hunting.lvl.add(buyableEffect("r", 31))
        return lvl.sqrt().mul(0.1).add(1)
    },


    hpEffect() {
        let lvl = player.e.hp.lvl
        return lvl.pow(0.75).mul(0.2).add(1)
    },

    atkEffect() {
        let lvl = player.e.atk.lvl
        return lvl.pow(0.75).mul(0.2).add(1)
    },

    defEffect() {
        let lvl = player.e.def.lvl
        return lvl.pow(0.75).mul(0.2).add(1)
    },

    speedEffect() {
        let lvl = player.e.speed.lvl
        return lvl.sqrt().mul(0.2).add(1)
    },


    row: 0, // Row the layer is in on the tree (0 is the first row)
    displayRow: "side",
    
    layerShown() {
        return hasAchievement("m", 11)
    },

    lvlpEffect() {
        return player.e.lvlpoints.add(1).pow(0.20)
    },

    tabFormat: {
        "生存技能": {
             
            content: [
                ["display-text", "</b>你的躯体会随着冒险变强，但如果死去，此页面的内容将被重置！</b>", {"font-size": "20px"}],
                "blank",
                ["display-text", function() {
                    return `你目前总生存技能等级 ${format(player.e.lvlpoints, 0)}, 提升技能经验值获取 x${format(tmp.e.lvlpEffect)}`
                }, {"font-size": "20px"}],
                "blank",
                ["display-text", function() {
                    return `交流lv${format(player.e.communication.lvl, 0)}+${buyableEffect("r", 12)}: 降低一切与人交流的时间花费，目前效果 x${format(tmp.e.communicationEffect)}`
                }],
                ["bar", "communicationBar"],
                "blank",
                ["display-text", function() {
                    return `游泳lv${format(player.e.swimming.lvl, 0)}+${buyableEffect("r", 11)}: 加快游泳速度，目前效果 x${format(tmp.e.swimmingEffect)}`
                }],
                ["bar", "swimmingBar"],
                "blank",
                ["display-text", function() {
                    return `劳务lv${format(player.e.laboring.lvl, 0)}+${buyableEffect("r", 13)}: 提升体力劳动的产出，目前效果 x${format(tmp.e.laboringEffect)}`
                }],
                ["bar", "laboringBar"],
                "blank",
                ["display-text", function() {
                    return `烹饪lv${format(player.e.cooking.lvl, 0)}+${buyableEffect("r", 21)}: 提升${res_name["food"]}转化效率，目前效果 x${format(tmp.e.cookingEffect)}`
                }],
                ["bar", "cookingBar"],
                "blank",
                ["display-text", function() {
                    return `贸易lv${format(player.e.trading.lvl, 0)}+${buyableEffect("r", 22)}: 降低购买时的成本、提升卖出时的收益，目前效果 x${format(tmp.e.tradingEffect)}`
                }],
                ["bar", "tradingBar"],
                "blank",
                ["display-text", function() {
                    return `钓鱼lv${format(player.e.fishing.lvl, 0)}+${buyableEffect("r", 23)}: 提升水中资源的产出，目前效果 x${format(tmp.e.fishingEffect)}`
                }],
                ["bar", "fishingBar"],
                "blank",
                ["display-text", function() {
                    return `索敌lv${format(player.e.hunting.lvl, 0)}+${buyableEffect("r", 31)}: 提升发现敌人的概率，目前效果 x${format(tmp.e.huntingEffect)}`
                }],
                ["bar", "huntingBar"]]
        },

        "战斗技能": {
            content: [
                ["display-text", "</b>你的躯体会随着冒险变强，但如果死去，此页面的内容将被重置！</b>", {"font-size": "20px"}],
                "blank",
                
                ["display-text", function() {
                    return `<p>战斗经验不受生存技能等级加成，且会在四个技能间均分。</p><p>你也可以选择专精其中一项，使其独享经验！</p>`
                }, {"font-size": "16px"}],
                "blank",
                ["display-text", function() {
                    return `耐力lv${format(player.e.hp.lvl, 0)}: 提升生命值上限，目前效果 x${format(tmp.e.hpEffect)}`
                }],
                ["row", [["bar", "hpBar"], ["clickable", 11]]],
                "blank",
                ["display-text", function() {
                    return `攻击lv${format(player.e.atk.lvl, 0)}: 提升攻击力，目前效果 x${format(tmp.e.atkEffect)}`
                }],
                ["row", [["bar", "atkBar"], ["clickable", 12]]],
                "blank",
                ["display-text", function() {
                    return `防御lv${format(player.e.def.lvl, 0)}: 提升防御力，目前效果 x${format(tmp.e.defEffect)}`
                }],
                ["row", [["bar", "defBar"], ["clickable", 13]]],
                "blank",
                ["display-text", function() {
                    return `速度lv${format(player.e.speed.lvl, 0)}: 提升行动速度，目前效果 x${format(tmp.e.speedEffect)}`
                }],
                ["row", [["bar", "speedBar"], ["clickable", 14]]],
            ],
            unlocked: () => hasAchievement("m", 16)
        }
    },

    
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
        },

        hpBar: {
            direction: RIGHT,
            width: 350,
            height: 40,
            fillStyle: {'background-color' : "#e67e22"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {"border-radius":"1px"}},
            progress() { return player.e.hp.cur_exp.div(player.e.hp.nxt_exp) },
            display() { return `下一级经验: ${format(player.e.hp.cur_exp)}/${format(player.e.hp.nxt_exp)}`},
            unlocked: true
        },
        atkBar: {
            direction: RIGHT,
            width: 350,
            height: 40,
            fillStyle: {'background-color' : "#e67e22"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {"border-radius":"1px"}},
            progress() { return player.e.atk.cur_exp.div(player.e.atk.nxt_exp) },
            display() { return `下一级经验: ${format(player.e.atk.cur_exp)}/${format(player.e.atk.nxt_exp)}`},
            unlocked: true
        },
        defBar: {
            direction: RIGHT,
            width: 350,
            height: 40,
            fillStyle: {'background-color' : "#e67e22"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {"border-radius":"1px"}},
            progress() { return player.e.def.cur_exp.div(player.e.def.nxt_exp) },
            display() { return `下一级经验: ${format(player.e.def.cur_exp)}/${format(player.e.def.nxt_exp)}`},
            unlocked: true
        },
        speedBar: {
            direction: RIGHT,
            width: 350,
            height: 40,
            fillStyle: {'background-color' : "#e67e22"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {"border-radius":"1px"}},
            progress() { return player.e.speed.cur_exp.div(player.e.speed.nxt_exp) },
            display() { return `下一级经验: ${format(player.e.speed.cur_exp)}/${format(player.e.speed.nxt_exp)}`},
            unlocked: true
        },
    },

    clickables: {
        11: {
            title: () => player.e.battle_exp_strat === "hp" ? "取消" : "专精",
            display: () => "",
            style() {
                let bg = player.e.battle_exp_strat === "hp" ? "#e67e22" : "#ffffff"
                return {
                    "background-color": bg,
                    "border-radius": "1px",
                    "min-height": "44px",
                    "margin-left": "30px",
                }
            },
            onClick() {
                player.e.battle_exp_strat = player.e.battle_exp_strat === "hp" ? "avg" : "hp"
            },
            canClick: true,
            unlocked: true
        },
        12: {
            title: () => player.e.battle_exp_strat === "atk" ? "取消" : "专精",
            display: () => "",
            style() {
                let bg = player.e.battle_exp_strat === "atk" ? "#e67e22" : "#ffffff"
                return {
                    "background-color": bg,
                    "border-radius": "1px",
                    "min-height": "44px",
                    "margin-left": "30px",
                }
            },
            onClick() {
                player.e.battle_exp_strat = player.e.battle_exp_strat === "atk" ? "avg" : "atk"
            },
            canClick: true,
            unlocked: true,
        },
        13: {
            title: () => player.e.battle_exp_strat === "def" ? "取消" : "专精",
            display: () => "",
            style() {
                let bg = player.e.battle_exp_strat === "def" ? "#e67e22" : "#ffffff"
                return {
                    "background-color": bg,
                    "border-radius": "1px",
                    "min-height": "44px",
                    "margin-left": "30px",
                }
            },
            onClick() {
                player.e.battle_exp_strat = player.e.battle_exp_strat === "def" ? "avg" : "def"
            },
            canClick: true,
            unlocked: true,
        },
        14: {
            title: () => player.e.battle_exp_strat === "speed" ? "取消" : "专精",
            display: () => "",
            style() {
                let bg = player.e.battle_exp_strat === "speed" ? "#e67e22" : "#ffffff"
                return {
                    "background-color": bg,
                    "border-radius": "1px",
                    "min-height": "44px",
                    "margin-left": "30px",
                }
            },
            onClick() {
                player.e.battle_exp_strat = player.e.battle_exp_strat === "speed" ? "avg" : "speed"
            },
            canClick: true,
            unlocked: true,
        },


    },

    update(diff) {
        let skill_list = ["communication", "swimming", "laboring", "cooking", "trading", "fishing", "hunting"]
        skill_list = skill_list.concat(["hp", "atk", "def", "speed"])
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
