// Limitation, a.k.a caps

addLayer("l", {
    name: "限制",
    disp_symbol: "限制",
    symbol: "L",
    position: 6,
    startData() { return {
        unlocked: true,
        points: d(0),
    }},
    color: "#2e86de",
    subcolor: "#54a0ff",
    type: "none",
    resource: "placeholder",
    row: "side",
    
    layerShown: () => tmp.r.number.gte(100),

    expDivider() {
        if (tmp.r.number.gte(100)) {
            return tmp.r.number.div(100).cube()
        }
        return d(1)
    },

    milestones: {
        0: {
            requirementDescription: "到达 100 数字",
            effectDescription: () => `如此巨大的你已无法再踏入皮亚诺村，只有 将鱼制成食物 被继承下来。<br>
                与此同时，皮亚诺村的升级和对话被自动化。<br>
                然而，随着数字增长，从鱼中获得的经验也受到限制，目前/${format(tmp.l.expDivider)}`,
            done: () => tmp.r.number.gte(100),
        }
    },

    tabFormat: [
        "blank",
        ["display-text", function() {
            return `不明的力量限制着你的成长，纠正着让数字膨胀的扭曲。`
        }],
        "blank",
        "milestones"
    ]
})