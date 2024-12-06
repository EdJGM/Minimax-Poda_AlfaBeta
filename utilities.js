const onclicks = ["showFirst();","showPrev();","","showNext();","showLast();"]

function smlInt(x){
  if(x < 0){
    return "~" + (-x);
  }
  return "" + x;
}

function highlightCell(i,j){
  for(var x = 0; x < 2; x++){
    for(var y = 0; y < 3; y++){
      var clearedCell = document.getElementById(x + "," + y);
      clearedCell.style.backgroundColor = "";
      clearedCell.style.border = "";
    }
  }
  var cell = document.getElementById(i + "," + j);
  cell.style.backgroundColor = "yellow";
  cell.style.border = "solid 3px red";
}

function unhighlightCells(){
  for(var x = 0; x < 2; x++){
    for(var y = 0; y < 3; y++){
      var clearedCell = document.getElementById(x + "," + y);
      clearedCell.style.backgroundColor = "";
      clearedCell.style.border = "";
    }
  }
}

function hideButtons() {
  for(let i = 0; i < 5; i++){
    //console.log("button"+i);
    document.getElementById("button" + i).style.display = "none";
  }
  document.getElementById("speed").style.display = "none";
  document.getElementById("speedLabel").style.display = "none";
  $(nodeOptions).hide();
}

function showButtons() {
  for(let i = 0; i < 5; i++){
    //console.log("button"+i);
    document.getElementById("button" + i).style.display = "block";
  }
  document.getElementById("speed").style.display = "block";
  document.getElementById("speedLabel").style.display = "block";
}

function disableButton(){
  for(let i = 0; i < arguments.length; i++){
    $("#button"+arguments[i]).attr("disabled", true);
    $("#button"+arguments[i]).removeAttr("onclick");
  }
}

function enableButton(){
  for(let i = 0; i < arguments.length; i++){
    $("#button"+arguments[i]).removeAttr("disabled");
    $("#button"+arguments[i]).attr("onclick",onclicks[arguments[i]]);
  }
}

function enableNavbar(){
  $("#navbarDropdown1").show();
  $("#navbarDropdown2").show();
  $("#navbarDropdown3").show();
  $("#navbarDropdown4").show();
}

function disableNavbar(){
  $("#navbarDropdown1").hide();
  $("#navbarDropdown2").hide();
  $("#navbarDropdown3").hide();
  $("#navbarDropdown4").hide();
}

function miniEx(canvasID){
  var minikey = new Node();
  minikey["type"] = MINNIE;
  minikey["x"] = 40;
  minikey["y"] = 13;
  minikey.draw(canvasID);
}

function maxiEx(canvasID){
  var maxikey = new Node();
  maxikey["type"] = MAXIE;
  maxikey["x"] = 40;
  maxikey["y"] = 22;
  maxikey.draw(canvasID);
}

function leafEx(canvasID){
  var leafkey = new Node();
  leafkey["type"] = LEAF;
  leafkey["x"] = 40;
  leafkey["y"] = 17;
  leafkey.draw(canvasID);
}

function initKey(){
  miniEx("key-minnie");
  maxiEx("key-maxie");
  leafEx("key-leaf");
}

function drawEx1(){
  isEditing = true;
  drawTreeCode('(((((3)(17))((2)(12)))(((15))((25)(0))))((((2)(5))((3)))(((2)(14)))))');
  $(nodeOptions).hide();
  unhighlightCells();
}

function drawEx2(){
  isEditing = true;
  drawTreeCode('((((4)(5))((1))((2)(-3)))(((4)(0))((2)(-2))))');
  $(nodeOptions).hide();
  unhighlightCells();
}

function drawEx3(){
  isEditing = true;
  drawTreeCode('(((((5)(6))((7)(4)(5)))(((3))))((6)(((7))))((((5)))(((9)(8))((6)))))');
  $(nodeOptions).hide();
  unhighlightCells();
}

function drawEx4(){
  isEditing = true;
  drawTreeCode('(((3)(6)(-2))((6)(4)(10))((1)(30)(9)))');
  $(nodeOptions).hide();
  unhighlightCells();
}

