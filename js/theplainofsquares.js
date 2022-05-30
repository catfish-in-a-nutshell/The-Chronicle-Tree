addLayer("mp", {
    name: "幂次原野", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    canReset() {
        return (!player.r.is_dead) && hasUpgrade("p", 35)
    },
    color: "#44bd32",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "投入时间", // Name of prestige currency
    baseResource: "空余时间", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    tooltip: () => `幂次原野: ${format(player.mp.points)} 投入时间`,
    tooltipLocked: () => "幂次原野 - 需要升级: 从皮亚诺村启程",
    
    row: 0, // Row the layer is in on the tree (0 is the first row)
    displayRow: 0,
    hotkeys: [
        {key: "m", description: "m: 将空余时间投入幂次原野区域", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() {
        return hasAchievement("m", 13)
    },

    
    buyables: {
        11: {
            title: "向深处探索",
            cost(x) {
                return new Decimal(1.8).pow(x).mul(20)
            },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                let ret = `探索等级 ${format(cur_amount, 0)}/10\n\n`
                
                if (cur_amount.lt(10) && cur_amount.gt(0)) {
                    ret += "<p style='color: red'> 注意: 继续探索会将区域数量级x3.6, 误入深处可能会非常危险！ </p>\n"
                }

                if (cur_amount.gte(1)) {
                    ret += `当前等级: 区域数量级 ${format(this.effect())}\n`
                }
                if (cur_amount.lt(10)) {
                    ret += `下一级价格: ${format(this.cost(cur_amount))} 投入时间`
                }
                return ret
            },
            unlocked() {
                return hasUpgrade("p", 35)
            },
            purchaseLimit: new Decimal(10),
            effect() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return cur_amount.gte(2) ? new Decimal(3.6).pow(cur_amount.sub(1)) : new Decimal(1);
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
    },

    clickables: {
        11: {
            "title": "伐木",
            display() {
                let disp = `使用当前投入时间的50%以及4食物，获得木材与纤维，并增长劳务能力。\n
                单位时间收益:
                ${format(tmp.mp.lumberWoodIncome)} 木材
                ${format(tmp.mp.lumberFiberIncome)} 纤维
                ${format(tmp.mp.lumberExp)} 经验`
                return disp
            },
            style() {
                if (!player.r.is_dead) {
                    return {
                        "background-color": "#44bd32"
                    }
                } else {
                    return {
                        "background-color": "#ffffff"
                    }
                }
            },
            onClick() {
                let data = player.mp
                let t = data.points.mul(0.5)
                data.points = data.points.sub(t)
                player.i.food = player.i.food.sub(4) 
                player.i.wood = player.i.wood.add(t.mul(tmp.mp.lumberWoodIncome))
                player.i.fiber = player.i.fiber.add(t.mul(tmp.mp.lumberFiberIncome))
                player.e.laboring.cur_exp = player.e.laboring.cur_exp.add(t.mul(tmp.mp.lumberExp))

                layers["i"].useEquip("axe", t.sqrt())
            },
            canClick() {
                return !player.r.is_dead && player.mp.points.gt(0) && player.i.food.gt(5) && player.i.equips.axe.equipped
            },
            unlocked() {
                return getBuyableAmount(this.layer, 11).gt(0)
            }
        },

        12: {
            "title": "挖矿",
            display() {
                disp = `使用当前投入时间的50%以及4食物，获得矿物，并增长劳务能力。\n
                单位时间收益:
                ${format(tmp.mp.mineIncome)} 矿物
                ${format(tmp.mp.mineExp)} 经验`
                return disp
            },
            style() {
                if (!player.r.is_dead) {
                    return {
                        "background-color": "#44bd32"
                    }
                } else {
                    return {
                        "background-color": "#ffffff"
                    }
                }
            },
            onClick() {
                let data = player.mp
                let t = data.points.mul(0.5)
                data.points = data.points.sub(t)
                player.i.food = player.i.food.sub(4)
                player.i.mineral = player.i.mineral.add(t.mul(tmp.mp.mineIncome))
                player.e.laboring.cur_exp = player.e.laboring.cur_exp.add(t.mul(tmp.mp.mineExp))
                
                layers["i"].useEquip("pickaxe", t.sqrt())
            },
            canClick() {
                return !player.r.is_dead && player.mp.points.gt(0) && player.i.food.gt(5) && player.i.equips.pickaxe.equipped
            },
            unlocked() {
                return getBuyableAmount(this.layer, 11).gt(0)
            }
        },

        13: {
            "title": "狩猎",
            display() {
                let disp = `使用当前投入时间的50%以及4食物，有概率发现野兽，并增长索敌能力。\n
                单位时间收益:
                ${format(tmp.mp.huntProbability)} 几率发现猎物
                ${format(tmp.mp.huntExp)} 经验(成功发现时x1.5)`
                return disp
            },
            style() {
                if (!player.r.is_dead) {
                    return {
                        "background-color": "#44bd32"
                    }
                } else {
                    return {
                        "background-color": "#ffffff"
                    }
                }
            },
            onClick() {
                let data = player.mp
                let t = data.points.mul(0.5)
                data.points = data.points.sub(t)
                player.i.food = player.i.food.sub(4)

                let r = Math.random()
                let exp = t.mul(tmp.mp.huntExp)

                if (tmp.mp.huntProbability.gte(r)) {
                    exp = exp.mul(1.5)

                    let {weights, targets} = areas["mphunting"]
                    target = targets[weighted_choice(weights)]
                    layers["b"].startEncounter(target, buyableEffect(this.layer, 11))
                } 

                player.e.hunting.cur_exp = player.e.hunting.cur_exp.add(exp)
            },
            canClick() {
                return !player.r.is_dead && player.mp.points.gt(0) && player.i.food.gt(5) && player.i.equips.weapon.equipped
            },
            unlocked() {
                return getBuyableAmount(this.layer, 11).gt(0)
            }
        },

        21: {
            "title": "洞穴",
            display() {
                let disp = `副本
                    平均数字: 5
                    首通奖励: 解锁技能点升级
                    奖励: 金子、矿物、装备`
                return disp
            },
            style() {
                if (!player.r.is_dead) {
                    return {
                        "background-color": "#44bd32"
                    }
                } else {
                    return {
                        "background-color": "#ffffff"
                    }
                }
            },
            onClick() {
                layers["b"].startZone("mpcave")
            },
            canClick() {
                return !player.r.is_dead && player.mp.points.gt(0) 
                    && player.i.equips.weapon.equipped
                    && !player.b.in_battle
            },
            unlocked() {
                return getBuyableAmount(this.layer, 11).gt(0)
            }
        },

        22: {
            "title": "动物集落",
            display() {
                let disp = `副本
                    平均数字: 50
                    首通奖励: 解锁更多重生升级
                    奖励: 食物、装备`
                return disp
            },
            style() {
                if (!player.r.is_dead) {
                    return {
                        "background-color": "#44bd32"
                    }
                } else {
                    return {
                        "background-color": "#ffffff"
                    }
                }
            },
            onClick() {
                layers["b"].startZone("mphorde")
            },
            canClick() {
                return !player.r.is_dead && player.mp.points.gt(0) 
                    && player.i.equips.weapon.equipped
                    && !player.b.in_battle
            },
            unlocked() {
                return getBuyableAmount(this.layer, 11).gt(2)
            }
        },

        23: {
            "title": "安娜的秘密基地",
            display() {
                let disp = `副本
                    平均数字: 1e5
                    首通奖励: 解锁更多重生升级
                    奖励: 装备`
                return disp
            },
            style() {
                if (!player.r.is_dead) {
                    return {
                        "background-color": "#44bd32"
                    }
                } else {
                    return {
                        "background-color": "#ffffff"
                    }
                }
            },
            onClick() {
                layers["b"].startZone("mpannazone")
            },
            canClick() {
                return !player.r.is_dead && player.mp.points.gt(0) 
                    && player.i.equips.weapon.equipped
                    && !player.b.in_battle
            },
            unlocked() {
                return getBuyableAmount(this.layer, 11).gt(2)
            }
        },
    },

    lumberWoodIncome() {
        let number_eff = player.r.number.sqrt().mul(player.i.equips.axe.number.sqrt())
        return number_eff.mul(tmp.e.laboringEffect).mul(0.1)
    },

    lumberFiberIncome() {
        let number_eff = player.r.number.sqrt().mul(player.i.equips.axe.number.sqrt())
        return number_eff.mul(tmp.e.laboringEffect).mul(0.04)
    },

    lumberExp() {
        return new Decimal(10).mul(tmp.e.lvlpEffect)
    },

    mineIncome() {
        let number_eff = player.r.number.sqrt().mul(player.i.equips.pickaxe.number.sqrt())
        return number_eff.mul(tmp.e.laboringEffect).mul(0.01)
    },

    mineExp() {
        return new Decimal(10).mul(tmp.e.lvlpEffect)
    },

    huntProbability() {
        let t = player.mp.points.mul(0.5)
        let theta = new Decimal(30).div(tmp.e.huntingEffect)
        return new Decimal(1).sub(t.div(theta).neg().exp())
    },

    huntExp() {
        return new Decimal(10).mul(tmp.e.lvlpEffect)
    },


    update(diff) {

    },

    tabFormat: [
        ["display-text", function() {
            return `在幂次原野区域，你目前有<b> ${format(player.mp.points)} </b>投入时间`
        }, {"font-size": "20px"}],
        
        "blank",
        "prestige-button", "resource-display",
        "blank",
        "upgrades",
        "blank",
        "clickables",
        "blank",
        "buyables",
        "blank",
    ],


    branches() {return ['p']},
})
