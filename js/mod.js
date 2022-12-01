let modInfo = {
	name: "编年史树",
	id: "chronicle",
	author: "catfish",
	pointsName: "空余时间",
	modFiles: [
		"utils/funcutils.js",
		"tree.js", 
		// Area layers
		"areas/seaofgoogol.js", 
		"areas/peanothevillage.js", 
		"areas/theplainofsquares.js",
		"areas/everfortoftheeternity.js",
		"areas/mounttrillion.js",
		// System layers
		"item.js", 
		"making.js",
		"ritual.js", 
		"memory.js", 
		"experience.js", 
		"sloth.js", 
		"battle.js",
		"limitation.js",
		// Resource files
		"texts/dialogue.js",
		"texts/bufftable.js",
		"texts/equiptable.js",
		"texts/enemytable.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.02",
	name: "第一点五步",
}

let changelog = `<h1>更新日志</h1><br>
	<h3>v0.02+ 新手村的终点 </h3><br>
		- 加入更多机制，一些素材和一个副本，结束了第二个大地区层。<br>
		<br>
	<h3>v0.02 第一点五步</h3><br>
		- 增加了小半个地区层，修改了明显不合理的部分数值。<br>
		- 现在初期可能反而过于缓慢。<br>

	<h3>v0.01+ 第一步</h3><br>
		- 增加了半个地区层，重写大部分机制，完成了数字系统前的导入。<br>
		- 节奏可能存在一点问题。<br>
		<br>
	<h3>v0.01 旅途的起始</h3><br>
		- 增加了5个功能层+2个地区层，实现了最初区域的导入和基本玩法.<br>
		- 不存在平衡。<br>
		`

let intro = `<h1>游戏介绍:</h1><br>
		本树的灵感来源包括: Increlution, Your Chronicle, NGU Idle等。<br>
		在增量游戏和放置游戏的基础上，试图讲述一个数值膨胀的RPG故事。<br>
	`

let winText = `你已玩通了目前所有游戏内容！感谢您的游玩，敬请期待更新~`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything", "youDied", "addRawScore", "addInventory", "discardInventory", "forgeEquipment", "removeEquip",
	"startEncounter", "startZone", "pushBattleLog", "addBattleExp", "prevBattleBuff", "OTBuffs", "attack", "subBuffMoves", "applyEquipmentBuffs", "possibleEffect",
	"buffText", "traitsText", "equipDisplay", "extraExpEffect", "getExtraExpEffect", "survivalSkillExpMult", "addRawExpSurvival", "extraExpDisplay", "addSigil0Score",
	"startEvent", "eventLog"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return (!player.r.is_dead) && (!player.b.in_battle)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	gain = gain.mul(buyableEffect("s", 12))

	gain = gain.mul(tmp.r.speedUp)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function() {
		return `目前Endgame: 解锁某个地区`
	},

	function() {
		if (player.r.is_dead) {
			return `<p>${player.r.last_death_cause}</p><p>你的身体已经死亡！在重生之前，无法进行任何操作。</p>`
		}

	},

	function() {
		if (hasAchievement("m", 14)) {
			return `你当前的数字为 ${format(tmp.r.number)}`
		}
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.m.mp_layer_clear
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}