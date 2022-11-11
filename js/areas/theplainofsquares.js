addLayer("mp", {
    name: "幂次原野", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: d(0),
        mphorde_unlocked: false
    }},
    canReset() {
        return (!player.r.is_dead && tmp.g.isInited) && (hasUpgrade("r", 12) || hasUpgrade("p", 35))
    },
    color: "#44bd32",
    requires: d(1), // Can be a function that takes requirement increases into account
    resource: "投入时间", // Name of prestige currency
    baseResource: "空余时间", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = d(1)

        mult = mult.mul(layers.i.possibleEffect("ring", "grassring", d(1)))
        if (hasUpgrade("mp", 14)) {
            mult = mult.mul(upgradeEffect("mp", 14))
        }
        if (hasUpgrade("mp", 15)) {
            mult = mult.mul(0.8)
        }
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return d(1)
    },
    tooltip: function() {
        if (hasUpgrade("p", 35) || hasUpgrade("r", 12)) {
            return `投入时间 <br>
            &nbsp; ${formatWhole(player.mp.points)}`
        } else {
            return `需要升级 <br>
            &nbsp; 从皮亚诺村启程`

        }
    },
    
    nodeBgStyle: {
        "clip-path": "polygon(50% 0%, 98% 6%, 86% 44%, 100% 79%, 78% 86%, 66% 100%, 20% 90%, 29% 76%, 7% 27%, 33% 13%)",
    },

    nodeStyle: {
        "--bg-sub-color": "#00cec9",
    },
    
    row: 0, // Row the layer is in on the tree (0 is the first row)
    displayRow: 0,
    hotkeys: [
        {key: "m", description: "m: 将空余时间投入幂次原野区域", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() {
        return hasAchievement("m", 13)
    },

    upgrades: {
        11: {
            title: "猎人的帐篷",
            description: "解锁-与猎人们聊天",
            unlocked: () => getBuyableAmount("mp", 11).gte(2),
            cost: d(20)
        },
        12: {
            title: "狩猎技巧",
            description: () => `你的${skill_dispn["hunting"]}等级加成战斗中获得的经验，目前x${format(tmp.mp.upgrades[12].effect)}`,
            unlocked: () => getBuyableAmount("mp", 21).gte(1),
            cost: d(2000),
            currencyDisplayName: () => res_name["fur"],
            currencyInternalName: "fur",
            currencyLocation: () => player.i,
            effect: () => player.e.hunting.lvl.add(1).log(5)
        },
        13: {
            title: "弓的改良",
            description: () => `永久解锁复合弓`,
            unlocked: () => getBuyableAmount("mp", 21).gte(3),
            cost: d(1500),
            currencyDisplayName: () => res_name["fur"], 
            currencyInternalName: "fur",
            currencyLocation: () => player.i,
            onPurchase: () => {player.mk.compositebow_unlocked = true}
        },
        14: {
            title: "野外生存",
            description: () => `你的生存技能等级也加成幂次原野的投入时间效率，目前x${format(tmp.mp.upgrades[14].effect)}`,
            unlocked: () => getBuyableAmount("mp", 21).gte(5),
            cost: d(3000),
            currencyDisplayName: () => res_name["fur"],
            currencyInternalName: "fur",
            currencyLocation: () => player.i,
            effect: () => tmp.e.lvlpEffect.add(1).log(2)
        },
        15: {
            title: "简化劳作",
            description: () => `你在幂次原野的投入时间获取量-20%, 但损失时间投入挖矿和伐木中，不消耗食物获得自动收益`,
            unlocked: () => getBuyableAmount("mp", 21).gte(7) || hasAchievement("m", 24),
            cost: () => hasAchievement("m", 24) ? d(0) : d(5000),
            currencyDisplayName: () => res_name["fur"],
            currencyInternalName: "fur",
            currencyLocation: () => player.i,
        },
        16: {
            title: "动物农场的传闻",
            description: () => `永久解锁新副本：“农场”`,
            unlocked: () => getBuyableAmount("mp", 21).gte(9),
            cost: d(10000),
            currencyDisplayName: () => res_name["fur"],
            currencyInternalName: "fur",
            currencyLocation: () => player.i,
            onPurchase: () => {player.mp.mphorde_unlocked = true} 
        },
    },

    
    buyables: {
        11: {
            title: "向深处探索",
            cost: (x) => d(1.8).pow(x).mul(20),
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                let ret = `探索等级 ${format(cur_amount, 0)}/10\n\n`
                
                if (cur_amount.lt(10) && cur_amount.gt(0)) {
                    ret += "<p style='color: red'> 注意: 继续探索会将区域数量级x3.6 (不影响副本), 误入深处可能会非常危险！ </p>\n"
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
                return hasUpgrade("p", 35) || hasUpgrade("r", 12)
            },
            purchaseLimit: d(10),
            effect() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                return cur_amount.gte(2) ? d(3.6).pow(cur_amount.sub(1)) : d(1);
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        21: {
            title: "与猎人们聊天",
            cost: (x) => d(1.25).pow(x).mul(20).div(tmp.e.communicationEffect),
            
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                let ret = `进度 ${format(cur_amount, 0)}/10\n\n`
                if (cur_amount.gte(1) && cur_amount.lte(10)) {
                    ret += full_dialogue["mp21"][format(cur_amount, 0)-1] + "\n\n"
                }
                
                ret += `当前效果：解锁新升级 ${this.effect()} 个\n`
                if (cur_amount.lt(10)) {
                    ret += `下一级价格: ${format(this.cost(cur_amount))} 投入时间`
                }
                return ret
            },

            unlocked: () => hasUpgrade("mp", 11),
            purchaseLimit: d(10),
            effect() {
                let cur_amount = getBuyableAmount(this.layer, this.id).min(9)
                return Math.floor((parseInt(format(cur_amount, 0)) + 1) / 2)
            },
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        22: {
            title: "与陌生人交谈",
            cost: (x) => d(1000).mul(x).add(500).div(tmp.e.communicationEffect),
            
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                let ret = `进度 ${format(cur_amount, 0)}/8\n\n`
                if (cur_amount.gte(1) && cur_amount.lte(8)) {
                    ret += full_dialogue["mp22"][format(cur_amount, 0)-1] + "\n\n"
                }

                if (cur_amount.lt(8)) {                
                    ret += `对话完成时: 获得记忆\n`
                    ret += `下一级价格: ${format(this.cost(cur_amount))} 投入时间`
                }
                return ret
            },

            unlocked: () => player.mk.mphorde_reward_unlocked,
            purchaseLimit: d(8),
            effect() {},
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        },
        23: {
            title: "独行",
            cost: (x) => d(400000).mul(x).add(200000).div(tmp.e.communicationEffect),
            
            display() {
                let cur_amount = getBuyableAmount(this.layer, this.id)
                let ret = `进度 ${format(cur_amount, 0)}/6\n\n`
                if (cur_amount.gte(1) && cur_amount.lte(6)) {
                    ret += full_dialogue["mp23"][format(cur_amount, 0)-1] + "\n\n"
                }

                if (cur_amount.lt(6)) {                
                    ret += `完成时: 解锁本层最后的副本\n`
                    ret += `下一级价格: ${format(this.cost(cur_amount))} 投入时间`
                }
                return ret
            },

            unlocked: () => getBuyableAmount("mp", 11).gte(10),
            purchaseLimit: d(6),
            effect() {},
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
                let disp = `使用当前投入时间的50%以及${format(tmp.mp.foodConsumption)}${res_name["food"]}，获得${res_name["wood"]}与${res_name["fiber"]}，并增长劳务能力。\n
                收益:
                ${format(player.mp.points.mul(0.5).mul(tmp.mp.lumberWoodIncome))} ${res_name["wood"]}
                ${format(player.mp.points.mul(0.5).mul(tmp.mp.lumberFiberIncome))} ${res_name["fiber"]}
                ${format(player.mp.points.mul(0.5).mul(tmp.mp.lumberExp))} 经验`
                return disp
            },
            style() {
                return clickable_style(!tmp.mp.clickables[this.id].canClick ? "#bf8f8f" : "#27ae60")
            },
            onClick() {
                let data = player.mp
                let t = data.points.mul(0.5)
                data.points = data.points.sub(t)
                player.i.food = player.i.food.sub(tmp.mp.foodConsumption) 
                player.i.wood = player.i.wood.add(t.mul(tmp.mp.lumberWoodIncome))
                player.i.fiber = player.i.fiber.add(t.mul(tmp.mp.lumberFiberIncome))
                player.e.laboring.cur_exp = player.e.laboring.cur_exp.add(t.mul(tmp.mp.lumberExp))
            },
            canClick() {
                return !player.r.is_dead && player.mp.points.gt(0) && player.i.food.gt(tmp.mp.foodConsumption) && player.i.equips.axe.equipped
            },
            unlocked() {
                return getBuyableAmount(this.layer, 11).gt(0)
            }
        },

        12: {
            "title": "挖矿",
            display() {
                disp = `使用当前投入时间的50%以及${format(tmp.mp.foodConsumption)}${res_name["food"]}，获得${res_name["mineral"]}，并增长劳务能力。\n
                收益:
                ${format(player.mp.points.mul(0.5).mul(tmp.mp.mineIncome))} ${res_name["mineral"]}
                ${format(player.mp.points.mul(0.5).mul(tmp.mp.mineExp))} 经验`
                return disp
            },
            style() {
                return clickable_style(!tmp.mp.clickables[this.id].canClick ? "#bf8f8f" : "#27ae60")
            },
            onClick() {
                let data = player.mp
                let t = data.points.mul(0.5)
                data.points = data.points.sub(t)
                player.i.food = player.i.food.sub(tmp.mp.foodConsumption)
                player.i.mineral = player.i.mineral.add(t.mul(tmp.mp.mineIncome))
                player.e.laboring.cur_exp = player.e.laboring.cur_exp.add(t.mul(tmp.mp.mineExp))
                
            },
            canClick() {
                return !player.r.is_dead && player.mp.points.gt(0) && player.i.food.gt(tmp.mp.foodConsumption) && player.i.equips.pickaxe.equipped
            },
            unlocked() {
                return getBuyableAmount(this.layer, 11).gt(0)
            }
        },

        13: {
            "title": "狩猎",
            display() {
                let disp = `使用当前投入时间的50%以及${format(tmp.mp.foodConsumption)}${res_name["food"]}，有概率发现野兽(掉落皮毛)，并增长索敌能力。\n
                收益:
                ${format(tmp.mp.huntProbability)} 几率发现猎物
                ${format(player.mp.points.mul(0.5).mul(tmp.mp.huntExp))} 经验(成功时x1.5)`
                return disp
            },
            style() {
                return clickable_style(!tmp.mp.clickables[this.id].canClick ? "#bf8f8f" : "#27ae60")
            },
            onClick() {
                let data = player.mp
                let t = data.points.mul(0.5)
                data.points = data.points.sub(t)
                player.i.food = player.i.food.sub(tmp.mp.foodConsumption)

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
                return !player.r.is_dead && player.mp.points.gt(0) && player.i.food.gt(tmp.mp.foodConsumption) && tmp.i.canFight
            },
            unlocked() {
                return getBuyableAmount(this.layer, 11).gt(0)
            }
        },
        

        14: {
            "title": "狩猎 II",
            display() {
                let disp = `使用当前投入时间的50%以及${format(tmp.mp.foodConsumption2)}${res_name["food"]}，有概率发现野兽(掉落骨骼、鳞片)，并增长索敌能力。\n
                收益:
                ${format(tmp.mp.huntProbability2)} 几率发现猎物
                ${format(player.mp.points.mul(0.5).mul(tmp.mp.huntExp2))} 经验(成功时x1.5)`
                return disp
            },
            style() {
                return clickable_style(!tmp.mp.clickables[this.id].canClick ? "#bf8f8f" : "#27ae60")
            },
            onClick() {
                let data = player.mp
                let t = data.points.mul(0.5)
                data.points = data.points.sub(t)
                player.i.food = player.i.food.sub(tmp.mp.foodConsumption2)

                let r = Math.random()
                let exp = t.mul(tmp.mp.huntExp2)

                if (tmp.mp.huntProbability2.gte(r)) {
                    exp = exp.mul(1.5)

                    let {weights, targets} = areas["mphunting2"]
                    target = targets[weighted_choice(weights)]
                    layers["b"].startEncounter(target, buyableEffect(this.layer, 11))
                }

                player.e.hunting.cur_exp = player.e.hunting.cur_exp.add(exp)
            },
            canClick() {
                return !player.r.is_dead && player.mp.points.gt(0) && player.i.food.gt(tmp.mp.foodConsumption2) && tmp.i.canFight
            },
            unlocked() {
                return player.mk.mphorde_reward_unlocked && getBuyableAmount(this.layer, 11).gt(5)
            }
        },

        21: {
            title: () => zones["mpcave"].dispn,
            display() {
                if (!hasAchievement("m", 16)) {
                    return `一个可以探索的区域，但充满了危险。
                        你或许应该先尝试成功狩猎，熟悉一下基本的战斗。`
                }
                let disp = `副本长度: 3
                    关卡数字: 1.2-1.8
                    首通: 解锁重生点升级、新装备以及${player.m.sigil0_unlocked ? "符号0" : "???"}
                    奖励: ${res_name["mineral"]}、${res_name["gold"]}、经验`
                return disp
            },
            style() {
                if (tmp.mp.clickables[this.id].canClick) {
                    return {
                        "background-color": "#44bd32"
                    }
                } else {
                    return {
                        "background-color": "#bf8f8f"
                    }
                }
            },
            onClick() {
                layers["b"].startZone("mpcave", "mp")
            },
            canClick() {
                return !player.r.is_dead && tmp.mp.canReset
                    && tmp.i.canFight && hasAchievement("m", 16)
                    && !player.b.in_battle && !player.b.in_zone
            },
            unlocked() {
                return getBuyableAmount(this.layer, 11).gt(0)
            }
        },

        22: {
            title: () => zones["mphorde"].dispn,
            display() {
                if (!hasAchievement("m", 16)) {
                    return `一个可以探索的区域，但充满了危险。
                        你或许应该先尝试成功狩猎，熟悉一下基本的战斗。`
                }
                let disp = `副本长度: 4
                    关卡数字: 34-50
                    首通奖励: 解锁装备、狩猎区域、新对话
                    奖励: ${res_name["food"]}、${res_name["fur"]}、经验`
                return disp
            },
            style() {
                if (tmp.mp.clickables[this.id].canClick) {
                    return {
                        "background-color": "#44bd32"
                    }
                } else {
                    return {
                        "background-color": "#bf8f8f"
                    }
                }
            },
            onClick() {
                layers["b"].startZone("mphorde", "mp")
            },
            canClick() {
                return !player.r.is_dead && tmp.mp.canReset
                    && tmp.i.canFight && hasAchievement("m", 16)
                    && !player.b.in_battle && !player.b.in_zone
            },
            unlocked() {
                return getBuyableAmount(this.layer, 11).gt(2) && player.mp.mphorde_unlocked
            }
        },

        23: {
            title: () => zones["mpannazone"].dispn,
            display() {
                if (!hasAchievement("m", 16)) {
                    return `一个可以探索的区域，但充满了危险。
                        你或许应该先通过狩猎，熟悉一下基本的战斗。`
                }
                let disp = `副本长度: 1
                    关卡数字: 1400000
                    首通奖励: 解锁地图: 千兆雪山`
                return disp
            },
            style() {
                if (tmp.mp.clickables[this.id].canClick) {
                    return {
                        "background-color": "#44bd32"
                    }
                } else {
                    return {
                        "background-color": "#bf8f8f"
                    }
                }
            },
            onClick() {
                layers["b"].startZone("mpannazone", "mp")
            },
            canClick() {
                return !player.r.is_dead && tmp.mp.canReset
                    && tmp.i.canFight && hasAchievement("m", 16)
                    && !player.b.in_battle && !player.b.in_zone
            },
            unlocked() {
                return getBuyableAmount(this.layer, 23).gte(6)
            }
        },
    },

    infoboxes: {
        lore: {
            title: "故事",
            body() {
                let disp = "<p>一片广阔的平原——还有森林，就像许多老式RPG里新手村外的区域一样。</p><p>遥远的雪山遮蔽了半片天空，在原野上投下广阔的阴影。</p>"
                let area_zones = ["mpcave", "mphorde", "mpannazone"]

                let prog = player.b.max_prog
                for (let z of area_zones) {
                    if (prog[z] > 0) {
                        disp += `<p  style='margin-top: 10px'><h2> ${zone_desc[z].name} </h2><p>`
                        for (let i = 0; i < prog[z]; i++) {
                            disp += `<p style='margin-top: 5px'>${zone_desc[z].prog[i]}</p>`
                        }
                        disp += "<p style='margin-top: 5px'> --------------------------------------</p>"
                    }
                }

                let keys = [21, 22, 23]
                let dkeys = ["mp21", "mp22", "mp23"]
                let titles = ["与猎人们聊天", "与陌生人交谈", "独行"]

                for (let i = 0; i < keys.length; i++) {       
                    if (tmp.mp.buyables[keys[i]].unlocked) {
                        disp += `<p  style='margin-top: 10px'><h2> ${titles[i]} </h2><p>`
                        let amount = getBuyableAmount("mp", keys[i])
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

    lumberWoodIncome() {
        let number_eff = tmp.r.physicalEffect.pow(1.5).mul(player.i.equips.axe.number.pow(1.5))
        return number_eff.mul(tmp.e.laboringEffect).mul(0.1)
    },

    lumberFiberIncome() {
        let number_eff = tmp.r.physicalEffect.pow(1.5).mul(player.i.equips.axe.number.pow(1.5))
        return number_eff.mul(tmp.e.laboringEffect).mul(0.04)
    },

    lumberExp() {
        return d(10).mul(layers.e.survivalSkillExpMult("laboring"))
    },

    mineIncome() {
        let number_eff = tmp.r.physicalEffect.pow(1.5).mul(player.i.equips.pickaxe.number.pow(1.5))
        return number_eff.mul(tmp.e.laboringEffect).mul(0.02)
    },

    mineExp() {
        return d(10).mul(layers.e.survivalSkillExpMult("laboring"))
    },

    huntProbability() {
        let t = player.mp.points.mul(0.5)
        let theta = d(20).div(tmp.e.huntingEffect)
        theta = theta.mul(layers.i.possibleEffect("ring", "bonering", d(1)))
        
        return d(1).sub(t.div(theta).neg().exp())
    },

    huntExp() {
        return d(10).mul(layers.e.survivalSkillExpMult("hunting"))
    },

    huntProbability2() {
        let t = player.mp.points.mul(0.5)

        let theta = d(3000).div(tmp.e.huntingEffect)
        theta = theta.mul(layers.i.possibleEffect("ring", "bonering", d(1)))
        return d(1).sub(t.div(theta).neg().exp())
    },

    huntExp2() {
        return d(50).mul(layers.e.survivalSkillExpMult("hunting"))
    },

    foodConsumption2() {
        return d(100000).mul(tmp.r.consumptionEffect)
    },

    foodConsumption() {
        return d(4).mul(tmp.r.consumptionEffect)
    },

    update(diff) {
        if (hasUpgrade("mp", 15)) {
            let auto_time = tmp.mp.gainMult.mul(0.050).mul(diff).mul(getPointGen())

            player.i.wood = player.i.wood.add(auto_time.mul(tmp.mp.lumberWoodIncome))
            player.i.fiber = player.i.fiber.add(auto_time.mul(tmp.mp.lumberFiberIncome))
            player.i.mineral = player.i.mineral.add(auto_time.mul(tmp.mp.mineIncome))
            
            player.e.laboring.cur_exp = player.e.laboring.cur_exp.add(auto_time.mul(tmp.mp.lumberExp))
            player.e.laboring.cur_exp = player.e.laboring.cur_exp.add(auto_time.mul(tmp.mp.mineExp))
        }

        if (hasAchievement("m", 24) && !hasUpgrade("mp", 15)) {
            buyUpgrade("mp", 15)
        }
    },

    tabFormat: {
        "主界面": {
            content: [
                ["display-text", function() {
                    return `在幂次原野区域，你目前有<b> ${format(player.mp.points)} </b>投入时间`
                }, {"font-size": "20px"}],
                
                "blank",
                "prestige-button",
                "blank",
                "upgrades",
                "blank",
                "clickables",
                "blank",
                ["buyables", [1]],
                "blank",
                ["buyables", [2]],
                "blank",
            ]
        },
        "剧情记录": {
            content: [
                ["infobox", "lore"]
            ]
        }
    },


    branches() {return ['p']},
    
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row || resettingLayer == "r") {
            let keep = ["mphorde_unlocked"]
            layerDataReset(this.layer, keep)
        }
    }
})
