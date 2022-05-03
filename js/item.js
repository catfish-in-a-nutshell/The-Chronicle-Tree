// Items, including variant resources

addLayer("i", {
    name: "物品", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        food: new Decimal(0),
        bestfood: new Decimal(0),
        gold: new Decimal(0),
        bestgold: new Decimal(0),
        fish: new Decimal(0),
        bestfish: new Decimal(0),

        equips: {
            axe: {
                
            }
        }
    }},
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
    tooltip:() => "物品栏",
    tooltipLocked:() => "物品栏",
    prestigeNotify: () => false,

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

            return disp
        },
        {"font-size": "20px"}]
    ],

    
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
    }
})