function clickable_style(bg) {
    return {
        "background-color": bg,
        "width": "140px",
        "height": "160px",
        "border-radius": "1px",
        "margin-bottom": "10px"
    }
}

addLayer("p", {
    name: "皮亚诺村", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "p", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: d(0),
    }},
    row: 0,
    layerShown() {
        return hasAchievement("m", 12)
    },
    canReset() {
        return (!player.r.is_dead && tmp.g.isInited)
    },
    color: "#636e72",
    requires: d(1), // Can be a function that takes requirement increases into account
    resource: "投入时间", // Name of prestige currency
    baseResource: "空余时间", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = d(1)
        if (hasUpgrade("p", 11))
            mult = mult.mul(upgradeEffect("p", 11))
        if (hasUpgrade("p", 12))
            mult = mult.mul(upgradeEffect("p", 12))
        if (hasUpgrade("p", 13))
            mult = mult.mul(upgradeEffect("p", 13))

        if (hasAchievement("m", 21)) {
            mult = mult.mul(2)
        }
        mult = mult.mul(buyableEffect("p", 11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = d(1)
        return exp
    },
    tooltip: () => `投入时间 <br>
        &nbsp; ${formatWhole(player.p.points)}`,
    tooltipLocked: () => "皮亚诺村",
    hotkeys: [
        {key: "p", description: "p: 将空余时间投入皮亚诺村区域", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    nodeBgStyle: {
        "clip-path": "polygon(34% 14%, 75% 0%, 95% 80%, 75% 100%, 41% 85%, 16% 43%)",
    },

    nodeStyle: {
        "--bg-sub-color": "#2d3436",
    },


    upgrades: {
        11: {
            title: "闲逛",
            description: "在村中散步，熟悉地形。本地投入时间转化效率x1.5",
            effect: () => d(1.5),
            cost: d(10),
        },
        12: {
            title: "问路",
            description: "向看上去就无所事事的村民问路。本地投入时间转化效率x1.3",
            unlocked: () => hasUpgrade("p", 11),
            effect: () => d(1.3),
            cost: () => d(20).div(tmp.e.communicationEffect),
        },
        13: {
            title: "搭话",
            description: "向路过村民了解村子的情况。本地投入时间转化效率x1.2",
            unlocked: () => hasUpgrade("p", 11),
            effect: () => d(1.2),
            cost: () => d(100).div(tmp.e.communicationEffect),
        },
        21: {
            title: "拜访村长家",
            description: "从村长那里也许能了解到一些重要的信息。",
            unlocked: () => hasUpgrade("p", 11),
            cost: d(20),
        },
        22: {
            title: "拜访酒馆",
            description: "根据惯例，酒馆是搜集情报的好地方。",
            unlocked: () => hasUpgrade("p", 11),
            cost: d(30),
        },
        23: {
            title: "拜访鱼铺",
            description: "对海边的村民来说，大海永远是重要的资源。",
            unlocked: () => hasUpgrade("p", 11),
            cost: d(40),
        },
        24: {
            title: "拜访农家",
            description: "帮忙做点农活，也许可以当做第一桶金。",
            unlocked: () => hasUpgrade("p", 11),
            cost: d(30),
        },
        25: {
            title: "拜访铁匠铺",
            description: "如果想出门冒险，当然得准备趁手的工具和武器。",
            unlocked: () => hasUpgrade("p", 11),
            cost: d(40),
        },
        26: {
            title: "拜访商店",
            description: "虽然是村中简陋的小店，但或许会有冒险中用得上的东西。",
            unlocked: () => hasUpgrade("p", 11),
            cost: d(100),
        },

        31: {
            title: "购买渔具",
            description: "可以在古戈尔之海钓鱼。钓鱼是RPG的特色，不能不品尝",
            unlocked: () => hasUpgrade("p", 23),
            cost: () => d(8).div(tmp.e.tradingEffect),
            currencyDisplayName: () => res_name["gold"],
            currencyInternalName: "gold",
            currencyLocation: () => player.i,
            canAfford: () => tmp.i.canAddInventory,
            onPurchase() {
                player.g.fishing_unlocked = true
                layers["i"].addInventory({
                    equiptype: "fishingrod",
                    name: "fishingrod0",
                    number: d(1),
                })
            }
        },

        32: {
            title: "购买斧头",
            description: "可以在幂次原野砍树。砍树是RPG的特色，不能不品尝",
            unlocked: () => hasUpgrade("p", 25),
            cost: () => d(20).div(tmp.e.tradingEffect),
            currencyDisplayName: () => res_name["gold"],
            currencyInternalName: "gold",
            currencyLocation: () => player.i,
            canAfford: () => tmp.i.canAddInventory,
            onPurchase() {
                layers["i"].addInventory({
                    equiptype: "axe",
                    name: "axe0",
                    number: d(1),
                })
            }
        },

        33: {
            title: "购买铁镐",
            description: "可以在幂次原野挖矿。挖矿是RPG的特色，不能不品尝",
            unlocked: () => hasUpgrade("p", 25),
            cost: () => d(50).div(tmp.e.tradingEffect),
            currencyDisplayName: () => res_name["gold"],
            currencyInternalName: "gold",
            currencyLocation: () => player.i,
            canAfford: () => tmp.i.canAddInventory,
            onPurchase() {
                layers["i"].addInventory({
                    equiptype: "pickaxe",
                    name: "pickaxe0",
                    number: d(1),
                })
            }
        },

        34: {
            title: "购买铁剑",
            description: "可以在野外地图战斗。战斗是RPG的特色，不能不品尝",
            unlocked: () => hasUpgrade("p", 25),
            cost: () => d(100).div(tmp.e.tradingEffect),
            currencyDisplayName: () => res_name["gold"],
            currencyInternalName: "gold",
            currencyLocation: () => player.i,
            canAfford: () => tmp.i.canAddInventory,
            onPurchase() {
                layers["i"].addInventory({
                    equiptype: "weapon",
                    name: "sword0",
                    number: d(1),
                })
            }
        },

        35: {
            title: "从皮亚诺村启程",
            description: "需要拥有斧头、铁镐、铁剑中至少一件。解锁: 幂次原野",
            unlocked: () => hasAchievement("m", 13),
            cost: d(20),
            canAfford: () => hasUpgrade("p", 32) || hasUpgrade("p", 33) || hasUpgrade("p", 34),
            currencyDisplayName: () => res_name["food"],
            currencyInternalName: "food",
            currencyLocation: () => player.i
        },

        41: {
            title: "向铁匠请教 I",
            description: () => `使用 ${format(d(40).div(tmp.e.tradingEffect))} ${res_name["fur"]} 与 ${format(d(200).div(tmp.e.tradingEffect))} ${res_name["gold"]} 作为赠礼，
                永久解锁功能: 物品-制造，可以使用材料制造新的装备。`,
            unlocked: () => hasUpgrade("p", 35),
            cost: () => d(300).div(tmp.e.communicationEffect),
            canAfford: () => player.i.fur.gte(d(40).div(tmp.e.tradingEffect)) && player.i.gold.gte(d(200).div(tmp.e.tradingEffect)),
            onPurchase() {
                player.i.fur = player.i.fur.sub(d(40).div(tmp.e.tradingEffect))
                player.i.gold = player.i.gold.sub(d(200).div(tmp.e.tradingEffect))
                player.i.making_unlocked = true
            }
        },
        
        42: {
            title: "向铁匠请教 II",
            description: () => `使用 ${format(d(40).div(tmp.e.tradingEffect))} ${res_name["fur"]} 与 ${format(d(200).div(tmp.e.tradingEffect))} ${res_name["gold"]} 作为赠礼，
                永久解锁功能: 物品-回炉，可以使用材料提升装备的数字。`,
            unlocked: () => hasUpgrade("p", 35),
            cost: () => d(300).div(tmp.e.communicationEffect),
            canAfford: () => player.i.fur.gte(d(40).div(tmp.e.tradingEffect)) && player.i.gold.gte(d(200).div(tmp.e.tradingEffect)),
            onPurchase() {
                player.i.fur = player.i.fur.sub(d(40).div(tmp.e.tradingEffect))
                player.i.gold = player.i.gold.sub(d(200).div(tmp.e.tradingEffect))
                player.i.forge_unlocked = true
            }
        }
    },

    buyables: {
        11: {
            title: "和村长交谈",
            cost(x) {
                c = x.mul(5).add(10)
                c = c.div(tmp.e.communicationEffect).mul(buyableEffect("p", 13))
                return c
            },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                let ret = `进度 ${format(cur_amount, 0)}/7\n\n`
                if (cur_amount.gte(1) && cur_amount.lte(7)) {
                    ret += full_dialogue["p11"][format(cur_amount, 0)-1] + "\n\n"
                }
                if (cur_amount.gte(3)) {
                    ret += `当前效果：本地投入时间转化效率 x${format(this.effect())}\n`
                }
                if (cur_amount.lt(7)) {
                    ret += `下一级价格: ${format(this.cost(cur_amount))} 投入时间`
                }
                return ret
            },
            unlocked() {
                return hasUpgrade(this.layer, 21)
            },
            purchaseLimit: d(7),
            effect() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return cur_amount.gte(3) ? d(1.2).pow(cur_amount.sub(2).sqrt()) : d(1);
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        12: {
            title: "和村长交谈 II - 数字学概论101",
            cost(x) {
                c = x.mul(5).add(50)
                c = c.div(tmp.e.communicationEffect).mul(buyableEffect("p", 13))
                return c
            },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                let ret = `进度 ${format(cur_amount, 0)}/14\n\n`
                if (cur_amount.gte(1) && cur_amount.lte(14)) {
                    ret += full_dialogue["p12"][format(cur_amount, 0)-1] + "\n\n"
                }
                if (cur_amount.lt(14)) {
                    ret += `下一级价格: ${format(this.cost(cur_amount)) } 投入时间`
                }
                return ret
            },
            unlocked() {
                return getBuyableAmount(this.layer, 11).gte(7)
            },
            purchaseLimit: d(14),
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        13: {
            title: "买酒，和酒客交谈",
            cost(x) {
                let c = x.mul(1).add(2)
                c = c.div(tmp.e.communicationEffect).mul(buyableEffect("p", 13))
                return c
            },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                let ret = `进度 ${format(cur_amount, 0)}/8\n\n`
                if (cur_amount.gte(1) && cur_amount.lte(8)) {
                    ret += full_dialogue["p13"][format(cur_amount, 0)-1] + "\n\n"
                }
                ret += `当前效果：村中对话花费 x${format(this.effect())}\n`
                if (cur_amount.lt(8)) {
                    ret += `下一级价格: ${format(this.cost(cur_amount))} ${res_name["gold"]}`
                }
                return ret
            },
            unlocked() {
                return hasUpgrade(this.layer, 22)
            },
            purchaseLimit: d(8),
            effect() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return d(1).sub(cur_amount.mul(0.05))
            },
            canAfford() { return player.i.gold.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player.i.gold = player.i.gold.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        14: {
            title: "给路边的流浪汉一点吃的",
            cost(x) { 
                return d(2).add(d(1).mul(x)).mul(buyableEffect("p", 13))
            },
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                let ret = "进度 " + format(cur_amount, 0) + "/8\n"
                if (cur_amount.gte(1) && cur_amount.lte(8)) {
                    ret += full_dialogue["p14"][format(cur_amount, 0)-1] + "\n"
                }
                if (cur_amount.lt(8)) {
                    ret += `下一级价格: ${format(this.cost(cur_amount))} ${res_name["food"]}`
                }
                return ret
            },
            unlocked() {
                return hasUpgrade(this.layer, 13)
            },
            purchaseLimit: d(8),
            effect() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return d(1).sub(cur_amount.mul(0.05))
            },
            canAfford() { return player.i.food.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player.i.food = player.i.food.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
    },

    clickables: {
        11: {
            "title": "在酒馆帮忙",
            display() {
                let disp = `使用当前投入时间的50%，获得少量报酬，并增长交流能力。\n
                收益:
                ${format(player.p.points.mul(0.5).mul(tmp.p.tavernIncome))} ${res_name["gold"]}
                ${format(player.p.points.mul(0.5).mul(tmp.p.tavernExp))} 经验`
                return disp
            },
            style() {
                return clickable_style(player.r.is_dead ? "#ffffff" : "#f39c12")
            },
            onClick() {
                let data = player.p
                let t = data.points.mul(0.5)
                data.points = data.points.sub(t)
                player.i.gold = player.i.gold.add(t.mul(tmp.p.tavernIncome))
                player.e.communication.cur_exp = player.e.communication.cur_exp.add(t.mul(tmp.p.tavernExp))
            },
            canClick() {
                return !player.r.is_dead && player.p.points.gt(0)
            },
            unlocked() {
                return hasUpgrade(this.layer, 22)
            }
        },
        
        12: {
            "title": "在农家帮忙",
            display() {
                let disp = `使用当前投入时间的50%，获得较多报酬，并增长劳务能力。\n
                收益:
                ${format(player.p.points.mul(0.5).mul(tmp.p.farmGoldIncome))} ${res_name["gold"]}
                ${format(player.p.points.mul(0.5).mul(tmp.p.farmFoodIncome))} ${res_name["food"]}
                ${format(player.p.points.mul(0.5).mul(tmp.p.farmExp))} 经验`
                return disp
            },
            style() {
                return clickable_style(player.r.is_dead ? "#ffffff" : "#f39c12")
            },
            onClick() {
                let data = player.p
                let t = data.points.mul(0.5)
                data.points = data.points.sub(t)
                player.i.gold = player.i.gold.add(t.mul(tmp.p.farmGoldIncome))
                player.i.food = player.i.food.add(t.mul(tmp.p.farmFoodIncome))
                player.e.laboring.cur_exp = player.e.laboring.cur_exp.add(t.mul(tmp.p.farmExp))
            },
            canClick: () => !player.r.is_dead && player.p.points.gt(0),
            unlocked: () => hasUpgrade("p", 24),
        },

        
        13: {
            "title": "卖鱼",
            display() {
                let disp = `卖掉当前${res_name["fish"]}的50%，获得报酬，并增长交易能力。\n
                将${format(player.i.fish.mul(0.5))}${res_name["fish"]}换为:
                ${format(player.i.fish.mul(0.5).mul(tmp.p.sellFishIncome))} ${res_name["gold"]}
                ${format(player.i.fish.mul(0.5).mul(tmp.p.sellFishExp))} 经验`
                return disp
            },
            style() {
                return clickable_style(player.r.is_dead ? "#ffffff" : "#f39c12")
            },
            onClick() {
                let data = player.i
                let f = data.fish.mul(0.5)
                data.fish = data.fish.sub(f)
                data.gold = data.gold.add(f.mul(tmp.p.sellFishIncome))
                player.e.trading.cur_exp = player.e.trading.cur_exp.add(f.mul(tmp.p.sellFishExp))
            },
            canClick: () => !player.r.is_dead && player.i.fish.gt(0),
            unlocked: () => hasUpgrade("p", 23),
        },

        
        14: {
            "title": "将鱼制成食物",
            display() {
                let disp = `处理当前${res_name["fish"]}的50%，转化为对应的${res_name["food"]}，并增长烹饪能力。\n
                将${format(player.i.fish.mul(0.5))}${res_name["fish"]}换为:
                ${format(player.i.fish.mul(0.5).mul(tmp.p.dealFishIncome))} ${res_name["food"]}
                ${format(player.i.fish.mul(0.5).mul(tmp.p.dealFishExp))} 经验`
                return disp
            },
            style() {
                return clickable_style(player.r.is_dead ? "#ffffff" : "#f39c12")
            },
            onClick() {
                let data = player.i
                let f = data.fish.mul(0.5)
                data.fish = data.fish.sub(f)
                data.food = data.food.add(f.mul(tmp.p.dealFishIncome))
                player.e.cooking.cur_exp = player.e.cooking.cur_exp.add(f.mul(tmp.p.dealFishExp))
            },
            canClick: () => !player.r.is_dead && player.i.fish.gt(0),
            unlocked: () => hasUpgrade("p", 23),
        },

        
        15: {
            "title": "购买食物",
            display() {
                let disp = `花${res_name["gold"]}购买${res_name["food"]}，并增长交易能力。\n
                单次效益:
                + 10 ${res_name["food"]}\n- ${format(tmp.p.buyFoodCost)} ${res_name["gold"]}
                ${format(tmp.p.buyFoodExp)} 经验`
                return disp
            },
            style() {
                return clickable_style(player.r.is_dead ? "#ffffff" : "#f39c12")
            },
            onClick() {
                let data = player.i
                data.food = data.food.add(10)
                data.gold = data.gold.sub(tmp.p.buyFoodCost)
                player.e.trading.cur_exp = player.e.trading.cur_exp.add(tmp.p.buyFoodExp)
            },
            canClick: () => !player.r.is_dead && player.i.gold.gt(tmp.p.buyFoodCost),
            unlocked: () => hasUpgrade("p", 26),
        }
    },

    infoboxes: {
        lore: {
            title: "故事",
            body() {
                let disp = "你来到海边异常平和的小村庄。你对这里有着朦胧的印象，但似乎没有一个人认识你。"

                let keys = [11, 12, 13, 14]
                let dkeys = ["p11", "p12", "p13", "p14"]
                let titles = ["和村长交谈", "和村长交谈 II - 数字学概论", "买酒，和酒客交谈", "给路边的流浪汉一点吃的"]

                for (let i = 0; i < keys.length; i++) {       
                    if (tmp.p.buyables[keys[i]].unlocked) {
                        disp += `<p  style='margin-top: 10px'><h2> ${titles[i]} </h2><p>`
                        let amount = getBuyableAmount("p", keys[i])
                        for (j = 0; j < full_dialogue[dkeys[i]].length; j++) {
                            if (amount.gt(j)) {
                                disp += `<p style='margin-top: 5px'>${full_dialogue[dkeys[i]][j]}</p>`
                            }
                        }
                        disp += "<p style='margin-top: 5px'> --------------------------------------</p>"
                    }
                }
                return disp
            }
        }
    },

    layerFinished() {
        let need_upgrade_list = [11, 12, 13, 21, 22, 23, 24, 25, 26, 31, 32, 33, 34, 35, 41, 42]
        let buyable_finish_list = {11: 7, 12: 14, 13: 8, 14: 8}
        for (let d of need_upgrade_list) {
            if (!hasUpgrade("p", d)) return false
        }
        for (let b in buyable_finish_list) {
            if (getBuyableAmount("p", b).lt(buyable_finish_list[b])) return false
        }
        return true
    },

    tavernIncome() {
        return d(0.05)
    },

    tavernExp() {
        return d(10).mul(layers.e.survivalSkillExpMult("communication"))
    },

    farmGoldIncome() {
        return d(0.05).mul(tmp.e.laboringEffect)
    },

    farmFoodIncome() {
        return d(0.02).mul(tmp.e.laboringEffect)
    },
    
    farmExp() {
        return d(10).mul(layers.e.survivalSkillExpMult("laboring"))
    },

    sellFishIncome() {
        return d(0.1).mul(tmp.e.tradingEffect)
    },
    
    sellFishExp() {
        return d(10).mul(layers.e.survivalSkillExpMult("trading"))
    },

    dealFishIncome() {
        return d(0.05).mul(tmp.e.cookingEffect)
    },
    
    dealFishExp() {
        return d(10).mul(layers.e.survivalSkillExpMult("cooking"))
    },

    buyFoodCost() {
        return d(20).div(tmp.e.tradingEffect)
    },
    
    buyFoodExp() {
        return d(10).mul(layers.e.survivalSkillExpMult("trading"))
    },

    update(diff) {
        if (hasUpgrade("r", 11) && tmp.g.isInited) {
            let auto_gain = tmp.pointGen.mul(0.5).mul(diff)
            if (hasAchievement("m", 21)) {
                auto_gain = auto_gain.mul(3)
            }
            player.p.points = player.p.points.add(auto_gain)

            if (hasUpgrade("r", 13)) {
                let t = auto_gain.mul(tmp.p.gainMult).mul(0.5)
    
                player.i.gold = player.i.gold.add(t.mul(tmp.p.tavernIncome))
                player.e.communication.cur_exp = player.e.communication.cur_exp.add(t.mul(tmp.p.tavernExp))

                player.i.gold = player.i.gold.add(t.mul(tmp.p.farmGoldIncome))
                player.i.food = player.i.food.add(t.mul(tmp.p.farmFoodIncome))
                player.e.laboring.cur_exp = player.e.laboring.cur_exp.add(t.mul(tmp.p.farmExp))
            }
        }
    },

    tabFormat: {
        "主界面": {
            content: [
            ["display-text", function() {
                return `在皮亚诺村区域，你目前有<b> ${format(player.p.points)} </b>投入时间`    
            }, {"font-size": "20px"}],
            
            "blank",
            "prestige-button",
            "blank",
            "upgrades",
            "blank",
            "buyables",
            "blank",
            "clickables",
            "blank",
        ]},
        "剧情记录": {
            content: [
                ["infobox", "lore"]
            ]
        }
    },
    
    branches() {return ['g']},
})