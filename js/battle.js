// Battle, a.k.a adventure, zones, or sth

addLayer("b", {
    name: "战斗", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 5, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        let pl_buffs = {}
        for (let i in full_buffs) {
            var buff = full_buffs[i]
            pl_buffs[i] = {exist: false}
            
            for (var s = 0; s < buff.params.length; s++) {
                var p = buff.params[s]
                pl_buffs[i][p] = 0
            }
        }

        let ene_buffs = {}
        for (let i in full_buffs) {
            let buff = full_buffs[i]
            ene_buffs[i] = {exist: false}
            
            for (let s = 0; s < buff.params.length; s++) {
                let p = buff.params[s]
                ene_buffs[i][p] = 0
            }
        }

        return {
            unlocked: true,
            points: d(0),
            in_battle: false,
            pl_action: d(0),
            ene_action: d(0),
            pl: {
                hp: d(100),
                maxhp: d(100),
                mp: d(10),
                maxmp: d(10),
                speed: d(1),
                crit: d(0.1),
                critdmg: d(1.5),
                atk: d(1),
                def: d(1),
                buffs: pl_buffs
            },
            enemy: {
                name: "",
                dispn: "",
                hp: d(0),
                maxhp: d(0),
                mp: d(0),
                maxmp: d(0),
                number: d(1),
                speed: d(0),
                crit: d(0),
                critdmg: d(1),
                atk: d(0),
                def: d(0),
                buffs: ene_buffs,
                traits: new Set()
            },
            battle_logs: [],
            queued_encounters: [],
            in_zone: false,
            zone_countdown: 0,
            zone_total: 0,
            zone_name: "",
            zone_area: "",
            just_defeated: "", // the last enemy defeated, useful for achievements
        }
    },
    color: "#d63031",
    requires: d(1), // Can be a function that takes requirement increases into account
    resource: "战斗积分", // Name of prestige currency
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
    tooltip:() => {
        return "战斗界面"
    },
    tooltipLocked:() => "战斗界面",
    prestigeNotify: () => false,

    isBusy() {
        return player.b.in_battle
    },

    plBaseHP() {return d(100)},
    plBaseMP() {
        return d(10)
    },
    plAtk() {
        let weapon = player.i.equips.weapon
        let base_atk = player.i.equips.weapon.equipped ? full_equips[weapon.name].atk : d(0)
        base_atk = base_atk.mul(player.r.number.sqrt()).mul(weapon.number.sqrt())
        return base_atk
    },
    plDef() {
        let shield = player.i.equips.shield
        let shield_def = d(0)
        if (shield.equipped) {
            shield_def = full_equips[shield.name].def
            shield_def = shield_def.mul(player.r.number.sqrt()).mul(shield.number.sqrt())
        }

        let armor = player.i.equips.armor
        let armor_def = d(0)
        if (armor.equipped) {
            armor_def = full_equips[armor.name].def
            armor_def = armor_def.mul(player.r.number.sqrt()).mul(armor.number.sqrt())
        }

        return shield_def.add(armor_def)
    },
    plBaseSpeed() {
        return d(1)
    },
    plCrit() {
        return d(0.2)
    },
    plCritDmg() {
        return d(1.5)
    },
    fullActionBar() { return d(5) },

    bars:{
        plHPBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#d63031"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle: {
                'border-radius': 0,
                'margin-top': "5px"
            },
            progress: () => player.b.pl.hp.div(player.b.pl.maxhp),
            display() { return `HP ${format(player.b.pl.hp)} / ${format(player.b.pl.maxhp)}` },
            unlocked: () => player.b.in_battle || true
        },

        plMPBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#0984e3"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle: {
                'border-radius': 0,
                'margin-top': "-2px"
            },
            progress: () => player.b.pl.mp.div(player.b.pl.maxmp),
            display() { return `MP ${format(player.b.pl.mp)} / ${format(player.b.pl.maxmp)}` },
            unlocked: () => player.b.in_battle || true // TODO: also check magic unlocked (in future)
        },
        
        
        enemyHPBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#d63031"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle: {
                'border-radius': 0,
                'margin-top': "5px"
            },
            progress: () => player.b.enemy.hp.div(player.b.enemy.maxhp),
            display() { return `HP ${format(player.b.enemy.hp)} / ${format(player.b.enemy.maxhp)}` },
            unlocked: () => player.b.in_battle || true
        },

        enemyMPBar: {
            direction: RIGHT,
            width: 300,
            height: 30,
            fillStyle: {'background-color' : "#0984e3"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle: {
                'border-radius': 0,
                'margin-top': "-2px"
            },
            progress: () => player.b.enemy.mp.div(player.b.enemy.maxmp),
            display() { return `MP ${format(player.b.enemy.mp)} / ${format(player.b.enemy.maxmp)}` },
            unlocked: () => player.b.in_battle || true // TODO: also check magic unlocked (in future)
        },
        
        plActionBar: {
            direction: RIGHT,
            width: 300,
            height: 15,
            fillStyle: {'background-color' : "#fdcb6e"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle: {
                'border-radius': 0,
                'margin-top': "-2px"
            },
            progress: () => player.b.pl_action.div(tmp.b.fullActionBar),
            unlocked: () => player.b.in_battle || true
        },

        enemyActionBar: {
            direction: RIGHT,
            width: 300,
            height: 15,
            fillStyle: {'background-color' : "#fdcb6e"},
            baseStyle: {'background-color' : "#000000"},
            borderStyle: {
                'border-radius': 0,
                'margin-top': "-2px"
            },
            progress: () => player.b.ene_action.div(tmp.b.fullActionBar),
            unlocked: () => player.b.in_battle || true
        },
        
    },

    clickables: {
        11: {
            "title": "逃跑！",
            display() {
                return `脱离战斗或副本，不会获得任何战利品，但也没有损失`
            },
            style() {
                return {
                    "border-radius": "1px",
                    "background-color": "#ccc"
                }
            },
            onClick() {
                // escape
                player.b.queued_encounters = []
                player.b.in_battle = false
                player.b.in_zone = false
                player.b.zone_countdown = 0
                layers["b"].pushBattleLog(`你逃跑了！`)
            },

            canClick: () => !player.r.is_dead && player.b.in_battle
        }
    },

    tabFormat: [
        ["display-text", function() {
            if (player.b.in_zone) {
                return `你正在副本 ${player.b.zone_name} 中，剩余 ${player.b.zone_countdown}/${player.b.zone_total} 场战斗`
            }
        }],
        "blank",
        ["display-text", function() {
            if (player.b.in_battle) {
                return `你正在和 ${player.b.enemy.dispn} 战斗！`
            }
        }],
        "blank",
        "h-line",
        "blank",

        ["display-text", function() {
            let ene = player.b.enemy
            return `<p><b style='font-size: 20px'>${ene.dispn}</b> 数字 ${format(ene.number)}</p>
            ATK ${format(ene.atk)}, DEF ${format(ene.def)}`
        }],
        ["bar", "enemyHPBar"],
        ["bar", "enemyMPBar"],
        ["bar", "enemyActionBar"],

        ["blank", "150px"],
        ["display-text", function() {
            let pl = player.b.pl
            return `<p><b style='font-size: 20px'>你</b> 数字 ${format(player.r.number)}</p>
            ATK ${format(pl.atk)}, DEF ${format(pl.def)}`
        }],
        ["bar", "plHPBar"],
        ["bar", "plMPBar"],
        ["bar", "plActionBar"],

        "blank",
        "h-line",

        "blank",
        ["display-text", function() {
            battle_log = ""
            for (l in player.b.battle_logs) {
                battle_log += `<p>${player.b.battle_logs[l]}</p>`
            }
            return battle_log
        }],
        "blank",
        "h-line",

        "blank",

        ["clickable", 11]

        // TODO: draw battle UI!
    ],

    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row || resettingLayer == "r") {
            let keep = ["inv_slots"]
            layerDataReset(this.layer, keep)
        }
    },

    startZone(name, area) {
        zone = zones[name]
        player.b.zone_area = area
        player.b.zone_total = zone.len
        player.b.zone_countdown = zone.len

        player[area].max_prog = player[area].max_prog > 0 ? player[area].max_prog : 1;

        for (e in zone.encounters) {
            encounter = zone.encounters[e]
            d = weighted_choice(encounter.weights)

            player.b.queued_encounters.push([encounter.targets[d], encounter.number])
        }
    },

    startEncounter(enemy, base_number) {
        let b = player.b
        let e = b.enemy
        let pl = b.pl
        let ene_stat = full_enemies[enemy].stat

        e.name = enemy
        e.dispn = full_enemies[enemy].dispn
        e.number = ene_stat.rel_number.mul(base_number).mul(0.8 + 0.4*Math.random())
        let fac = e.number.cube()

        e.maxhp = ene_stat.hp.mul(fac)
        e.maxmp = ene_stat.mp
        e.hp = e.maxhp
        e.mp = e.maxmp
        e.atk = ene_stat.atk.mul(fac)
        e.def = ene_stat.def.mul(fac)
        e.speed = ene_stat.speed.mul(e.number.cbrt())
        e.crit = ene_stat.crit
        e.critdmg = ene_stat.critdmg
        
        // clear previous buffs
        for (let buff in e.buffs) {
            e.buffs[buff].exist = false
            pl.buffs[buff].exist = false
        }

        for (let buff in ene_stat.init_buffs) {
            let init_buff = ene_stat.init_buffs[buff]
            let buff_name = init_buff.name
            for (let param in full_buffs[buff_name].params) {
                e.buffs[buff_name][param] = init_buff[param]
            }
            e.buffs[buff_name].exist = true
        }

        e.traits = new Set(ene_stat.traits)

        pl.maxhp = tmp.b.plBaseHP.mul(tmp.r.physicalEffect.cube())
        pl.hp = pl.maxhp
        pl.maxmp = tmp.b.plBaseMP.mul(tmp.r.physicalEffect.cube())
        pl.mp = pl.maxmp
        
        pl.atk = tmp.b.plAtk
        pl.def = tmp.b.plDef
        pl.speed = tmp.b.plBaseSpeed.mul(tmp.r.speedUp)
        pl.crit = tmp.b.plCrit
        pl.critdmg = tmp.b.plCritDmg

        b.pl_action = d(0)
        b.ene_action = d(0)

        b.in_battle = true
        player.tab = "b"
    },

    pushBattleLog(log_line) {
        player.b.battle_logs.push(log_line)
        if (player.b.battle_logs.length > 8) {
            player.b.battle_logs.shift()
        }
    },
    
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown() {
        return hasAchievement("m", 16)
    },

    update(diff) {
        // TODO: implement battle details!

        let actionBar = tmp.b.fullActionBar

        let b = player.b
        if (!b.in_battle && b.in_zone && b.queued_encounters.length > 0) {
            layers["b"].startEncounter(...b.queued_encounters.shift())
        }

        if (b.in_battle) {
            let pl = b.pl
            let enemy = b.enemy
            let rel_speed = enemy.speed.div(b.pl.speed)
            let pl_action_time = actionBar.sub(b.pl_action).div(1)
            let ene_action_time = actionBar.sub(b.ene_action).div(rel_speed)

            let real_diff = pl_action_time.min(ene_action_time).min(diff)

            b.pl_action = b.pl_action.add(real_diff.mul(1))
            b.ene_action = b.ene_action.add(real_diff.mul(1))

            if (b.pl_action.gte(actionBar)) {
                // PL act first if same speed. Useful for a tied battle
                
                let dmg = pl.atk
                if (pl.crit.gte(Math.random())) {
                    dmg = dmg.mul(pl.critdmg)  
                }
                dmg = dmg.sub(enemy.def)
                dmg = dmg.max(0)

                enemy.hp = enemy.hp.sub(dmg)
                layers["b"].pushBattleLog(`你对 ${enemy.dispn} 造成了 ${format(dmg)}点伤害！`)

                if (enemy.hp.lte(0)) {
                    // you win
                    layers["b"].pushBattleLog(`${enemy.dispn} 倒下了！`)


                    // roll drop items
                    let drop = full_enemies[enemy.name].drop
                    let drop_exp = layer["e"].addBattleExp(drop.exp.mul(enemy.number.pow(3)))
                    layers["b"].pushBattleLog(`获得了 ${format(drop_exp)} 经验！`)
                    

                    for (let loot in drop.loots) {
                        if (Math.random() < loot.droprate) {
                            if (loot.is_equip) {
                                // TODO: drop equipment, need further interface design
                            } else {
                                let loot_num = loot.base.mul(enemy.number.pow(3))
                                layers["b"].pushBattleLog(`获得了 ${format(drop_exp)} ${res_name[loot.res]}！`)
                                player.i[loot.res] = player.i[loot.res].add(loot_num)
                            }
                        }
                    }
                    
                    // update battle status
                    b.just_defeated = enemy.name
                    b.in_battle = false
                    if (b.in_zone) {
                        b.zone_countdown -= 1
                        if (b.zone_countdown == 0) {
                            b.in_zone = false
                            // TODO: zone clear awards!
                        }

                        let prog = 1 + b.zone_total - b.zone_countdown
                        if (prog > player[b.zone_area].prog) {
                            player[b.zone_area].prog = prog
                        }
                    }

                    return
                }

                b.pl_action = d(0)
            }

            if (b.ene_action.gte(actionBar)) {

                let dmg = enemy.atk
                if (enemy.crit.gte(Math.random())) {
                    dmg = dmg.mul(enemy.critdmg)  
                }
                dmg = dmg.sub(pl.def)

                dmg = dmg.max(0)

                pl.hp = pl.hp.sub(dmg)
                
                layers["b"].pushBattleLog(`${enemy.dispn} 对你造成了 ${format(dmg)}点伤害！`)
                if (pl.hp.lte(0)) {
                    // you dead
                    b.in_battle = false
                    b.in_zone = false
                    b.zone_countdown = 0
                    layers["b"].pushBattleLog(`你死了。`)

                    // TODO should add death causes
                    layers["r"].youDied(`你在战斗中身亡。凶手是${enemy.dispn}`)
                    return
                }

                b.ene_action = d(0)
            }

        }
    }
})