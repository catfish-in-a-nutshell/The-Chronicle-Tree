addLayer("p", {
    name: "皮亚诺村", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "p", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    row: 0,
    layerShown() {
        return hasAchievement("m", 12)
    },
    canReset() {
        return (!player.r.is_dead)
    },
    color: "#bdc3c7",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "投入时间", // Name of prestige currency
    baseResource: "空余时间", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade("p", 11))
            mult = mult.mul(upgradeEffect("p", 11))
        if (hasUpgrade("p", 12))
            mult = mult.mul(upgradeEffect("p", 12))
        if (hasUpgrade("p", 13))
            mult = mult.mul(upgradeEffect("p", 13))

        mult = mult.mul(buyableEffect("p", 11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
    tooltip: () => "皮亚诺村: " + format(player.p.points) + " 投入时间",
    tooltipLocked: () => "皮亚诺村",
    hotkeys: [
        {key: "p", description: "p: 将空余时间投入皮亚诺村区域", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],


    upgrades: {
        11: {
            title: "闲逛",
            description: "在村中散步，熟悉地形。本地投入时间转化效率x1.5",
            effect: () => new Decimal(1.5),
            cost: new Decimal(10),
        },
        12: {
            title: "问路",
            description: "向看上去就无所事事的村民问路。本地投入时间转化效率x1.3",
            unlocked: () => hasUpgrade("p", 11),
            effect: () => new Decimal(1.3),
            cost: () => new Decimal(20).mul(tmp.e.communicationEffect),
        },
        13: {
            title: "搭话",
            description: "向路过村民了解村子的情况。本地投入时间转化效率x1.2",
            unlocked: () => hasUpgrade("p", 11),
            effect: () => new Decimal(1.2),
            cost: () => new Decimal(100).mul(tmp.e.communicationEffect),
        },
        21: {
            title: "拜访村长家",
            description: "从村长那里也许能了解到一些重要的信息。",
            unlocked: () => hasUpgrade("p", 11),
            cost: new Decimal(20),
        },
        22: {
            title: "拜访酒馆",
            description: "根据惯例，酒馆是搜集情报的好地方。",
            unlocked: () => hasUpgrade("p", 11),
            cost: new Decimal(30),
        },
        23: {
            title: "拜访鱼铺",
            description: "对海边的村民来说，大海永远是重要的资源。",
            unlocked: () => hasUpgrade("p", 11),
            cost: new Decimal(40),
        },
        24: {
            title: "拜访农家",
            description: "帮忙做点农活，也许可以当做第一桶金。",
            unlocked: () => hasUpgrade("p", 11),
            cost: new Decimal(40),
        },
        25: {
            title: "拜访铁匠铺",
            description: "如果想出门冒险，当然得准备趁手的工具和武器。",
            unlocked: () => hasUpgrade("p", 11),
            cost: new Decimal(40),
        },
        26: {
            title: "拜访商店",
            description: "虽然是村中简陋的小店，但或许会有冒险中用得上的东西。",
            unlocked: () => hasUpgrade("p", 11),
            cost: new Decimal(100),
        },

        31: {
            title: "购买渔具",
            description: "可以在古戈尔之海钓鱼。钓鱼是RPG的特色，不能不品尝",
            unlocked: () => hasUpgrade("p", 23),
            cost: () => new Decimal(10).div(tmp.e.tradingEffect),
            currencyDisplayName: "金子",
            currencyInternalName: "gold",
            currencyLocation: () => player.i,
            onPurchase() {
                layers["i"].addInventory({
                    equiptype: "fishingrod",
                    name: "鱼竿",
                    number: 1,
                    dur: 100
                })
            }
        },

        32: {
            title: "购买斧头",
            description: "可以在幂次原野砍树。砍树是RPG的特色，不能不品尝",
            unlocked: () => hasUpgrade("p", 25),
            cost: () => new Decimal(20).div(tmp.e.tradingEffect),
            currencyDisplayName: "金子",
            currencyInternalName: "gold",
            currencyLocation: () => player.i,
            onPurchase() {
                layers["i"].addInventory({
                    equiptype: "axe",
                    name: "斧头",
                    number: 1,
                    dur: 100
                })
            }
        },

        33: {
            title: "购买铁镐",
            description: "可以在幂次原野挖矿。挖矿是RPG的特色，不能不品尝",
            unlocked: () => hasUpgrade("p", 25),
            cost: () => new Decimal(50).div(tmp.e.tradingEffect),
            currencyDisplayName: "金子",
            currencyInternalName: "gold",
            currencyLocation: () => player.i,
            onPurchase() {
                layers["i"].addInventory({
                    equiptype: "pickaxe",
                    name: "铁镐",
                    number: 1,
                    dur: 100
                })
            }
        },

        34: {
            title: "购买铁剑",
            description: "可以在野外地图战斗。战斗是RPG的特色，不能不品尝",
            unlocked: () => hasUpgrade("p", 25),
            cost: () => new Decimal(100).div(tmp.e.tradingEffect),
            currencyDisplayName: "金子",
            currencyInternalName: "gold",
            currencyLocation: () => player.i,
            onPurchase() {
                layers["i"].addInventory({
                    equiptype: "weapon",
                    name: "铁剑",
                    number: 1,
                    dur: 100
                })
            }
        },

        35: {
            title: "从皮亚诺村启程",
            description: "需要拥有斧头、铁镐、铁剑中至少一件。解锁: 幂次原野",
            unlocked: () => hasAchievement("m", 13),
            cost: new Decimal(50),
            canAfford: () => hasUpgrade("p", 32) || hasUpgrade("p", 33) || hasUpgrade("p", 34),
            currencyDisplayName: "食物",
            currencyInternalName: "food",
            currencyLocation: () => player.i
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
                cur_amount = getBuyableAmount(this.layer, this.id)
                ret = "进度 " + format(cur_amount, 0) + "/7\n\n"
                if (cur_amount.gte(1) && cur_amount.lt(7)) {
                    ret += full_dialogue["p11"][format(cur_amount, 0)] + "\n\n"
                }
                if (cur_amount.gte(3)) {
                    ret += "当前效果：本地投入时间转化效率x" + format(this.effect()) + "\n"
                }
                if (cur_amount.lt(7)) {
                    ret += "下一级价格: " + format(this.cost(cur_amount)) + " 投入时间"
                }
                return ret
            },
            unlocked() {
                return hasUpgrade(this.layer, 21)
            },
            purchaseLimit: new Decimal(7),
            effect() {
                cur_amount = getBuyableAmount(this.layer, this.id)
                return cur_amount.gte(3) ? new Decimal(1.2).pow(cur_amount.sub(2).sqrt()) : new Decimal(1);
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        12: {
            title: "和村长交谈 II - 数字学概论",
            cost(x) {
                c = x.mul(5).add(50)
                c = c.div(tmp.e.communicationEffect).mul(buyableEffect("p", 13))
                return c
            },
            display() {
                cur_amount = getBuyableAmount(this.layer, this.id)
                ret = "进度 " + format(cur_amount, 0) + "/14\n\n"
                if (cur_amount.gte(1) && cur_amount.lt(14)) {
                    ret += full_dialogue["p12"][format(cur_amount, 0)] + "\n\n"
                }
                // if (cur_amount.gte(3)) {
                //     ret += "当前效果：本地投入时间转化效率x" + format(this.effect())
                // }
                if (cur_amount.lt(14)) {
                    ret += "下一级价格:" + format(this.cost(cur_amount))  + " 投入时间"
                }
                return ret
            },
            unlocked() {
                return getBuyableAmount(this.layer, 11).gte(7)
            },
            purchaseLimit: new Decimal(14),
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        13: {
            title: "买酒，和酒客交谈",
            cost(x) {
                c = x.mul(1).add(2)
                c = c.div(tmp.e.communicationEffect).mul(buyableEffect("p", 13))
                return c
            },
            display() {
                cur_amount = getBuyableAmount(this.layer, this.id)
                ret = "进度 " + format(cur_amount, 0) + "/8\n\n"
                if (cur_amount.gte(1) && cur_amount.lt(8)) {
                    ret += full_dialogue["p13"][format(cur_amount, 0)] + "\n\n"
                }
                ret += "当前效果：村中对话花费 x" + format(this.effect()) + "\n"
                if (cur_amount.lt(8)) {
                    ret += "下一级价格:" + format(this.cost(cur_amount)) + " 金子"
                }
                return ret
            },
            unlocked() {
                return hasUpgrade(this.layer, 22)
            },
            purchaseLimit: new Decimal(8),
            effect() {
                cur_amount = getBuyableAmount(this.layer, this.id)
                return new Decimal(1).sub(cur_amount.mul(0.05))
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
                return new Decimal(2).add(new Decimal(1).mul(x)) // TODO
            },
            display() {
                cur_amount = getBuyableAmount(this.layer, this.id)
                ret = "进度 " + format(cur_amount, 0) + "/8\n"
                if (cur_amount.gte(1) && cur_amount.lt(8)) {
                    ret += full_dialogue["p14"][format(cur_amount, 0)] + "\n"
                }
                if (cur_amount.lt(8)) {
                    ret += "下一级价格:" + format(this.cost(cur_amount)) + " 食物"
                }
                return ret
            },
            unlocked() {
                return hasUpgrade(this.layer, 13)
            },
            purchaseLimit: new Decimal(8),
            effect() {
                cur_amount = getBuyableAmount(this.layer, this.id)
                return new Decimal(1).sub(cur_amount.mul(0.05))
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
                disp = "使用当前投入时间的50%，获得少量报酬，并增长交流能力。\n\n单位时间收益:\n"
                disp += format(tmp.p.tavernIncome) + " 金子\n"
                disp += format(tmp.p.tavernExp) + " 经验"
                return disp
            },
            style() {
                if (!player.r.is_dead) {
                    return {
                        "background-color": "#f39c12"
                    }
                } else {
                    return {
                        "background-color": "#ffffff"
                    }
                }
            },
            onClick() {
                data = player.p
                t = data.points.mul(0.5)
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
                disp = "使用当前投入时间的50%，获得较多报酬，并增长劳务能力。\n\n单位时间收益:\n"
                disp += format(tmp.p.farmGoldIncome) + " 金子\n"
                disp += format(tmp.p.farmFoodIncome) + " 食物\n"
                disp += format(tmp.p.farmExp) + " 经验"
                return disp
            },
            style() {
                if (!player.r.is_dead) {
                    return {
                        "background-color": "#f39c12"
                    }
                } else {
                    return {
                        "background-color": "#ffffff"
                    }
                }
            },
            onClick() {
                data = player.p
                t = data.points.mul(0.5)
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
                disp = "卖掉当前鱼的50%，获得报酬，并增长交易能力。\n\n单位鱼收益:\n"
                disp += format(tmp.p.farmGoldIncome) + " 金子\n"
                disp += format(tmp.p.farmExp) + " 经验"
                return disp
            },
            style() {
                if (!player.r.is_dead) {
                    return {
                        "background-color": "#f39c12"
                    }
                } else {
                    return {
                        "background-color": "#ffffff"
                    }
                }
            },
            onClick() {
                data = player.i
                f = data.fish.mul(0.5)
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
                disp = "处理当前鱼的50%，转化为对应的食物，并增长烹饪能力。\n\n单位鱼收益:\n"
                disp += format(tmp.p.dealFishIncome) + " 食物\n"
                disp += format(tmp.p.dealFishExp) + " 经验"
                return disp
            },
            style() {
                if (!player.r.is_dead) {
                    return {
                        "background-color": "#f39c12"
                    }
                } else {
                    return {
                        "background-color": "#ffffff"
                    }
                }
            },
            onClick() {
                data = player.i
                f = data.fish.mul(0.5)
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
                disp = "花金子购买食物，并增长交易能力。\n\n 单次效益:\n"
                disp += "+ 10 食物\n- " + format(tmp.p.buyFoodCost) +  " 金子\n"
                disp += format(tmp.p.buyFoodExp) + " 经验"
                return disp
            },
            style() {
                if (!player.r.is_dead) {
                    return {
                        "background-color": "#f39c12"
                    }
                } else {
                    return {
                        "background-color": "#ffffff"
                    }
                }
            },
            onClick() {
                data.food = data.food.add(10)
                data.gold = data.gold.sub(tmp.p.buyFoodCost)
                player.e.trading.cur_exp = player.e.trading.cur_exp.add(f.mul(tmp.p.buyFoodExp))
            },
            canClick: () => !player.r.is_dead && player.i.gold.gt(tmp.p.buyFoodCost),
            unlocked: () => hasUpgrade("p", 23),
        }
    },

    infoboxes: {
        lore: {
            title: "故事",
            body() {
                disp = "你来到海边异常平和的小村庄。你对这里有着朦胧的印象，但似乎没有一个人认识你。"

                keys = [11, 12, 13, 14]
                dkeys = ["p11", "p12", "p13", "p14"]
                titles = ["和村长交谈", "和村长交谈 II - 数字学概论", "买酒，和酒客交谈", "给路边的流浪汉一点吃的"]

                for (i = 0; i < keys.length; i++) {       
                    if (tmp.p.buyables[keys[i]].unlocked) {
                        disp += "<p  style='margin-top: 10px'><h2> " + titles[i] + " </h2><p>"
                        for (j = 0; j < full_dialogue[dkeys[i]].length; j++) {
                            if (getBuyableAmount("p", keys[i]).gt(j)) {
                                disp += "<p style='margin-top: 5px'>" + full_dialogue[dkeys[i]][j] + "</p>"
                            }
                        }
                        disp += "<p style='margin-top: 5px'> --------------------------------------</p>"
                    }
                }
                return disp
            }
        }
    },

    tavernIncome() {
        return new Decimal(0.05)
    },

    tavernExp() {
        return new Decimal(10).mul(tmp.e.lvlpEffect)
    },

    farmGoldIncome() {
        return new Decimal(0.05).mul(tmp.e.laboringEffect)
    },

    farmFoodIncome() {
        return new Decimal(0.02).mul(tmp.e.laboringEffect)
    },
    
    farmExp() {
        return new Decimal(10).mul(tmp.e.lvlpEffect)
    },

    sellFishIncome() {
        return new Decimal(0.1).mul(tmp.e.tradingEffect)
    },
    
    sellFishExp() {
        return new Decimal(10).mul(tmp.e.lvlpEffect)
    },

    dealFishIncome() {
        return new Decimal(0.05).mul(tmp.e.cookingEffect)
    },
    
    dealFishExp() {
        return new Decimal(10).mul(tmp.e.lvlpEffect)
    },

    buyFoodCost() {
        return new Decimal(20).div(tmp.e.tradingEffect)
    },
    
    buyFoodExp() {
        return new Decimal(10).mul(tmp.e.lvlpEffect)
    },

    tabFormat: {
        "主界面": {
            content: [
            ["display-text", function() {
                return "在皮亚诺村区域，你目前有<b> " + format(player.p.points) + " </b>投入时间"    
            }, {"font-size": "20px"}],
            
            "blank",
            "prestige-button", "resource-display",
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