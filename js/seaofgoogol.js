addLayer("g", {
    name: "古戈尔之海", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "~", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: decimalZero,
        inited: false,
        air_cur: new Decimal(100),
        air_cur_progress: decimalZero,
        depth_cur: new Decimal(10),
        depth_best: new Decimal(10),
        diving_up: false,
        diving_down: false,
        tot_time: decimalZero,
        last_fish: new Decimal(-1)
    }},
    canReset() {
        return (!player.r.is_dead)
    },
    color: "#3498db",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "投入时间", // Name of prestige currency
    baseResource: "空余时间", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade("g", 11))
            mult = mult.mul(upgradeEffect("g", 11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    tooltip: () => "古戈尔之海: " + format(player.g.points) + " 投入时间",
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
            progress: () => player.g.depth_cur.gt(0) ? player.g.air_cur_progress : new Decimal(1),
            display() { return player.g.depth_cur.gt(0) ? `剩余氧气: ${format(player.g.air_cur)}/${format(tmp.g.maxAir)}` : ""},
            unlocked: true
        }
    },

    clickables: {
        11: {
            "title": "向上游",
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
            "title": "开始潜水",
            display() {
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
            canClick: () => !player.r.is_dead && player.g.depth_cur.lte(0) && player.r.points.gt(0),
            unlocked: () => hasUpgrade("p", 23)
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
                
                let harv = new Decimal(0.5).mul(t).mul(player.i.equips.fishingrod.number)
                let fishing_exp = harv.mul(20).mul(tmp.e.lvlpEffect)

                harv = harv.mul(tmp.e.fishingEffect)
                let harv_exp = harv.log10()
                harv = new Decimal(10).pow(harv_exp.add(Math.random() - 0.8))
                
                player.i.fish = player.i.fish.add(harv)
                data.last_fish = harv
                data.points = decimalZero

                player.e.fishing.cur_exp = player.e.fishing.cur_exp.add(fishing_exp)
            },
            canClick: () => !player.r.is_dead && player.g.depth_cur.lte(0) && player.g.points.gt(0) && player.i.equips.fishingrod.equipped,
            unlocked: () => hasUpgrade("p", 31)
        }
    },

    upgrades: {
        11: {
            title: "熟悉水性",
            description: "本地投入时间转化效率x2.5",
            effect: () => new Decimal(2.5),
            cost: new Decimal(10),
            currencyDisplayName: () => res_name["fish"],
            currencyInternalName: "fish",
            currencyLocation: () => player.i
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
            if (player.g.last_fish.gt(0)) {
                disp += `<p>你上一次钓鱼获得了 ${format(player.g.last_fish)} ${res_name["fish"]}</p>`
            }
            return disp
        }]
    ],

    row: 0, // Row the layer is in on the tree (0 is the first row)
    displayRow: 0,
    hotkeys: [
        {key: "g", description: "g: 将空余时间投入古戈尔之海区域", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer) {
        // console.log("g:receiving " + resettingLayer)
        if (layers[resettingLayer].row > this.row || resettingLayer == "r") {
            let keep = ["depth_best"]
            layerDataReset(this.layer, keep)
            player.g.air_cur = new Decimal(100)
        }
    },
    layerShown() {return true},
    maxAir() {
        return new Decimal(100)
    },

    isInited() {
        return player.g.inited
    },

    update(diff) {

        if (player.r.is_dead) return;

        let data = player.g

        // console.log(format(data.tot_time))

        let time_consume_rate = new Decimal(1)
        let air_consume_rate = new Decimal(10)

        let swim_speed = new Decimal(0.8)
        swim_speed = swim_speed.mul(tmp.e.swimmingEffect)
        let air_max = tmp.g.maxAir
        
        let exp_gain = new Decimal(10).mul(tmp.e.lvlpEffect)
        if (data.diving_up) {
            let tick_swim_time = new Decimal(diff)
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
                data.depth_cur = decimalZero
                // data.air_cur_progress = new Decimal(1)

                // TODO: should add loots to item!
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
            let tick_swim_time = new Decimal(diff)
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

            // TODO: should discover loots!
        }
    },

    working() {
        return player.g.depth_cur.gt(0)
    }

})
