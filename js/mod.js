let modInfo = {
	name: "The Chronicle Tree",
	id: "chronicle",
	author: "catfish",
	pointsName: "空余时间",
	modFiles: [
		"utils/funcutils.js",
		"tree.js", 
		// Area layers
		"seaofgoogol.js", 
		"peanothevillage.js", 
		"theplainofsquares.js",
		"everfortoftheeternity.js",
		// System layers
		"item.js", 
		"ritual.js", 
		"memory.js", 
		"experience.js", 
		"sloth.js", 
		"battle.js",
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
	num: "0.01",
	name: "旅途的起始",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.01 旅途的起始</h3><br>
		- 增加了5个功能层+2个地区层，实现了最初区域的导入和基本玩法.<br>
		- 不存在平衡。<br>
		`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything", "youDied", "addRawScore", "addInventory", "useEquip",
 "startEncounter", "startZone", "pushBattleLog", "addBattleExp"]

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
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function() {
		if (player.r.is_dead) {
			return "<p>" + player.r.last_death_cause + "</p><p>你的身体已经死亡！在重生之前，无法进行任何操作。</p>"
		}
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
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