function drawEx5(){
  isEditing = true;
  drawTreeCode('(((((3)(5))((2)(7)))(((10)(4))))((((2)(7)))(((8)(2))((4)(6)))))');
  $(nodeOptions).hide();
  unhighlightCells();
}

function initRoot(){
  root = new Node();
  root.type = MAXIE;
  root.x = canvasWidth/2;
  root.y = levelSpace/4;
  numLeaves = 0;

  // Crear un árbol de nivel 2 por defecto
  for (let i = 0; i < 3; i++) {
    let child = new Node();
    child.type = MINNIE;
    child.y = root.y + levelSpace;
    child.parent = root;
    root.children.push(child);
    for (let j = 0; j < 2; j++) {
      let grandChild = new Node();
      grandChild.type = LEAF;
      grandChild.y = child.y + levelSpace;
      grandChild.parent = child;
      child.children.push(grandChild);
      numLeaves++;
    }
  }
  positionNodes(root, numLeaves);
  //document.getElementById("drawing").width = canvasWidth;
  //document.getElementById("drawing").height = canvasHeight;
  root.draw("drawing");
  //numLeaves++;
  isEditing = true;
  document.getElementById("drawing").addEventListener('mousedown', (e) => {if(isEditing){mouseClick(e);};}, false);
  document.addEventListener('keydown', function(e) {
    if(paused){
      if (e.defaultPrevented) {
        return;
     }
     if(!isEditing){
      switch (e.keyCode) {
          case 32:
            playBtnClick();
            break;
          case 37:
            showPrev();
            break;
          case 39:
            showNext();
            break;
      }
      e.preventDefault();
    }
  }
}, true);
}

function copyTree(){
  if(!isTree(root)){
    alert("Must assign values to all leaf nodes first.");
    return;
  }
  treeStr = toTreeCode(root);
  navigator.clipboard.writeText(treeStr);
  alert("Tree copied to clipboard.");
}

function copyExplicitTree(){
  if(!isTree(root)){
    alert("Must assign values to all leaf nodes first.");
    return;
  }
  treeStr = toExplicitTree(root);
  navigator.clipboard.writeText(treeStr);
  alert("Explicit game tree copied to clipboard.");
}

function isTree(node){
  if(node.type == LEAF){
    return node.val != null;
  }
  for(var i = 0; i < node.children.length; i++){
    if(!isTree(node.children[i])){
      return false;
    }
  }
  return true;
}

function toTreeCode(node){
  if(node.type == LEAF){
    return "(" + node.val + ")";
  }
  var treeStr = "("
  for(var i = 0; i < node.children.length; i++){
    treeStr += toTreeCode(node.children[i]);
  }
  treeStr += ")";
  return treeStr
}

function toExplicitTree(node,str="a"){
  if(node.type == LEAF){
    return 'ExplicitGame.State.Esti("' + str + '",' + smlInt(node.val) + ')';
  }
  var treeStr = 'ExplicitGame.State.Node("' + str + '",[';
  for(var i = 0; i < node.children.length; i++){
    if(i != 0){
      treeStr += ",";
    }
    treeStr += toExplicitTree(node.children[i], str + ">" + i);
  }
  treeStr += "])";
  return treeStr;
}

function loadTreeCode(){
  var treeStr = prompt("Type a tree encoding:");

  if (treeStr == null) {
    return;
  }
  isEditing = true;
  hideButtons();
  $(nodeOptions).hide();
  drawTreeCode(treeStr);
  unhighlightCells();
}

function loadExplicitTree(){
  var treeStr = prompt("Type a tree value:");

  if (treeStr == null) {
    return;
  }
  isEditing = true;
  hideButtons();
  $(nodeOptions).hide();
  drawExplicitTreeCode(treeStr);
  unhighlightCells();
}

