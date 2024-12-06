var steps;
var speed = 1;//the user will be able to speed it up or slow it down, 0.25x to 4.0x
var paused = true;

function initSteps(){
  steps = new Sequence([new Frame(root)]);
}

function Frame(tree, tableInstr=null){
  this.tree = cloneTree(tree);
  this.tableInstr = tableInstr;
  this.display = () => {
      root = this.tree;
      drawAll("drawing");
      if(tableInstr == null){
        unhighlightCells();
      }
      else{
        highlightCell(tableInstr[0],tableInstr[1]);
      }
  };
}

function Sequence(frames){
  this.frames = frames;
  this.selectedFrame = null;
  if(frames.length > 0){
    this.selectedFrame = frames[0];
  }
  this.selectedFrameidx = 0;
  this.addFrame = (newFrame) => {
      this.frames.push(newFrame);
      this.selectedFrame = this.frames[this.selectedFrameidx];
    };
  this.loadFrame = () => {this.selectedFrame.display();};
  this.selectFirst = firstFrame;
  this.selectLast = lastFrame;
  this.selectPrev = prevFrame;
  this.selectNext = nextFrame;
}

function firstFrame(){
  this.selectedFrameidx = 0;
  this.selectedFrame = this.frames[this.selectedFrameidx];
  disableButton(0,1);
  enableButton(3,4);
}

function lastFrame(){
  this.selectedFrameidx = this.frames.length-1;
  this.selectedFrame = this.frames[this.selectedFrameidx];
  disableButton(3,4);
  enableButton(0,1);
}

function nextFrame(){
  if(this.selectedFrameidx != this.frames.length - 1){
    this.selectedFrameidx++;
  }
  this.selectedFrame = this.frames[this.selectedFrameidx];
  if(this.selectedFrameidx == this.frames.length-1){
    disableButton(3,4);
    paused = true;
  }
  enableButton(0,1);
}

function prevFrame(){
  if(this.selectedFrameidx != 0){
    this.selectedFrameidx--;
  }
  this.selectedFrame = this.frames[this.selectedFrameidx];
  if(this.selectedFrameidx == 0){
    disableButton(0,1);
  }
  enableButton(3,4);
}

function showFirst(){
  steps.selectFirst();
  steps.loadFrame();
  paused = true;
}

function showLast(){
  steps.selectLast();
  steps.loadFrame();
  paused = true;
}

function showNext(){
  steps.selectNext();
  steps.loadFrame();
}

function showPrev(){
  if(steps.selectedFrameidx == 0){
    return;
  }
  steps.selectPrev();
  steps.loadFrame();
}

function compileMinimax(){
  if(!isTree(root)){
    alert("Primero debe asignar valores a todos los nodos hoja.");
    return;
  }
  isEditing = false;
  showButtons();
  disableButton(0,1);
  enableButton(3,4);
  drawTreeCode(toTreeCode(root));
  initSteps();

  const startTime = performance.now(); // Start time

  //console.log(steps);
  //steps.loadFrame();
  compileMinimaxHelper(root, root, steps);//the first frame holds the starting configuration

  const endTime = performance.now(); // End time
  const executionTime = endTime - startTime; // Calculate execution time
  displayExecutionTime('Minimax', executionTime); // Display execution time

  root.status = SEARCHED;
  steps.addFrame(new Frame(root));

  //Reset the tree to its original state
  isEditing = true;
  document.getElementById("drawing").addEventListener('mousedown', (e) => { mouseClick(e); }, false);
}

function compileMinimaxHelper(tree, selectedNode, frames){
  selectedNode.status = BOLD;
  if(selectedNode.parent != null){
    selectedNode.parent.status = SEARCHING;
  }
  frames.addFrame(new Frame(tree));
  for(var i = 0; i < selectedNode.children.length; i++){
    var nextNode = selectedNode.children[i];
    compileMinimaxHelper(tree,nextNode,frames);
    if(selectedNode.type == MAXIE){
      if(selectedNode.val == null){
        selectedNode.val = Number.NEGATIVE_INFINITY;
      }
      let previousVal = selectedNode.val;
      selectedNode.val = Math.max(selectedNode.val, nextNode.val);
      if (selectedNode.val !== previousVal) {
        selectedNode.explanation = `${selectedNode.val} > ${previousVal}, cambia.`;
      } else {
          selectedNode.explanation = `${nextNode.val} <= ${selectedNode.val}, no cambia.`;
      }      
    }
    if(selectedNode.type == MINNIE){
      if(selectedNode.val == null){
        selectedNode.val = Number.POSITIVE_INFINITY;
      }
      let previousVal = selectedNode.val;
      selectedNode.val = Math.min(selectedNode.val, nextNode.val);
      if (selectedNode.val !== previousVal) {
        selectedNode.explanation = `${selectedNode.val} < ${previousVal}, cambia.`;
      } else {
          selectedNode.explanation = `${nextNode.val} >= ${selectedNode.val}, no cambia.`;
      }      
    }
    nextNode.status = SEARCHED;
    selectedNode.status = BOLD;
    frames.addFrame(new Frame(tree));
  }
}

