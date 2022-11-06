// Memory, a.k.a Milestones


addLayer("m", {
    name: "记忆", // This is optional, only used in a few places, If absent it just uses the layer id.
    disp_symbol: "记忆",
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
        points: d(0),
        milestone_cnt: d(0),
        sigil0_unlocked: false,
    }},
    color: "#8e44ad",
    subcolor: "#a29bfe",
    requires: d(1), // Can be a function that takes requirement increases into account
    resource: "记忆点", // Name of prestige currency
    baseResource: "placeholder", // Name of resource prestige is based on
    baseAmount() {return d(1)}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = d(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return d(1)
    },
    tooltip:() => "记忆",
    tooltipLocked:() => "记忆",
    prestigeNotify: () => false,
    
    achievements: {
        11: {
            name: "重生的记忆",
            done(){return player.r.deaths.gte(1)},
            onComplete() {player.m.milestone_cnt = player.m.milestone_cnt.add(1)},
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "你回想起自己并非第一次重生。然而你也回想起，正常的重生并不会让你失去记忆。"
                } else {
                    return "未解锁"
                }
            }
        },
        12: {
            name: "陆地的记忆",
            done() {return player.g.depth_cur.lte(0)},
            onComplete() {player.m.milestone_cnt = player.m.milestone_cnt.add(1)},
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "站在陌生但莫名熟悉的陆地上，你回想起附近村庄的位置。解锁地点：皮亚诺村"
                } else {
                    return "未解锁"
                }
            }
        },
        13: {
            name: "冒险的记忆",
            unlocked: () => hasAchievement("m", 12), 
            onComplete() {player.m.milestone_cnt = player.m.milestone_cnt.add(1)},
            done: () => hasUpgrade("p", 12),
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "在与村民交流之后，你回想起通向村外的道路。解锁升级：从皮亚诺村启程"
                } else {
                    return "未解锁"
                }
            }
        },
        14: {
            name: "数字的记忆",
            unlocked: () => hasAchievement("m", 12), 
            onComplete() {player.m.milestone_cnt = player.m.milestone_cnt.add(1)},
            done: () => getBuyableAmount("p", 12).gte(14),
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "你回想起数字/数量级相关的知识。解锁子页面：重生-数字"
                } else {
                    return "完成与村长的对话以解锁"
                }
            }
        },

        15: {
            name: "怠惰的记忆",
            unlocked: () => hasAchievement("m", 12), 
            onComplete() {player.m.milestone_cnt = player.m.milestone_cnt.add(1)},
            done: () => getBuyableAmount("p", 14).gte(8),
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "在见识了一个流浪汉的生活之后，你意识到偷懒有时也是一门艺术。解锁页面：怠惰"
                } else {
                    return "未解锁"
                }
            }
        },

        16: {
            name: "战斗的记忆",
            unlocked: () => player.b.battle_unlocked || hasUpgrade("p", 34),
            onComplete() {
                player.m.milestone_cnt = player.m.milestone_cnt.add(1)
                player.b.battle_unlocked = true
            },
            done: () => player.b.in_battle,
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "你回想起自己曾经很擅长战斗，但现在的身体并不适应。解锁子页面：经验-战斗"
                } else {
                    return "未解锁"
                }
            }
        },

        21: {
            name: "村庄的记忆",
            unlocked: () => hasAchievement("m", 16),
            onComplete() {player.m.milestone_cnt = player.m.milestone_cnt.add(1)},
            done: () => tmp.p.layerFinished,
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "你已经了解了皮亚诺村的一切——如果之后再回到这里，你的一切都会更有效率。皮亚诺村投入时间x2"
                } else {
                    return "购买皮亚诺村的全部内容以解锁"
                }
            }
        },

        22: {
            name: "椭圆形符号的记忆",
            unlocked: () => hasAchievement("m", 16),
            onComplete() {player.m.milestone_cnt = player.m.milestone_cnt.add(1)},
            done: () => player.m.sigil0_unlocked,
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "在你的掌心，镶嵌着一枚椭圆形的角质鳞片，你感受到其中寄宿着非凡而古老的力量。解锁：重生-数字-符号0"
                } else {
                    return "未解锁"
                }
            }
        },

        23: {
            name: "农场的记忆",
            unlocked: () => hasUpgrade("mp", 16) || hasAchievement("m", 23),
            onComplete() {player.m.milestone_cnt = player.m.milestone_cnt.add(1)},
            done: () => getBuyableAmount("mp", 22).gte(8),
            tooltip() {
                if (hasAchievement("m", this.id)) {
                    return "农场的陌生人解放了你手中符号的力量——现在，你可以通过献上材料，增强它的力量。解锁：重生-数字-喂食(TODO)"
                } else {
                    return "未解锁"
                }
            }
        }
    },


    infoboxes: {
        desc: {
            title: "关于记忆",
            body() { return "随着旅途进行，失去的记忆或许会被逐渐取回——又或许可以获得新的记忆。记忆将会永久保存，即使死亡重生也不例外。" }
        }
    },

    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() {
        return player.r.deaths.gte(1)
    },
    unlocked() {
        return player.r.deaths.gte(1)
    },

    tabFormat: [["display-text", function() {
           return `你拥有 <span style='color:#8e44ad; font-size:25px'>${format(player.m.milestone_cnt, 0)}</span> 记忆`  
        }, {"font-size": "20px"}],
        "blank",
        ["infobox", "desc"],
        "blank",
        "achievements"],

    update(diff) {
        
    }
})