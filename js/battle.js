// Battle, a.k.a adventure, zones, or sth

addLayer("b", {
    name: "战斗", // This is optional, only used in a few places, If absent it just uses the layer id.
    disp_symbol: "战斗",
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 5, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: d(0),
            in_battle: false,
            battle_unlocked: false,
            pl_action: d(0),
            ene_action: d(0),
            pl: {
                dispn: "你",
                hp: d(100),
                maxhp: d(100),
                mp: d(10),
                maxmp: d(10),
                speed: d(1),
                crit: d(0.1),
                critdmg: d(1.5),
                atk: d(1),
                def: d(1),
                buffs: {},
                traits: {},
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
                buffs: {},
                traits: {},
            },
            max_prog: {
                mpcave: 0,
                mphorde: 0,
                mpannazone: 0
            },
            battle_logs: [],
            queued_encounters: [],
            in_zone: false,
            zone_countdown: 0,
            zone_total: 0,
            zone_name: "",
            zone_area: "", // layer code of the zone-belonged-area
            just_defeated: "", // the last enemy defeated, useful for achievements
        }
    },
    color: "#d63031",
    subcolor: "#ff7675",
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

    plBaseHP() {
        return d(100).mul(tmp.e.hpEffect)
    },
    plBaseMP() {
        return d(10)
    },

    plAtk() {
        let weapon = player.i.equips.weapon

        if (!weapon.equipped) {
            let base_atk = hasUpgrade("r", 12) ? d(3) : d(0)
            base_atk = base_atk.mul(tmp.r.physicalEffect.cube().sqrt())
            base_atk = base_atk.mul(tmp.e.atkEffect)
            return base_atk
        } else {
            let base_atk = full_equips[weapon.name].atk
            base_atk = base_atk.mul(tmp.r.physicalEffect.cube().sqrt()).mul(weapon.number.cube().sqrt())
            base_atk = base_atk.mul(tmp.e.atkEffect)
            return base_atk
        }
    },

    plDef() {
        let shield = player.i.equips.shield
        let shield_def = d(0)
        if (shield.equipped) {
            shield_def = full_equips[shield.name].def
            shield_def = shield_def.mul(tmp.r.physicalEffect.cube().sqrt()).mul(shield.number.cube().sqrt())
        }

        let armor = player.i.equips.armor
        let armor_def = d(0)
        if (armor.equipped) {
            armor_def = full_equips[armor.name].def
            armor_def = armor_def.mul(tmp.r.physicalEffect.cube().sqrt()).mul(armor.number.cube().sqrt())
        }

        return shield_def.add(armor_def).mul(tmp.e.defEffect)
    },
    plBaseSpeed() {
        return d(1).mul(tmp.e.speedEffect)
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
            unlocked: () => player.b.in_battle,
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
            unlocked: () => player.b.in_battle // TODO: also check magic unlocked (in future)
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
            unlocked: () => player.b.in_battle
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
            unlocked: () => player.b.in_battle // TODO: also check magic unlocked (in future)
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
            unlocked: () => player.b.in_battle
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
            unlocked: () => player.b.in_battle
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
                return `你正在副本 ${zones[player.b.zone_name].dispn} 中，剩余 ${player.b.zone_countdown}/${player.b.zone_total} 场战斗`
            }
        }],
        "blank",
        ["display-text", function() {
            if (player.b.in_battle) {
                return `你正在和 ${player.b.enemy.dispn} 战斗！`
            } else {
                return `目前没有发生战斗。`
            }
        }],
        "blank",
        "h-line",
        "blank",

        ["display-text", function() {
            if (!player.b.in_battle) return ""
            let ene = player.b.enemy
            return `<p><b style='font-size: 20px'>${ene.dispn}</b> 数字 ${format(ene.number)}</p>
            ATK ${format(ene.atk)}, DEF ${format(ene.def)}, 速度 ${format(ene.speed)}`
        }],
        ["bar", "enemyHPBar"],
        ["bar", "enemyMPBar"],
        ["bar", "enemyActionBar"],
        "blank",
        ["display-text", function() {
            if (!player.b.in_battle) return ""
            return tmp.b.enemyTraitsText
        }],
        "blank",
        ["display-text", function() {
            if (!player.b.in_battle) return ""
            return tmp.b.enemyBuffText
        }],

        ["blank", "150px"],
        ["display-text", function() {
            if (!player.b.in_battle) return ""
            let pl = player.b.pl
            return `<p><b style='font-size: 20px'>你</b> 数字 ${format(tmp.r.number)}</p>
            ATK ${format(pl.atk)}, DEF ${format(pl.def)}, 速度 ${format(pl.speed)}`
        }],
        ["bar", "plHPBar"],
        ["bar", "plMPBar"],
        ["bar", "plActionBar"],
        "blank",
        ["display-text", function() {
            if (!player.b.in_battle) return ""
            return tmp.b.plTraitsText
        }],
        "blank",
        ["display-text", function() {
            if (!player.b.in_battle) return ""
            return tmp.b.plBuffText
        }],

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

    ],

    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row || resettingLayer == "r") {
            let keep = ["battle_unlocked"]
            layerDataReset(this.layer, keep)
        }
    },

    startZone(name, area) {
        let zone = zones[name]
        player.b.zone_name = name
        player.b.zone_area = area
        player.b.zone_total = zone.len
        player.b.zone_countdown = zone.len

        player.b.max_prog[name] = player.b.max_prog[name] > 0 ? player.b.max_prog[name] : 1;

        for (let e in zone.encounters) {
            encounter = zone.encounters[e]
            let d = weighted_choice(encounter.weights)

            player.b.queued_encounters.push([encounter.targets[d], encounter.number])
        }

        player.b.in_zone = true
    },

    prevBattleBuff() {
        layers["i"].applyEquipmentBuffs()
    },

    OTBuffs(side, diff) {
        let p = player.b[side]

        // DOT
        if ("burning" in p.buffs) {
            let burning = p.buffs["burning"]
            p.hp = p.hp.sub(burning.dot)
            burning.time = burning.time.sub(diff)

            if (burning.time.lte(0)) {
                delete(p.buffs.burning)
            }
        }
    },

    subBuffMoves(side, buff_name) {
        let p = player.b[side]
        let buff = p.buffs[buff_name]
        buff.moves -= 1
        if (buff.moves <= 0) {
            delete(p.buffs[buff_name])
        }
    },

    attack(attacker, attacked) {
        // Attack 
        let atker = player.b[attacker]
        let atked = player.b[attacked]

        let atk = atker.atk

        if ("stunned" in atker.buffs) {
            layers.b.subBuffMoves(attacker, "stunned")
            return
        }

        if ("innocent" in atker.traits) {
            atk = d(10).pow(atk.log(10).sub(Math.random()*2))
        }

        if ("losingtail" in atker.traits) {
            atker.buffs["losttail"] = {rate:0.25}
        }

        let repeat = 1
        if ("comboatk" in atker.buffs) {
            repeat = atker.buffs["comboatk"].times
            atk = atk.mul(atker.buffs["comboatk"].discnt)
            layers.b.subBuffMoves(attacker, "comboatk")
        }
        
        if ("weakened" in atker.buffs) {
            atk = atk.mul(atker.buffs["weakened"].atkrate)
            layers.b.subBuffMoves(attacker, "weakened")
        }
        
        let atked_def = atked.def
        if ("pierce" in atker.buffs) {
            atked_def = atked_def.mul(atker.buffs["pierce"].piercerate)
            layers.b.subBuffMoves(attacker, "pierce")
        }

        for (let i = 0; i < repeat; i++) {
    
            let dmg = atk

            let is_crit = atker.crit.gte(Math.random())
            if ("raging" in atker.buffs) {
                is_crit = true
                layers.b.subBuffMoves(attacker, "raging")
            }
    
            if (is_crit) {
                dmg = dmg.mul(atker.critdmg)

                if ("furious" in atker.traits) {
                    dmg = dmg.mul(2)
                }
            }
    
            dmg = dmg.sub(atked.def)
            dmg = dmg.max(0)

            if ("tough" in atked.buffs) {
                dmg = dmg.mul(atked.buffs["tough"].rate)
            }
    
            atked.hp = atked.hp.sub(dmg)
            layers["b"].pushBattleLog(`${is_crit? "<span style='color:red'>暴击！</span> " : ""}${atker.dispn} 对 ${atked.dispn} 造成了 ${format(dmg)}点伤害！`)

            if ("induce_bleeding" in atker.traits) {
                let bleeding = {moves:3, dmgrate: 0.05}
                atked.buffs["bleeding"] = bleeding
            }
            
            if ("worms" in atker.traits) {
                if ("engulfed" in atked.buffs) {
                    if (atked.buffs["engulfed"].rate > 0.0001) {
                        atked.buffs["engulfed"].rate = atked.buffs["engulfed"].rate * 0.5
                        atked.speed = atked.speed.mul(0.5)
                    }
                } else {
                    atked.buffs["engulfed"] = {rate:0.5}
                    atked.speed = atked.speed.mul(0.5)
                }
                atked.hp = atked.hp.sub(atked.maxhp.mul(0.01))
            }

            if ("bleeding" in atker.buffs) {
                let bleeding_dmg = atker.maxhp.mul(atker.buffs["bleeding"].dmgrate)
                layers["b"].pushBattleLog(`${atker.dispn} 流血受到 ${format(bleeding_dmg)}点伤害！`)
                atker.hp = atker.hp.sub(bleeding_dmg)
                layers.b.subBuffMoves(attacker, "bleeding")
                if (atker.hp.lte(0)) return
            }

            if ("warcry" in atker.traits) {
                atker.atk = atker.atk.mul(1.2)
            }

            if ("peeled" in atker.traits) {
                atker.atk = atker.atk.mul(0.8)
            }
            if ("peeled" in atked.traits) {
                atked.atk = atked.atk.mul(0.8)
            }
        }

    },


    startEncounter(enemy, base_number) {
        let b = player.b
        let e = b.enemy
        let pl = b.pl
        let ene_stat = full_enemies[enemy].stat

        e.name = enemy
        e.dispn = full_enemies[enemy].dispn

        e.number = ene_stat.rel_number.mul(base_number)
        
        // TODO: should be reconsidered, zone difficulty are randomized
        e.number = e.number.mul(0.9 + 0.15*Math.random())

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
        e.buffs = {}
        pl.buffs = {}

        // add enemy initial buffs
        for (let buff in ene_stat.init_buffs) {
            let init_buff = ene_stat.init_buffs[buff]
            let buff_name = init_buff.name

            let new_buff = {}
            for (let param in full_buffs[buff_name].params) {
                param = full_buffs[buff_name].params[param]
                new_buff[param] = init_buff[param]
            }
            e.buffs[buff_name] = new_buff
        }

        e.traits = {} 
        for (let t in full_enemies[enemy].traits) {
            let trait = full_enemies[enemy].traits[t]
            e.traits[trait] = undefined // maybe traits could have params
        }

        pl.maxhp = tmp.b.plBaseHP.mul(tmp.r.physicalEffect.cube())
        pl.hp = pl.maxhp
        pl.maxmp = tmp.b.plBaseMP.mul(tmp.r.physicalEffect.cube())
        pl.mp = pl.maxmp
        
        pl.atk = tmp.b.plAtk
        pl.def = tmp.b.plDef
        pl.speed = tmp.b.plBaseSpeed.mul(tmp.r.speedUp)
        pl.crit = tmp.b.plCrit
        pl.critdmg = tmp.b.plCritDmg

        pl.traits = []

        b.pl_action = d(0)
        b.ene_action = d(0)

        layers["b"].prevBattleBuff()

        b.in_battle = true
        showTab("b")
    },

    buffText(side) {
        let side_buffs = player.b[side].buffs
        let buff_text = ""
        for (let b in side_buffs) {
            let buff = side_buffs[b]
            buff_text += full_buffs[b].desc(buff) + "\n"
        }
        return buff_text
    },

    traitsText(side) {
        let side_traits = player.b[side].traits
        let trait_text = ""
        for (let t in side_traits) {
            trait_text += full_traits[t].desc() + "\n"
        }
        return trait_text
    },

    plBuffText() { return layers.b.buffText("pl") },

    enemyBuffText() { return layers.b.buffText("enemy") },

    plTraitsText() { return layers.b.traitsText("pl") },

    enemyTraitsText() { return layers.b.traitsText("enemy") },

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
        let actionBar = tmp.b.fullActionBar

        let b = player.b
        if (!b.in_battle && b.in_zone && b.queued_encounters.length > 0) {
            console.log(b.queued_encounters)
            layers["b"].startEncounter(...b.queued_encounters.shift())
        }

        if (b.in_battle) {
            let pl = b.pl
            let enemy = b.enemy
            let rel_speed = enemy.speed.div(b.pl.speed)
            let pl_action_time = actionBar.mul(1.01).sub(b.pl_action).div(1)
            let ene_action_time = actionBar.mul(1.01).sub(b.ene_action).div(rel_speed)

            let real_diff = pl_action_time.min(ene_action_time).min(diff)

            // Action bar grows by the speed of the faster one in pl/enemy,
            // This avoid a sudden death.
            if (rel_speed.gt(1)) {
                b.pl_action = b.pl_action.add(real_diff.mul(d(1).div(rel_speed)))
                b.ene_action = b.ene_action.add(real_diff.mul(1))
            } else {
                b.pl_action = b.pl_action.add(real_diff.mul(1))
                b.ene_action = b.ene_action.add(real_diff.mul(rel_speed))
            }

            // console.log(format(b.pl_action), format(b.ene_action))

            if (b.pl_action.gte(actionBar)) {
                // PL act first if same speed. Useful for a tied battle
                layers["b"].attack("pl", "enemy")
                b.pl_action = d(0)
            }
            
            layers["b"].OTBuffs("enemy", diff)

            if (enemy.hp.lte(0)) {
                if ("boss" in enemy.buffs) {
                    enemy.maxhp = enemy.maxhp.mul(enemy.buffs["boss"].rate)
                    enemy.hp = enemy.maxhp
                    enemy.atk = enemy.atk.mul(enemy.buffs["boss"].rate)
                    enemy.def = enemy.def.mul(enemy.buffs["boss"].rate)                    
                    layers.b.subBuffMoves("enemy", "boss")
                } else {
                    // you win
                    layers["b"].pushBattleLog(`${enemy.dispn} 倒下了！`)

                    // roll drop items
                    let drop = full_enemies[enemy.name].drop
                    let exp = drop.exp.mul(layers.i.possibleEffect("ring", "goldenring", d(1)))

                    if (hasUpgrade("mp", 12)) {
                        exp = exp.mul(upgradeEffect("mp", 12))
                    }
                    let drop_exp = layers["e"].addBattleExp(exp.mul(enemy.number.pow(2.5)))
                    
                    if ("losttail" in enemy.buffs) {
                        drop_exp = drop_exp.mul(enemy.buffs["losttail"].rate)
                    }
                    layers["b"].pushBattleLog(`获得了 ${format(drop_exp)} 经验！`)


                    for (let loot in drop.loots) {
                        loot = drop.loots[loot]
                        if (Math.random() <= loot.droprate) {
                            if (loot.is_equip) {
                                // TODO: drop equipment, need further interface design
                                // there is no equip drop so far, later
                            } else {
                                let loot_num = loot.base.mul(enemy.number.pow(2.5))
                                if ("losttail" in enemy.buffs) {
                                    loot_num = loot_num.mul(enemy.buffs["losttail"].rate)
                                }
                                
                                loot_num = loot_num.mul(layers.i.possibleEffect("ring", "goldenring", d(1)))
                                layers["b"].pushBattleLog(`获得了 ${format(loot_num)} ${res_name[loot.res]}！`)
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
                            zones[b.zone_name].onComplete()
                        }

                        let prog = 1 + b.zone_total - b.zone_countdown

                        // update max progress in zone
                        if (prog > player.b.max_prog[b.zone_name]) {
                            player.b.max_prog[b.zone_name] = prog
                        }
                    }

                    return                    
                }       
            }

            if (b.ene_action.gte(actionBar)) {
                layers["b"].attack("enemy", "pl")
                b.ene_action = d(0)
            }            

            layers["b"].OTBuffs("pl", diff)

            if (pl.hp.lte(0)) {
                // you died
                b.in_battle = false
                b.in_zone = false
                b.zone_countdown = 0
                b.queued_encounters = []
                layers["b"].pushBattleLog(`你死了。`)

                showTab("b")
                layers["r"].youDied(`你在战斗中身亡。凶手是${enemy.dispn}`)
                return
            }

        }
    }
})