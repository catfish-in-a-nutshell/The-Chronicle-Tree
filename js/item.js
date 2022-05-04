// Items, including variant resources

addLayer("i", {
    name: "物品", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { 
        inv = []
        for (i = 0; i < 64; i++) {
            inv.push({
                exist: false, 
                equiptype: "", 
                number: new Decimal(0), 
                dur: new Decimal(0), 
                name: ""
            })
        }

        return {
            unlocked: true,
            points: new Decimal(0),
            food: new Decimal(0),
            bestfood: new Decimal(0),
            gold: new Decimal(0),
            bestgold: new Decimal(0),
            fish: new Decimal(0),
            bestfish: new Decimal(0),
            wood: new Decimal(0),
            bestwood: new Decimal(0),
            fiber: new Decimal(0),
            bestfiber: new Decimal(0),
            mineral: new Decimal(0),
            bestmineral: new Decimal(0),

            equips: {
                fishingrod: {
                    number: new Decimal(1),
                    equipped: false,
                    name: "",
                    dur: new Decimal(100)
                },
                axe: {
                    number: new Decimal(1),
                    equipped: false,
                    name: "",
                    dur: new Decimal(100)
                },
                pickaxe: {
                    number: new Decimal(1),
                    equipped: false,
                    name: "",
                    dur: new Decimal(100)
                },
                weapon: {
                    number: new Decimal(1),
                    equipped: false,
                    name: "",
                    dur: new Decimal(100)
                },
                shield: {
                    number: new Decimal(1),
                    equipped: false,
                    name: "",
                    dur: new Decimal(100)
                },
                armor: {
                    number: new Decimal(1),
                    equipped: false,
                    name: "",
                    dur: new Decimal(100)
                },
                ring: {
                    number: new Decimal(1),
                    equipped: false,
                    name: "",
                    dur: new Decimal(100)
                }
            },

            inv_slots: 10, // current unlocked inventory slots
            inventory: inv,
            cur_invs: 0 // curently occupied inventory slots
        }
    },
    color: "#2c3e50",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "物品点", // Name of prestige currency
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
    tooltip:() => {
        if (player.i.cur_invs >= player.i.inv_slots) {
            return "物品栏: 背包已满！"
        }
        return "物品栏"
    },
    tooltipLocked:() => "物品栏",
    prestigeNotify: () => false,

    canAddInventory() {
        return player.i.cur_invs < player.i.inv_slots
    },

    addInventory(equip_info) {
        i = 0
        for (; i < player.i.inv_slots; i++) {
            if (!player.i.inventory[i].exist) {
                break
            }
        }
        cur_inv = player.i.inventory[i]

        cur_inv.exist = true
        cur_inv.equiptype = equip_info.equiptype
        cur_inv.name = equip_info.name
        cur_inv.number = equip_info.number
        cur_inv.dur = equip_info.dur

        player.i.cur_invs += 1
    },

    useEquip(type, dur_cost) {
        equip = player.i.equips[type]
        equip.dur = equip.dur.sub(dur_cost)
        if (equip.dur.lte(0)) {
            // Equipment broken!
            equip.equipped = false
        }
    },

    clickables: {
        11: {
            "title": "武器",
            display() {
                inv = player.i.equips.weapon
                if (!inv.equipped) return ""

                disp = inv.name + "<br>"
                disp += "数字: " + format(inv.number) + "<br>"
                disp += "耐久: " + format(inv.dur) + "<br>"

                // TODO: should include additional information, like effects
                return disp
            },
            style() {
                return {
                    "background-color": "#3498db",
                    "border-radius": "0px"
                }
            },
            onClick() {
                i = 0
                for (; i < player.i.inv_slots; i++) {
                    if (!player.i.inventory[i].exist) {
                        break
                    }
                }
                cur_inv = player.i.inventory[i]
                cur_inv.exist = true
                cur_equip = player.i.equips.weapon

                cur_inv.name = cur_equip.name
                cur_inv.number = cur_equip.number
                cur_inv.dur = cur_equip.dur
                cur_inv.equiptype = "weapon"
                
                cur_equip.equipped = false
                player.i.cur_invs += 1
            },
            canClick: () => player.i.equips.weapon.equipped && player.i.cur_invs < player.i.inv_slots
        },
        12: {
            "title": "盾牌",
            display() {
                inv = player.i.equips.shield
                if (!inv.equipped) return ""

                disp = inv.name + "<br>"
                disp += "数字: " + format(inv.number) + "<br>"
                disp += "耐久: " + format(inv.dur) + "<br>"

                // TODO: should include additional information, like effects
                return disp
            },
            style() {
                return {
                    "background-color": "#3498db",
                    "border-radius": "0px"
                }
            },
            onClick() {
                i = 0
                for (; i < player.i.inv_slots; i++) {
                    if (!player.i.inventory[i].exist) {
                        break
                    }
                }
                cur_inv = player.i.inventory[i]
                cur_inv.exist = true
                cur_equip = player.i.equips.shield

                cur_inv.name = cur_equip.name
                cur_inv.number = cur_equip.number
                cur_inv.dur = cur_equip.dur
                cur_inv.equiptype = "shield"

                cur_equip.equipped = false
                player.i.cur_invs += 1
            },
            canClick: () => player.i.equips.shield.equipped
        },
        13: {
            "title": "护甲",
            display() {
                inv = player.i.equips.armor
                if (!inv.equipped) return ""

                disp = inv.name + "<br>"
                disp += "数字: " + format(inv.number) + "<br>"
                disp += "耐久: " + format(inv.dur) + "<br>"

                // TODO: should include additional information, like effects
                return disp
            },
            style() {
                return {
                    "background-color": "#3498db",
                    "border-radius": "0px"
                }
            },
            onClick() {
                i = 0
                for (; i < player.i.inv_slots; i++) {
                    if (!player.i.inventory[i].exist) {
                        break
                    }
                }
                cur_inv = player.i.inventory[i]
                cur_inv.exist = true
                cur_equip = player.i.equips.armor

                cur_inv.name = cur_equip.name
                cur_inv.number = cur_equip.number
                cur_inv.dur = cur_equip.dur
                cur_inv.equiptype = "armor"

                cur_equip.equipped = false
                player.i.cur_invs += 1
            },
            canClick: () => player.i.equips.armor.equipped
        },
        14: {
            "title": "戒指",
            display() {
                inv = player.i.equips.ring
                if (!inv.equipped) return ""

                disp = inv.name + "<br>"
                disp += "数字: " + format(inv.number) + "<br>"
                disp += "耐久: " + format(inv.dur) + "<br>"

                // TODO: should include additional information, like effects
                return disp
            },
            style() {
                return {
                    "background-color": "#3498db",
                    "border-radius": "0px"
                }
            },
            onClick() {
                i = 0
                for (; i < player.i.inv_slots; i++) {
                    if (!player.i.inventory[i].exist) {
                        break
                    }
                }
                cur_inv = player.i.inventory[i]
                cur_inv.exist = true
                cur_equip = player.i.equips.ring

                cur_inv.name = cur_equip.name
                cur_inv.number = cur_equip.number
                cur_inv.dur = cur_equip.dur
                cur_inv.equiptype = "ring"

                cur_equip.equipped = false
                player.i.cur_invs += 1
            },
            canClick: () => player.i.equips.ring.equipped
        },
        21: {
            "title": "渔具",
            display() {
                inv = player.i.equips.fishingrod
                if (!inv.equipped) return ""

                disp = inv.name + "<br>"
                disp += "数字: " + format(inv.number) + "<br>"
                disp += "耐久: " + format(inv.dur) + "<br>"

                // TODO: should include additional information, like effects
                return disp
            },
            style() {
                return {
                    "background-color": "#3498db",
                    "border-radius": "0px"
                }
            },
            onClick() {
                i = 0
                for (; i < player.i.inv_slots; i++) {
                    if (!player.i.inventory[i].exist) {
                        break
                    }
                }
                cur_inv = player.i.inventory[i]
                cur_inv.exist = true
                cur_equip = player.i.equips.fishingrod

                cur_inv.name = cur_equip.name
                cur_inv.number = cur_equip.number
                cur_inv.dur = cur_equip.dur
                cur_inv.equiptype = "fishingrod"

                cur_equip.equipped = false
                player.i.cur_invs += 1
            },
            canClick: () => player.i.equips.fishingrod.equipped
        },
        22: {
            "title": "伐木",
            display() {
                inv = player.i.equips.axe
                if (!inv.equipped) return ""

                disp = inv.name + "<br>"
                disp += "数字: " + format(inv.number) + "<br>"
                disp += "耐久: " + format(inv.dur) + "<br>"

                // TODO: should include additional information, like effects
                return disp
            },
            style() {
                return {
                    "background-color": "#3498db",
                    "border-radius": "0px"
                }
            },
            onClick() {
                i = 0
                for (; i < player.i.inv_slots; i++) {
                    if (!player.i.inventory[i].exist) {
                        break
                    }
                }
                cur_inv = player.i.inventory[i]
                cur_inv.exist = true
                cur_equip = player.i.equips.axe

                cur_inv.name = cur_equip.name
                cur_inv.number = cur_equip.number
                cur_inv.dur = cur_equip.dur
                cur_inv.equiptype = "axe"

                cur_equip.equipped = false
                player.i.cur_invs += 1
            },
            canClick: () => player.i.equips.axe.equipped
        },
        23: {
            "title": "挖矿",
            display() {
                inv = player.i.equips.pickaxe
                if (!inv.equipped) return ""

                disp = inv.name + "<br>"
                disp += "数字: " + format(inv.number) + "<br>"
                disp += "耐久: " + format(inv.dur) + "<br>"

                // TODO: should include additional information, like effects
                return disp
            },
            style() {
                return {
                    "background-color": "#3498db",
                    "border-radius": "0px"
                }
            },
            onClick() {
                i = 0
                for (; i < player.i.inv_slots; i++) {
                    if (!player.i.inventory[i].exist) {
                        break
                    }
                }
                cur_inv = player.i.inventory[i]
                cur_inv.exist = true
                cur_equip = player.i.equips.pickaxe

                cur_inv.name = cur_equip.name
                cur_inv.number = cur_equip.number
                cur_inv.dur = cur_equip.dur
                cur_inv.equiptype = "pickaxe"

                cur_equip.equipped = false
                player.i.cur_invs += 1
            },
            canClick: () => player.i.equips.pickaxe.equipped
        },

    },

    grid: {
        rows: 8,
        cols: 8,
        getStartData(id) {
            return Math.floor(id / 100) * 8 + id % 100 - 9
        },
        getUnlocked(id) { 
            return (player.i.inv_slots > getGridData(this.layer, id))
        },
        getCanClick(data, id) {
            return player.i.inventory[data].exist
        },
        getStyle(data, id) {
            return {
                "background-color": "#576574",
                "border-radius": "1px"
            }
        },
        onClick(data, id) {
            inv = player.i.inventory[data]
            typ = inv.equiptype
            if (player.i.equips[typ].equipped) {    
                // change
                cur = player.i.equips[typ]
                t = cur.number; cur.number = inv.number; inv.number = t;
                t = cur.dur; cur.dur = inv.dur; inv.dur = t;
                t = cur.name; cur.name = inv.name; inv.name = t;

            } else {
                // equip
                player.i.equips[typ].equipped = true
                player.i.equips[typ].number = inv.number
                player.i.equips[typ].dur = inv.dur
                player.i.equips[typ].name = inv.name
                inv.exist = false

                player.i.cur_invs -= 1
            }
        },
        getTitle(data, id) {
            return player.i.inventory[data].exist ? player.i.inventory[data].name : "空"
        },
        getDisplay(data, id) {
            if (player.i.inventory[data].exist) {
                inv = player.i.inventory[data]
                return "数字<br>" + format(inv.number) + "<br>耐久<br>" + format(inv.dur, 0)
            } else {
                return ""
            }
        },
    },

    shouldNotify: () => {
        return player.i.cur_invs >= player.i.inv_slots
    },

    tabFormat: [
        ["display-text",
        function() {
            d = player.i
            disp = ""
            disp += "<p>你目前拥有</p><p>——————————————————————————</p>"
            
            disp += "<p><b>" + format(d.gold) + "</b> 金子</p>"

            if (d.bestfood.gt(0)) {
                disp += "<p><b>" + format(d.food) + "</b> 食物</p>"
            }
            if (d.bestfish.gt(0)) {
                disp += "<p><b>" + format(d.fish) + "</b> 鱼</p>"
            }
            if (d.bestwood.gt(0)) {
                disp += "<p><b>" + format(d.wood) + "</b> 木材</p>"
            }
            if (d.bestfiber.gt(0)) {
                disp += "<p><b>" + format(d.fiber) + "</b> 纤维</p>"
            }
            if (d.bestmineral.gt(0)) {
                disp += "<p><b>" + format(d.mineral) + "</b> 矿物</p>"
            }

            return disp
        },
        {"font-size": "20px"}],
        "blank",
        "h-line",
        "blank",
        ["display-text", "装备栏"],
        "blank",
        ["clickables", [1]],
        "blank",
        ["clickables", [2]],
        "blank",
        "h-line",
        "blank",
        "grid"
    ],

    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row || resettingLayer == "r") {
            keep = ["inv_slots"]
            layerDataReset(this.layer, keep)
        }
    },

    
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() {
        i = player.i
        return i.bestfish.gt(0) || i.bestfood.gt(0) || i.bestgold.gt(0)
    },

    update(diff) {
        d = player.i
        d.bestfish = d.bestfish.max(d.fish)
        d.bestgold = d.bestgold.max(d.gold)
        d.bestfood = d.bestfood.max(d.food)
        d.bestwood = d.bestwood.max(d.wood)
        d.bestfiber = d.bestfiber.max(d.fiber)
        d.bestmineral = d.bestmineral.max(d.mineral)
    }
})