function drawTreeCode(treeStr){
  try{
    var treeFeedback = loadTreeCodeHelper(window.PARSERTREE.parse(treeStr),0);
    var tree = treeFeedback[0];
    var newNumLeaves = treeFeedback[1];
    var max_y = treeFeedback[2];
    if(tree != null){
      root.children = new Array();
      root = tree;
      numLeaves = newNumLeaves;
      if(max_y > canvasHeight){
        canvasHeight = max_y + levelSpace;
        var c = document.getElementById("drawing");
        c.height = canvasHeight;
      }
      positionNodes(root,numLeaves);
      drawAll("drawing");
    }
  }
  catch(e){
    alert(e.toString());
  }
}

function drawExplicitTreeCode(treeStr){
  try{
    var treeFeedback = loadTreeCodeHelper(window.PARSERSML.parse(treeStr),0);
    var tree = treeFeedback[0];
    var newNumLeaves = treeFeedback[1];
    var max_y = treeFeedback[2];
    if(tree != null){
      root.children = new Array();
      root = tree;
      numLeaves = newNumLeaves;
      if(max_y > canvasHeight){
        canvasHeight = max_y + levelSpace;
        var c = document.getElementById("drawing");
        c.height = canvasHeight;
      }
      positionNodes(root,numLeaves);
      drawAll("drawing");
    }
  }
  catch(e){
    alert(e.toString());
  }
}

function loadTreeCodeHelper(parsedTree,level){
  var tree = new Node();
  tree.y = levelSpace/4 + levelSpace * level;
  if(typeof(parsedTree) == "number"){
    tree.type = LEAF;
    tree.val = parsedTree;
    return [tree,1,tree.y];
  }
  else{
    tree.type = 1-(level%2);
    tree.val = null;
  }
  var totalLeaves = 0;
  var max_y = tree.y;
  for(var i = 0; i < parsedTree.length; i++){
    var childFeedback = loadTreeCodeHelper(parsedTree[i],level+1);
    var child = childFeedback[0];
    tree.children.push(child);
    child.parent = tree;
    totalLeaves += childFeedback[1];
    max_y = Math.max(max_y,childFeedback[2]);
  }
  for(var i = 0; i < tree.children.length; i++){
    tree.alphabetas.push(null);
  }
  return [tree,totalLeaves,max_y];
}

function resizeHeight(){
  var c = document.getElementById("drawing");
  c.height += levelSpace;
  canvasHeight += levelSpace;
}

function resetTree(){
  isEditing = true;
  if(!isTree(root)){
    return;
  }
  drawTreeCode(toTreeCode(root));
  $(nodeOptions).hide();
}

function updateTree() {
  const width = parseInt(document.getElementById("width").value);
  const depth = parseInt(document.getElementById("depth").value);

  if (isNaN(width) || isNaN(depth) || width < 1 || depth < 1) {
    alert("Por favor, ingrese valores válidos para anchura y profundidad.");
    return;
  }

  root = new Node();
  root.type = MAXIE;
  root.x = canvasWidth / 2;
  root.y = levelSpace / 4;
  numLeaves = 0;

  createTree(root, width, depth, 1);

  positionNodes(root, numLeaves);
  drawAll("drawing");
}

function createTree(node, width, depth, currentLevel) {
  if (currentLevel >= depth) {
    node.type = LEAF;
    numLeaves++;
    return;
  }

  node.type = currentLevel % 2 === 0 ? MINNIE : MAXIE;
  for (let i = 0; i < width; i++) {
    let child = new Node();
    child.y = node.y + levelSpace;
    child.parent = node;
    node.children.push(child);
    createTree(child, width, depth, currentLevel + 1);
  }
}

function validateInput(input) {
  // Eliminar caracteres no numéricos
  input.value = input.value.replace(/[^0-9]/g, '');

  // Asegurarse de que el valor esté dentro del rango permitido
  if (input.value !== '') {
    let value = parseInt(input.value);
    if (value < 1) {
      input.value = 1;
    } else if (value > 5) {
      input.value = 5;
    }
  }
}

function validateAndCreateTree() {
  const width = parseInt(document.getElementById("width").value);
  const depth = parseInt(document.getElementById("depth").value);

  if (isNaN(width) || isNaN(depth) || width < 1 || width > 5 || depth < 1 || depth > 5) {
    alert("Por favor, ingrese valores válidos para anchura y profundidad (1-5).");
    return;
  }

  updateTree();
}

