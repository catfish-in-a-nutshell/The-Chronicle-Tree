// Items, including variant resources, equipments

var res_name = {
    "gold": "金子",
    "food": "食物",
    "fish": "鱼",
    "wood": "木材",
    "fiber": "纤维",
    "mineral": "矿物",
    "fur": "皮毛",
    "bones": "骨骼",
    "scale": "鳞片"
}

var res_color = {
    "gold":    ["#636e72", "#2d3436"],
    "food":    ["#636e72", "#2d3436"],
    "fish":    ["#3498db", "#74b9ff"],
    "wood":    ["#44bd32", "#00cec9"],
    "fiber":   ["#44bd32", "#00cec9"],
    "mineral": ["#44bd32", "#00cec9"],
    "fur":     ["#44bd32", "#00cec9"],
    "bones":   ["#44bd32", "#00cec9"],
    "scale":   ["#44bd32", "#00cec9"],
}

var layer_res = {
    "g": ["fish"],
    "p": ["gold", "food", "fish"],
    "mp": ["food", "wood", "fiber", "mineral", "fur", "bones", "scale"]
}

var res_list = [
    "gold", "food", "fish", "wood", "fiber", "mineral", "fur", "bones", "scale"
]

let inventory_buyable_style = {
    "width": "200px",
    "height": "120px",
    "margin-top": "10px",
    "border-radius": "0px",
    "border": "1px",
    "border-color": "rgba(0, 0, 0, 0.125)"
}

let equip_item_style = {
    "background-color": "#3498db",
    "border-radius": "0px"
}

var equip_type_list = ["fishingrod", "axe", "pickaxe", "weapon", "shield", "armor", "ring"]