function compileAlphaBeta(){
  if(!isTree(root)){
    alert("Primero debe asignar valores a todos los nodos hoja.");
    return;
  }
  isEditing = false;
  showButtons();
  disableButton(0,1);
  enableButton(3,4);
  drawTreeCode(toTreeCode(root));
  initSteps();

  const startTime = performance.now(); // Start time

  //console.log(steps);
  //steps.loadFrame();
  compileAlphaBetaHelper(root, root, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, steps);//the first frame holds the starting configuration

  const endTime = performance.now(); // End time
  const executionTime = endTime - startTime; // Calculate execution time
  displayExecutionTime('Alpha-Beta', executionTime); // Display execution time

  if(root.status != PRUNED){
    root.status = SEARCHED;
    steps.addFrame(new Frame(root));
  }
  else{
    steps.addFrame(new Frame(root));
    root.status = SEARCHED;
    steps.addFrame(new Frame(root));
  }

  //Reset the tree to its original state
  isEditing = true;
  document.getElementById("drawing").addEventListener('mousedown', (e) => { mouseClick(e); }, false);

}

function compileAlphaBetaHelper(tree,selectedNode,alpha,beta,frames){
  selectedNode.status = BOLD;
  selectedNode.alpha = alpha;
  selectedNode.beta = beta;
  if(selectedNode.parent != null){
    selectedNode.parent.status = SEARCHING;
  }
  frames.addFrame(new Frame(tree));
  var i = 0;
  var pruneRest = false;
  while(i < selectedNode.children.length && !pruneRest){
    var treeInstr = null;
    var nextNode = selectedNode.children[i];
    selectedNode.alphabetas[i] = [selectedNode.alpha, selectedNode.beta];
    compileAlphaBetaHelper(tree,nextNode,selectedNode.alpha,selectedNode.beta,frames);

    if(selectedNode.type == MAXIE){
      if(selectedNode.val == null){
        selectedNode.val = Number.NEGATIVE_INFINITY;
      }
      selectedNode.val = Math.max(selectedNode.val, nextNode.val);
      if(nextNode.val >= selectedNode.beta){
        //We're maxie, so we prune.
        tableInstr = [0,2];
        pruneRest = true;
        selectedNode.alpha = nextNode.val; // Actualizar alfa
      }
      else if(nextNode.val > selectedNode.alpha){
        tableInstr = [0,1];
        selectedNode.alpha = nextNode.val;
      }
      else{
        tableInstr = [0,0];
      }
    }

    if(selectedNode.type == MINNIE){
      if(selectedNode.val == null){
        selectedNode.val = Number.POSITIVE_INFINITY;
      }
      selectedNode.val = Math.min(selectedNode.val, nextNode.val);
      if(nextNode.val <= selectedNode.alpha){
        //We're minnie, so we prune.
        tableInstr = [1,0];
        pruneRest = true;
        selectedNode.beta = nextNode.val; // Actualizar beta
      }
      else if(nextNode.val < selectedNode.beta){
        tableInstr = [1,1];
        selectedNode.beta = nextNode.val;
      }
      else{
        tableInstr = [1,2];
      }
    }
    if(nextNode.status != PRUNED){
      nextNode.status = SEARCHED;
    }
    selectedNode.status = BOLD;
    frames.addFrame(new Frame(tree,tableInstr));
    i++;
  }
  //now, add the pruning frame
  while(i < selectedNode.children.length){
    discardFrom(selectedNode.children[i]);
    i++;
  }
  if(pruneRest){
    frames.addFrame(new Frame(tree));
    selectedNode.status = PRUNED;
  }
}

function discardFrom(rootNode){
  rootNode.status = DISCARDED;
  for(var i = 0; i < rootNode.children.length; i++){
    discardFrom(rootNode.children[i]);
  }
}

function playBtnClick(){
  if(paused && steps.selectedFrameidx != steps.frames.length - 1){
    paused = false;
    //disable the dropdown buttons
    disableNavbar();
    disableButton(1,3);
    //rename the button
    $("#button2").text("Pause");
    animate();
  }
  else{
    paused = true;
    enableNavbar();
    enableButton(1);
    if(steps.selectedFrameidx != steps.frames.length - 1){
      enableButton(3);
    }
    //rename the button
    $("#button2").text("Play");
    // Reactivar eventos después de la pausa
    if (isEditing) {
      document.getElementById("drawing").addEventListener('mousedown', (e) => { mouseClick(e); }, false);
    }
  }
}

function animate(){
  showNext();
  if(paused || steps.selectedFrameidx == steps.frames.length - 1){
    $("#button2").text("Play");
    enableNavbar();
    enableButton(1);
    if(steps.selectedFrameidx == steps.frames.length - 1){
      disableButton(3);
      hideButtons();//hide the dropdown buttons
    }
    // Reactivar eventos tras la animación
    if (isEditing) {
      document.getElementById("drawing").addEventListener('mousedown', (e) => { mouseClick(e); }, false);
    }    
    return;
  }
  setSpeed(parseFloat(document.getElementById("speed").options[document.getElementById("speed").selectedIndex].value));
  disableButton(1);
  // request another animation loop
  var frameTime = 1500/speed;
  setTimeout(() => {
    requestAnimationFrame(animate);
  }, frameTime);
}



function setSpeed(rate){
  speed = rate;
}

function displayExecutionTime(algorithm, time) {
  const executionTimeElement = document.getElementById('executionTime');
  executionTimeElement.innerHTML = `${algorithm} Tiempo de ejecución: ${time.toFixed(2)} ms`;
}