// This is a layer that stores another grid for equipment making system.
// Should never be seen in game.

addLayer("mk", {
    name: "制造", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "MK", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        mpcave_reward_unlocked: false,
    }},
    color: "#ffffff",
    requires: d(1), // Can be a function that takes requirement increases into account
    resource: "placeholder", // Name of prestige currency
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
    tooltip:() => "制造 - 辅助层",
    tooltipLocked:() => "制造 - 辅助层",
    prestigeNotify: () => false,
    
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() {
        return false
    },
    unlocked() {
        return true
    },

    grid: {
        rows: 8,
        cols: 6,
        getStartData(id) {
            return Math.floor(id / 100) * 6 + id % 100 - 7
        },
        getUnlocked(id) {
            let data = getGridData(this.layer, id)
            return data < full_equip_list.length && full_equips[full_equip_list[data]].unlocked()
        },
        getCanClick(data, id) {
            if (!tmp.i.canAddInventory) return false
            if (data >= full_equip_list.length) return false

            let cost = full_equips[full_equip_list[data]].cost
            for (let res_n in cost) {
                if (player.i[res_n].lt(cost[res_n])) return false
            }
            return true
        },
        getStyle(data, id) {
            let canClick = layers["mk"].grid.getCanClick(data, id)

            return {
                "background-color": canClick ? "#30336b" : "#444",
                "border-radius": "1px",
                "color": "#ccc"
            }
        },

        onClick(data, id) {
            console.log(data,id)
            let equip = full_equips[full_equip_list[data]]
            for (let res_n in equip.cost) {
                player.i[res_n] = player.i[res_n].sub(equip.cost[res_n])
            }
            layers["i"].addInventory({
                equiptype: equip.etype,
                name: full_equip_list[data],
                number: d(1)
            })
        },

        getTitle(data, id) {
            return data < full_equip_list.length ? full_equips[full_equip_list[data]].dispn : "undefined" 
        },

        getDisplay(data, id) {
            if (data >= full_equip_list.length) return false
            disp = ""
            
            let cost = full_equips[full_equip_list[data]].cost
            for (let res_n in cost) {
                let is_lacking = player.i[res_n].lt(cost[res_n])
                let cur_disp = `
                ${cost[res_n]} ${res_name[res_n]}`
                if (is_lacking) {
                    cur_disp = `<span style='color:#ee5253'> ${cur_disp} </span>`
                }
                disp += cur_disp
                    
            }
            return disp
        }

    },

    tabFormat: ["blank", "grid"],
})