addLayer("i", {
    name: "物品", // This is optional, only used in a few places, If absent it just uses the layer id.
    disp_symbol: "物品",
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { 
        let inv = []
        for (let i = 0; i < 64; i++) {
            inv.push({
                exist: false, 
                equiptype: "", 
                number: d(0), 
                name: ""
            })
        }

        let start_data = {
            unlocked: true,
            points: d(0),
            inv_slots: 10, // current unlocked inventory slots
            inventory: inv,
            cur_invs: 0, // curently occupied inventory slots
            discard_selected: false,
            forge_selected: false,
            selected_inv_ind: -1,
            forge_unlocked: false,
            making_unlocked: false
        }

        for (let i in res_list) {
            let res_n = res_list[i]
            start_data[res_n] = d(0)
            start_data["best"+res_n] = d(0)
        }

        let equips = {}
        for (let i in equip_type_list) {
            let etype = equip_type_list[i]
            equips[etype] = {
                number: d(1),
                equipped: false,
                name: "",
            }
        }

        start_data["equips"] = equips
        return start_data
    },
    color: "#2c3e50",
    subcolor: "#b2bec3",
    requires: d(1), // Can be a function that takes requirement increases into account
    resource: "物品点", // Name of prestige currency
    baseResource: "重生分数", // Name of resource prestige is based on
    baseAmount() {return player.r.score}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = d(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return d(1)
    },
    resList: () => {
        let l = []
        let cur_res_list = (player.tab == 'none' || options.showAllRes) ? res_list : layer_res[player.tab]
        
        for (let res_n in cur_res_list) {
            let n = cur_res_list[res_n]
            if (player.i["best"+n].gt(0)) {
                l.push({ name:n, color:res_color[n] })
            }
        }
        return l
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
        let i = 0
        for (; i < player.i.inv_slots; i++) {
            if (!player.i.inventory[i].exist) {
                break
            }
        }
        let cur_inv = player.i.inventory[i]

        cur_inv.exist = true
        cur_inv.equiptype = equip_info.equiptype
        cur_inv.name = equip_info.name
        cur_inv.number = equip_info.number

        player.i.cur_invs += 1
    },

    discardInventory(id) {
        if (!player.i.inventory[id].exist) return

        player.i.inventory[id].exist = false
        player.i.cur_invs -= 1
    },

    removeEquip(type) {
        let i = 0
        for (; i < player.i.inv_slots; i++) {
            if (!player.i.inventory[i].exist) {
                break
            }
        }
        let cur_inv = player.i.inventory[i]
        cur_inv.exist = true
        let cur_equip = player.i.equips[type]

        cur_inv.name = cur_equip.name
        cur_inv.number = cur_equip.number
        cur_inv.equiptype = type
        
        cur_equip.equipped = false
        player.i.cur_invs += 1
    },

    
    selectedInvDisplay() {
        let ind = player.i.selected_inv_ind
        if (ind < 0) return undefined

        let equip = player.i.inventory[ind]
        let dispn = full_equips[equip.name].dispn
        return ` ${dispn}, 数字${format(equip.number)}`
    },

    selectedForgeCosts() {

        let ind = player.i.selected_inv_ind
        if (ind < 0) return undefined
        
        let equip = player.i.inventory[ind]
        if (!equip) return undefined

        let costs = full_equips[equip.name].cost

        let min_div = undefined

        for (let res_n in costs) {
            let res_div = player.i[res_n].div(costs[res_n])
            if (!min_div || res_div.lt(min_div)) {
                min_div = res_div
            }
        }
        min_div = min_div

        let forge_limit = tmp.r.number.mul(20).cube().sub(equip.number.cube()).max(0)
        min_div = min_div.min(forge_limit)

        let ret_costs = {div: min_div}
        
        for (let res_n in costs) {
            ret_costs[res_n] = min_div.mul(costs[res_n])
        }
        return ret_costs
    },

    forgeCostDisplay() {
        let costs = tmp.i.selectedForgeCosts
        if (!costs) return undefined
        let disp = ""
        for (let res_n in costs) {
            if (res_n == "div") continue
            disp += `
            ${format(costs[res_n])} ${res_name[res_n]}`
        }
        return disp
    },

    forgeExpectation() {
        let costs = tmp.i.selectedForgeCosts
        if (!costs) return undefined

        let ind = player.i.selected_inv_ind
        let cur_num = player.i.inventory[ind].number

        let new_num = cur_num.cube().add(costs.div).cbrt()
        

        return `${format(new_num)}`
    },

    forgeEquipment() {
        let costs = tmp.i.selectedForgeCosts
        if (!costs) return undefined
        
        let ind = player.i.selected_inv_ind
        let cur_num = player.i.inventory[ind].number

        let new_num = cur_num.cube().add(costs.div).cbrt()
        player.i.inventory[ind].number = new_num

        for (let res_n in costs) {
            if (res_n == "div") continue
            player.i[res_n] = player.i[res_n].sub(costs[res_n])
        }
    },

    applyEquipmentBuffs() {
        const elist = ["weapon", "armor", "shield", "ring"]
        for (let e of elist) {
            if (player.i.equips[e].equipped) {
                let name = player.i.equips[e].name
                if (full_equips[name].applyEffect) {
                    full_equips[name].applyEffect(player.i.equips[e].number)
                }
            }
        }
    },

    possibleEffect(etype, ename, default_eff) {
        if (player.i.equips[etype].equipped && player.i.equips[etype].name == ename) {
            return full_equips[ename].effect(player.i.equips[etype].number)
        }
        return default_eff
    },


    equipDisplay(etype) {
        let inv = player.i.equips[etype]
        if (!inv.equipped) return ""

        let disp = full_equips[inv.name].dispn + "<br>"
        disp += `数字: ${format(inv.number)}<br>`

        if (full_equips[inv.name].desc) {
            disp += full_equips[inv.name].desc(inv.number.cube().mul(tmp.r.physicalEffect.cube()).sqrt(), inv.number)
        }

        return disp
    },

    canFight() {
        return (player.i.equips.weapon.equipped || hasUpgrade("r", 12))
    },

    clickables: {
        11: {
            title: "武器",
            display: () => layers.i.equipDisplay("weapon"),
            style: equip_item_style,
            onClick() {layers["i"].removeEquip("weapon")},
            canClick: () => player.i.equips.weapon.equipped && tmp.i.canAddInventory
        },
        12: {
            title: "盾牌",
            display: () => layers.i.equipDisplay("shield"),
            style: equip_item_style,
            onClick() {layers["i"].removeEquip("shield")},
            canClick: () => player.i.equips.shield.equipped && tmp.i.canAddInventory
        },
        13: {
            title: "护甲",
            display: () => layers.i.equipDisplay("armor"),
            style: equip_item_style,
            onClick() {layers["i"].removeEquip("armor")},
            canClick: () => player.i.equips.armor.equipped && tmp.i.canAddInventory
        },
        14: {
            title: "戒指",
            display: () => layers.i.equipDisplay("ring"),
            style: equip_item_style,
            onClick() {layers["i"].removeEquip("ring")},
            canClick: () => player.i.equips.ring.equipped && tmp.i.canAddInventory
        },
        21: {
            title: "渔具",
            display: () => layers.i.equipDisplay("fishingrod"),
            style: equip_item_style,
            onClick() {layers["i"].removeEquip("fishingrod")},
            canClick: () => player.i.equips.fishingrod.equipped && tmp.i.canAddInventory
        },
        22: {
            title: "伐木",
            display: () => layers.i.equipDisplay("axe"),
            style: equip_item_style,
            onClick() {layers["i"].removeEquip("axe")},
            canClick: () => player.i.equips.axe.equipped && tmp.i.canAddInventory
        },
        23: {
            title: "挖矿",
            display: () => layers.i.equipDisplay("pickaxe"),
            style: equip_item_style,
            onClick() {layers["i"].removeEquip("pickaxe")},
            canClick: () => player.i.equips.pickaxe.equipped && tmp.i.canAddInventory
        },

        31: {
            title: "丢弃",
            display() {
                if (player.i.cur_invs * 2 <= player.i.inv_slots) {
                    return `背包还很空，无需这个功能`
                }
                if (player.i.discard_selected) {
                    if (player.i.selected_inv_ind >= 0) {
                        let selected_inv_desc = tmp.i.selectedInvDisplay
                        return `已选择的装备: ${selected_inv_desc}
                            再次点击此按钮丢弃，
                            操作不可逆转，请慎重！`
                    } else {
                        return `选择背包中一件装备，
                            或点此取消`
                    }
                } else {
                    return `选择背包中一件装备丢弃
                        操作不可逆转，请慎重！`
                }
            },
            style() {
                return {
                    "background-color": player.i.discard_selected ? "#3498db": "#ffffff",
                    "border-radius": "1px"
                }
            },
            onClick() {
                if (!player.i.discard_selected) {
                    player.i.discard_selected = true
                    player.i.forge_selected = false
                    player.i.selected_inv_ind = -1
                } else {
                    if (player.i.selected_inv_ind >= 0) {
                        // discard
                        layers["i"].discardInventory(player.i.selected_inv_ind)
                        player.i.discard_selected = false
                    } else {
                        player.i.discard_selected = false
                    }
                }
            },
            canClick: () => player.i.cur_invs * 2 > player.i.inv_slots
        },

        
        32: {
            title: "回炉",
            display() {
                if (!player.i.forge_unlocked) {
                    return `待解锁`
                }
                if (player.i.forge_selected) {
                    if (player.i.selected_inv_ind >= 0) {
                        let selected_inv_desc = tmp.i.selectedInvDisplay
                        let cost_display = tmp.i.forgeCostDisplay
                        let number_forged = tmp.i.forgeExpectation
                        return `再次点击此按钮回炉
                            目前选择装备: ${selected_inv_desc}
                            回炉消耗: ${cost_display}
                            回炉后数字: ${number_forged}`
                    } else {
                        return `请选择装备，
                            或点此取消`
                    }
                } else {
                    return `选择背包中一件装备回炉强化，
                        提升装备数字<br>
                        上限: 你的数字x20`
                }
            },
            style() {
                return {
                    "background-color": player.i.forge_selected ? "#3498db": "#ffffff",
                    "border-radius": "1px"
                }
            },
            onClick() {
                if (!player.i.forge_selected) {
                    player.i.forge_selected = true
                    player.i.discard_selected = false
                    player.i.selected_inv_ind = -1
                } else {
                    if (player.i.selected_inv_ind >= 0) {
                        layers["i"].forgeEquipment()
                        player.i.forge_selected = false
                    } else {
                        player.i.forge_selected = false
                    }
                }
            },
            canClick: () => player.i.forge_unlocked
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
            let inv = player.i.inventory[data]
            let typ = inv.equiptype
            if (player.i.forge_selected || player.i.discard_selected) {
                if (player.i.selected_inv_ind == data) {
                    player.i.selected_inv_ind = -1
                } else {
                    player.i.selected_inv_ind = data
                }
                return
            }

            if (player.i.equips[typ].equipped) {    
                // swap
                let cur = player.i.equips[typ]
                let t = cur.number; cur.number = inv.number; inv.number = t
                t = cur.name; cur.name = inv.name; inv.name = t

            } else {
                // equip
                player.i.equips[typ].equipped = true
                player.i.equips[typ].number = inv.number
                player.i.equips[typ].name = inv.name
                inv.exist = false

                player.i.cur_invs -= 1
            }
        },
        getTitle(data, id) {
            return player.i.inventory[data].exist ? full_equips[player.i.inventory[data].name].dispn : "空"
        },
        getDisplay(data, id) {
            if (player.i.inventory[data].exist) {
                let inv = player.i.inventory[data]
                return `数字<br>${format(inv.number)}`
            } else {
                return ""
            }
        },
    },

    buyables: {
        11: {
            title: "背包扩容 I",
            unlocked: () => false,

            display() { return "TODO"},
            style: inventory_buyable_style
            // TODO, not quite necessary rn
        }
    },

    shouldNotify: () => {
        return player.i.cur_invs >= player.i.inv_slots
    },

    tabFormat: {
        "背包": {
            content: [
            ["display-text",
            function() {
                let d = player.i
                let disp = ""
                disp += "<p>你目前拥有</p><p>——————————————————————————</p>"
                
                for (let res_n in res_list) {
                    res_n = res_list[res_n]
                    if (d["best"+res_n].gt(0)) {
                        disp += `<p><b>${format(d[res_n].max(0))}</b> ${res_name[res_n]}</p>`
                    }
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
            ["clickables", [3]],
            "blank",
            "grid",
            "blank",
            "buyables",
            "blank"]
        },
        "制造": {
            content: [    
                ["display-text",
                function() {
                    let d = player.i
                    let disp = ""
                    disp += "<p>你目前拥有</p><p>——————————————————————————</p>"
                    
                    for (let res_n in res_list) {
                        res_n = res_list[res_n]
                        if (d["best"+res_n].gt(0)) {
                            disp += `<p><b>${format(d[res_n])}</b> ${res_name[res_n]}</p>`
                        }
                    }
                    return disp
                },
                {"font-size": "20px"}],
                
                "blank",

                ["display-text", function() {
                    return `<p>你可以在此处消耗资源，制造数字为1的装备。</p>
                    <p>拥有多个同样的装备并没有什么好处。</p>
                    <p>戒指往往提供战斗外的加成，推荐首先制造。</p>`
                }, {"font-size": "16px"}],

                "blank",

                ["layer-proxy", ["mk", ["grid"]]]
            ],
            unlocked: () => player.i.making_unlocked
        }
    },

    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row || resettingLayer == "r") {
            let keep = ["inv_slots", "forge_unlocked", "making_unlocked"]
            for (let res_n in res_list) {
                keep.push("best"+res_list[res_n])
            }
            layerDataReset(this.layer, keep)
        }
    },

    
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() {
        let i = player.i
        return i.bestfish.gt(0) || i.bestfood.gt(0) || i.bestgold.gt(0) || i.bestwood.gt(0)
    },

    update(diff) {
        let d = player.i
        for (let res_n in res_list) {
            res_n = res_list[res_n]
            d["best"+res_n] = d["best"+res_n].max(d[res_n])    
        }
    }
})