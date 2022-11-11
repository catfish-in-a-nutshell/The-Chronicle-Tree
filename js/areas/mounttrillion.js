
addLayer("t", {
    name: "千兆雪山",
    symbol: "T",
    position: 1,

    startData() { return {
        unlocked: true,
		points: d(0),
    }},

    
    nodeBgStyle: {
        "clip-path": "polygon(48% 0, 66% 47%, 68% 11%, 100% 70%, 81% 92%, 49% 100%, 24% 95%, 0 76%, 20% 24%, 33% 36%)",
    },
    
    nodeStyle: {
        "--bg-sub-color": "#0a3d62"
    },
    canReset() {
        return (!player.r.is_dead)
    },
    color: "#3c6382",
    
    requires: d(1), // Can be a function that takes requirement increases into account
    resource: "投入时间", // Name of prestige currency
    baseResource: "空余时间", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent

    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = d(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return d(1)
    },
    
    tooltip: () => `投入时间 <br>
        &nbsp; ${formatWhole(player.t.points)}`,
    tooltipLocked: () => "千兆雪山",

    
    tabFormat: [["display-text", function() {
        return `在千兆雪山区域，你目前有<b> ${format(player.g.points)} </b>投入时间`
    }, {"font-size": "20px"}],
        "blank",
        "prestige-button",
        "blank",
    ],

    row: 0, // Row the layer is in on the tree (0 is the first row)
    displayRow: 1,

    layerShown() {return player.m.mp_layer_clear},
    
    branches() {return ['mp']},
})