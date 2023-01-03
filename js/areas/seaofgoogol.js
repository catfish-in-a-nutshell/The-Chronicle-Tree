addLayer("g", {
    name: "古戈尔之海", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "~", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: d(0),
        inited: false,
        air_cur: d(100),
        air_cur_progress: d(0),
        depth_cur: d(10),
        depth_best: d(10),
        diving_up: false,
        diving_down: false,
        tot_time: d(0),
        last_fish: d(-1),
        last_fish_exp: d(0),
        current_max_depth: d(0),
        fishing_unlocked: false
    }},
    nodeBgStyle: {
        "clip-path": "polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 23% 89%, 7% 62%, 50% 42%, 23% 13%)",
    },

    nodeStyle: {
        "--bg-sub-color": "#74b9ff"
    },
    canReset() {
        return (!player.r.is_dead)
    },
    color: "#3498db",
    requires: d(1), // Can be a function that takes requirement increases into account
    resource: "投入时间", // Name of prestige currency
    baseResource: "空余时间", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = d(1)
        if (hasUpgrade("g", 11))
            mult = mult.mul(upgradeEffect("g", 11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return d(1)
    },
    tooltip: () => `投入时间 <br>
        &nbsp; ${formatWhole(player.g.points)}`,
    tooltipLocked: () => "古戈尔之海",
    // upgrades: {
    //     11: {
    //         title: "",
    //         description: "",
    //     }
    // },
    bars: {
        airBar: {
            direction: RIGHT,
            width: 300,
            height: 50,
            fillStyle: {'background-color' : "#3498db"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle() {return {}},
            progress: () => player.g.depth_cur.gt(0) ? player.g.air_cur_progress : d(1),
            display() { return player.g.depth_cur.gt(0) ? `剩余氧气: ${format(player.g.air_cur)}/${format(tmp.g.maxAir)}` : ""},
            unlocked: true
        }
    },

    clickables: {
        11: {
            "title": () => player.g.depth_cur.gt(0) ? "向上游" : "已上岸",
            display() {
                return `你距离水面还有 ${format(player.g.depth_cur)} 米`
            },
            style() {
                return {"background-color": player.g.diving_up ? "#3498db" : "#ffffff"}
            },
            onClick() {
                player.g.diving_up = true
                player.g.diving_down = false
            },
            canClick: () => !player.r.is_dead && (!player.g.diving_up && player.g.depth_cur.gt(0))
        },

        12: {
            title: () => player.g.depth_cur.gt(0) ? "潜水中" : "开始潜水",
            display() {
                if (player.g.diving_down) {
                    return `你距离水面还有 ${format(player.g.depth_cur)} 米`
                }
                return ""
            },
            style() {
                return {"background-color": player.g.diving_down ? "#3498db" : "#ffffff"}
            },
            onClick() {
                player.g.air_cur = tmp.g.maxAir
                player.g.diving_down = true
                player.g.diving_up = false
            },
            canClick: () => !player.r.is_dead && player.g.depth_cur.lte(0) && player.g.points.gt(0),
            unlocked: () => hasUpgrade("r", "14")
        },

        13: { 
            "title": "钓鱼",
            display() {
                return "（别忘了先装备鱼竿）"
            },
            style: {
                "background-color": "#ffffff"
            },
            onClick() {
                let data = player.g
                let t = data.points
                
                let harv = d(0.5).mul(t)
                
                harv = harv.mul(player.i.equips.fishingrod.number.cube().mul(tmp.r.physicalEffect.cube()).sqrt())
                let fishing_exp = harv.mul(20).mul(layers.e.survivalSkillExpMult("fishing"))

                if (hasMilestone("l", 0)) {
                    fishing_exp = fishing_exp.div(tmp.l.expDivider)
                }

                harv = harv.mul(tmp.e.fishingEffect)
                if (hasUpgrade("g", 12)) {
                    harv = harv.mul(upgradeEffect("g", 12))
                }
                if (hasUpgrade("g", 13)) {
                    harv = harv.mul(upgradeEffect("g", 13))
                }

                let harv_exp = harv.log10()
                harv = d(10).pow(harv_exp.add(Math.random() - 0.6))
                
                player.i.fish = player.i.fish.add(harv)
                data.last_fish = harv
                data.points = d(0)
                data.last_fish_exp = fishing_exp
                player.e.fishing.cur_exp = player.e.fishing.cur_exp.add(fishing_exp)
            },
            canClick: () => !player.r.is_dead && player.g.depth_cur.lte(0) && player.g.points.gt(0) && player.i.equips.fishingrod.equipped,
            unlocked: () => player.g.fishing_unlocked
        }
    },

    upgrades: {
        11: {
            title: "熟悉水性",
            description: "本地投入时间转化效率x2.5",
            effect: () => d(2.5),
            cost: d(10),
            currencyDisplayName: () => res_name["fish"],
            currencyInternalName: "fish",
            currencyLocation: () => player.i,
            unlocked: () => player.i.bestfish.gt(0)
        },
        12: {
            title: "钓鱼技术",
            description: `鱼 x 2.5<br>
                对，就是鱼x2.5`,
            effect: () => d(2.5),
            cost: d(50),
            currencyDisplayName: () => res_name["fish"],
            currencyInternalName: "fish",
            currencyLocation: () => player.i,
            unlocked: () => player.i.bestfish.gt(0)
        },
        13: {
            title: "钓鱼技术",
            description: `鱼 再x 2.5<br>
                对，就是 鱼 再x2.5`,
            effect: () => d(2.5),
            cost: d(1000),
            currencyDisplayName: () => res_name["fish"],
            currencyInternalName: "fish",
            currencyLocation: () => player.i,
            unlocked: () => player.i.bestfish.gt(0)
        },
    },

    infoboxes: {
        lore: {
            title: "故事",
            body() {
                let s = "<p>你被喉咙中灌入的海水呛醒。你想要呼吸，但幸运的是生存的本能阻止了你。你正身处水面之下，上方不远处有着微弱的光。海水仿佛要将你的胸腔压碎，没有时间犹豫了，你必须离开。</p>"

                if (hasAchievement("m", 12)) {
                    s += "<p style='margin-top: 5px'>幸好你离水面不算远。你开始思考接下来该去什么地方。</p>"
                }

                if (tmp.r.number.gte(10)) {
                    s += "<p style='margin-top: 5px'> 在数字成长之后，原本重生在水下的你，尺寸已经高出了水面。你已不再需要多游这一段路。 </p>"
                }
                return s
            }
        }
    },
    tabFormat: [["display-text", function() {
            return `在古戈尔之海区域，你目前有<b> ${format(player.g.points)} </b>投入时间`
        }, {"font-size": "20px"}],
        "blank",
        "prestige-button",
        "blank",
        ["infobox", "lore"],
        "blank",
        "upgrades",
        "blank",
        ["bar", "airBar"],
        "blank",
        "clickables",
        "blank",
        ["display-text", function() {
            let disp = ""
            if (tmp.g.divingReward) {
                disp += "潜水收获: "
                for (let res in tmp.g.divingReward) {
                    if (tmp.g.divingReward[res].gt(0))
                        disp += `${format(tmp.g.divingReward[res])} ${res_name[res]} `
                }
            }
            return disp
        }],
        "blank",
        ["display-text", function() {
            let disp = ""
            if (player.g.last_fish.gt(0)) {
                disp += `<p>你上一次钓鱼获得了 ${format(player.g.last_fish)} ${res_name["fish"]}, ${format(player.g.last_fish_exp)} 经验</p>`
            }
            return disp
        }],
        "blank"
    ],

    row: 0, // Row the layer is in on the tree (0 is the first row)
    displayRow: 0,
    hotkeys: [
        {key: "g", description: "g: 将空余时间投入古戈尔之海区域", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer) {
        // console.log("g:receiving " + resettingLayer)
        if (layers[resettingLayer].row > this.row || resettingLayer == "r") {
            let keep = ["depth_best", "fishing_unlocked"]
            layerDataReset(this.layer, keep)
            player.g.air_cur = d(100)
        }
    },
    layerShown() {return true},
    maxAir() {
        return d(100)
    },

    isInited() {
        return player.g.inited
    },

    divingReward() {
        if (player.g.current_max_depth.lt(1000)) return
        let rewards = {gold:d(0), wood:d(0), fiber:d(0), mineral:d(0)}

        if (player.g.current_max_depth.gte(1000)) {
            rewards.gold = player.g.current_max_depth.div(1000).pow(2.2).mul(10)
            rewards.wood = player.g.current_max_depth.div(1000).pow(2).mul(40)
            rewards.fiber = player.g.current_max_depth.div(1000).pow(2).mul(20)
            rewards.mineral = player.g.current_max_depth.div(1000).pow(2).mul(20)
        }
        return rewards
    },

    update(diff) {

        if (player.r.is_dead) return;

        let data = player.g

        if (tmp.r.number.gte(10) && !data.inited) {
            data.inited = true
            data.depth_cur = d(0)
        }

        // console.log(format(data.tot_time))

        let time_consume_rate = d(1)
        let air_consume_rate = d(10)

        let swim_speed = d(0.8).mul(tmp.r.physicalEffect)
        swim_speed = swim_speed.mul(tmp.e.swimmingEffect)
        let air_max = tmp.g.maxAir
        
        let exp_gain = d(10).mul(layers.e.survivalSkillExpMult("swimming")).div(tmp.r.physicalEffect)
        if (data.diving_up) {
            let tick_swim_time = d(diff)
            tick_swim_time = tick_swim_time.min(data.air_cur.div(air_consume_rate))
            tick_swim_time = tick_swim_time.min(data.depth_cur.div(swim_speed))
            tick_swim_time = tick_swim_time.min(data.points)

            data.depth_cur = data.depth_cur.sub(swim_speed.mul(tick_swim_time))
            data.air_cur = data.air_cur.sub(air_consume_rate.mul(tick_swim_time))
            data.air_cur_progress = data.air_cur.div(air_max)
            data.points = data.points.sub(tick_swim_time)

            player.e.swimming.cur_exp = player.e.swimming.cur_exp.add(swim_speed.mul(tick_swim_time).mul(exp_gain))

            if (data.depth_cur.lte(0)) {
                // Back to surface
                data.inited = true
                data.diving_up = false
                // data.air_cur_progress = d(1)

                
                let reward = tmp.g.divingReward
                for (let res in reward) {
                    player.i[res] = player.i[res].add(reward[res])
                }

                data.depth_cur = d(0)
                data.current_max_depth = d(0)
                return
            }

            if (data.points.lte(0)) {
                // Time up
                data.diving_up = false
            }

            if (data.air_cur.lte(0)) {
                // You died
                data.diving_up = false
                layers["r"].youDied("你溺死了。")
                return
            }


        } else if (data.diving_down) {
            let tick_swim_time = d(diff)
            tick_swim_time = tick_swim_time.min(data.air_cur.div(air_consume_rate))
            tick_swim_time = tick_swim_time.min(data.points)

            data.depth_cur = data.depth_cur.add(swim_speed.mul(tick_swim_time))
            data.air_cur = data.air_cur.sub(air_consume_rate.mul(tick_swim_time))
            data.air_cur_progress = data.air_cur.div(air_max)
            data.points = data.points.sub(tick_swim_time)
            
            player.e.swimming.cur_exp = player.e.swimming.cur_exp.add(swim_speed.mul(tick_swim_time).mul(exp_gain))

            if (data.air_cur.lte(0)) {
                // You died
                data.diving_up = false
                layers["r"].youDied("你溺死了。")
                return
            }

            data.current_max_depth = data.current_max_depth.max(data.depth_cur)
        }
    },

    working() {
        return player.g.depth_cur.gt(0)
    }

})
