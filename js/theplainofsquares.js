addLayer("mp", {
    name: "幂次原野", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    canReset() {
        return (!player.r.is_dead) && hasUpgrade("p", 35)
    },
    color: "#44bd32",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "投入时间", // Name of prestige currency
    baseResource: "空余时间", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    tooltip: () => "幂次原野: " + format(player.mp.points) + " 投入时间",
    tooltipLocked: () => "幂次原野 - 需要升级: 从皮亚诺村启程",
    
    row: 0, // Row the layer is in on the tree (0 is the first row)
    displayRow: 0,
    hotkeys: [
        {key: "m", description: "m: 将空余时间投入幂次原野区域", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() {
        return hasAchievement("m", 13)
    },

    update(diff) {

    },


    branches() {return ['p']},
})
