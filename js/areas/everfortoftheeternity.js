addLayer("f", {
    name: "亘古王都", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: d(0),
    }},
    canReset() {
        return (!player.r.is_dead && tmp.g.is_inited) && player.r.number.gte(d(1e100))
    },
    color: "#fbc531",
    requires: d(1), // Can be a function that takes requirement increases into account
    resource: "投入时间", // Name of prestige currency
    baseResource: "空余时间", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = d(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return d(1)
    },
    tooltip: () => "亘古王都: " + format(player.f.points) + " 投入时间",
    tooltipLocked: () => "亘古王都 - 到达 1e100 数字解锁",
    
    row: 0, // Row the layer is in on the tree (0 is the first row)
    displayRow: 4,
    hotkeys: [
        {key: "f", description: "f: 将空余时间投入亘古王都区域", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() {
        return hasAchievement("m", 12)
    },

    update(diff) {

    },

    branches() {return ['g']},
})
