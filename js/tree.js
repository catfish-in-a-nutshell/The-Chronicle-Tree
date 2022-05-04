var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
	showTree: true,

    treeLayout: ""

    
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)

addNode("placeholder", {
    row: 1,
    layerShown: "ghost",
}, 
)

addNode("placeholder2", {
    row: 2,
    layerShown: "ghost",
}, 
)

addNode("placeholder3", {
    row: 3,
    layerShown: "ghost",
}, 
)

addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]],
    previousTab: "",
    leftTab: true,
})