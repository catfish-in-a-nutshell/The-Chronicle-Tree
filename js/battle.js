// Battle, a.k.a adventure, zones, or sth

addLayer("b", {
    name: "战斗", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 5, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        let pl_buffs = {}
        for (let i = 0; i < full_buffs.length; i++) {
            var buff = full_buffs[i]
            pl_buffs[buff.name] = {exist: false}
            
            for (var s = 0; s < buff.params.length; s++) {
                var p = buff.params[s]
                pl_buffs[buff.name][p] = 0
            }
        }

        let ene_buffs = {}
        for (let i = 0; i < full_buffs.length; i++) {
            let buff = full_buffs[i]
            ene_buffs[buff.name] = {exist: false}
            
            for (let s = 0; s < buff.params.length; s++) {
                let p = buff.params[s]
                ene_buffs[buff.name][p] = 0
            }
        }

        return {
            unlocked: true,
            points: new Decimal(0),
            is_fighting: false,
            pl: {
                hp: new Decimal(100),
                mp: new Decimal(10),
                number: new Decimal(1),
                speed: new Decimal(1),
                crit: new Decimal(0),
                atk: new Decimal(1),
                def: new Decimal(1),
                buffs: pl_buffs
            },
            enemy: {
                hp: new Decimal(0),
                mp: new Decimal(0),
                number: new Decimal(1),
                speed: new Decimal(0),
                crit: new Decimal(0),
                atk: new Decimal(0),
                def: new Decimal(0),
                buffs: ene_buffs
            }
        }
    },
    color: "#d63031",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "战斗积分", // Name of prestige currency
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
        return "战斗界面"
    },
    tooltipLocked:() => "战斗界面",
    prestigeNotify: () => false,

    isBusy() {
        return player.b.is_fighting
    },

    bars:{
        // TODO: draw battle UI!
    },

    tabFormat: [
        // TODO: draw battle UI!
    ],

    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row || resettingLayer == "r") {
            let keep = ["inv_slots"]
            layerDataReset(this.layer, keep)
        }
    },

    startEncounter(enemy) {
        let b = player.b
        
        // TODO: initialize enemy stats!
        b.is_fighting = true
        player.tab = "b"
    },
    
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() {
        return hasAchievement("m", 16)
    },

    update(diff) {
        // TODO: implement battle!
    }
})