/*0.将游戏面板的 DOM Element 保存到一个数组里*/
var table = [[], [], [], [], [], [], [], [], []];
function bindTable() {
  //获取数组的第一个元素
  var e = document.getElementById("numberGo").firstElementChild;
  for(var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      table[i].push(e);
      //指定元素之后的下一个兄弟元素
      e = e.nextElementSibling;
    }
  }
}

/*1.棋盘数据*/
var sudoku = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

/*1.1将 1-9 随机排序后，填充到sudoku数组中的指定位置*/
var a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
/*为sort方法产生随机的排序参数*/
var randomComparator = function (a, b) {
  return 0.5 - Math.random();
};
function setBlockRandomly(n) {
  var startRow = Math.floor((n - 1) / 3) * 3;
  var startCol = (n - 1) % 3 * 3;
  a.sort(randomComparator);
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      sudoku[startRow + i][startCol + j] = a[i * 3 + j];
    }
  }
}

/*1.2 数独游戏算法==每行,每列，每宫各自只能用一次1-9的数字不能重复*/
/*列算法*/
function checkColumn(col, x) {
  for (var i = 0; i < 9; i++) {
    if (sudoku[i][col] === x) {
      return false;
    }
  }
  // console.log("check column true");
  return true;
}
/*行算法*/
function checkRow(row, x) {
  for (var j = 0; j < 9; j++) {
    if (sudoku[row][j] === x) {
      return false;
    }
  }
  // console.log("check row true");
  return true;
}
/*宫算法*/
function checkBlock(row, col, x) {
  var startRow = Math.floor(row / 3) * 3;
  var startCol = Math.floor(col / 3) * 3;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (sudoku[startRow + i][startCol + j] === x) {
        return false;
      }
    }
  }
  // console.log("check block true");
  return true;
}
/*检测行列宫是否都符合规则*/
function check(i, j, x) {
  return checkRow(i, x) && checkColumn(j, x) && checkBlock(i, j, x);
}

function columnOK(col) {
  var sum = 0;
  for (var i = 0; i < 9; i++) {
    sum += sudoku[i][col];
  }
  return sum === 45;
}

function columnsOK() {
  for (var j = 0; j < 9; j++) {
    if (!columnOK(j)) {
      return false;
    }
  }
  return true;
}

function rowOK(row) {
  var sum = 0;
  for (var j = 0; j < 9; j++) {
    sum += sudoku[row][j];
  }
  return sum === 45;
}

function rowsOK() {
  for (var i = 0; i < 9; i++) {
    if (!rowOK(i)) {
      return false;
    }
  }
  return true;
}

function blockOK(n) {
  var startRow = Math.floor((n - 1) / 3) * 3;
  var startCol = (n - 1) % 3 * 3;
  var sum = 0;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      sum += sudoku[startRow + i][startCol + j];
    }
  }
  return sum === 45;
}

function blocksOK() {
  for (var i = 1; i <= 9; i++) {
    if (!blockOK(i)) {
      return false;
    }
  }
  return true;
}

function sudokuOK() {
  return columnsOK() && rowsOK() && blocksOK();
}

function tryit(i, j) {
  if (i >= 9) {
    return true;
  }
  var s = i;
  var t = j + 1;
  if (t >= 9) {
    t -= 9;
    s++;
  }
  if (sudoku[i][j] !== 0) {
    var success = tryit(s, t);
    if (success) {
      return true;
    }
  }

  for (var k = 0; k < 9; k++) {
    if (check(i, j, a[k])) {
      sudoku[i][j] = a[k];
      var success = tryit(s, t);
      if (success) {
        return true;
      }
      sudoku[i][j] = 0;
    }
  }
  return false;
}

/*1.3 保存一份sudoku的数据，因为在后续操作会将数据随机挖空*/
var answer = [[], [], [], [], [], [], [], [], []];
function copy(arr) {
  var a = [[], [], [], [], [], [], [], [], []];
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      a[i].push(arr[i][j]);
    }
  }
  return a;
}

// 初始化程序
function createSudoku() {
  clear(sudoku); // 把 sudoku 的值都赋值为 0
  // 随机填充编号为 3, 5, 7 的 block
  // 因为这三个 block 值不相关, 因此可以随机填充
  // 以减少搜索次数
  setBlockRandomly(3);
  setBlockRandomly(5);
  setBlockRandomly(7);
  a.sort(randomComparator);
  var success = tryit(0, 0);
  return success;
}
// 数组初始化为0
function clear(arr) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      arr[i][j] = 0;
    }
  }
}

/*1.4 每行随机挖去几个数，挖的个数与难度有关*/
/*1.4.1 设置难度*/
// 简单
var difficulty = 3;
// 每行随机挖去几个数
function createGame() {
  while (!createSudoku());
  // 在随机挖空之前保存一份数据作为以后比对正确答案使用
  answer = copy(sudoku);
  console.log(answer)
  // 每行随机挖去几个数，挖的个数与难度有关
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < difficulty + Math.floor(Math.random() * 2); j++) {
      sudoku[i][Math.floor(Math.random() * 9)] = 0;
    }
  }
}

/*2.把二维数组 sudoku 中的数据设置到游戏面板上*/
function setTable(a) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (a[i][j] !== 0) {
        //预填数
        table[i][j].value = a[i][j];
        // 当该input有值时,输入字段为只读
        table[i][j].readOnly = true;
      }else {
      	// 将i，j保存作为以后的数组坐标使用
      	table[i][j].x = i;
        table[i][j].y = j;
        table[i][j].readOnly = false;
        // 自填数
        table[i][j].value = '';
        table[i][j].maxLength = 1;
        table[i][j].onchange = function() {
          self = this;
          onInput(self, this.x, this.y)
        };
      }
    }
  }
}

/*2.1 处理输入*/
//ele: 元素, abscissa: 横坐标, ordinate: 列坐标
function onInput(ele, abscissa, ordinate) {
  //ele.value是一个字符串类型的数组，需要转为数值类型的数字
  var value = parseInt(ele.value);
  //检验数据是否合法
  if (check(abscissa, ordinate, value)) {
    sudoku[abscissa][ordinate] = value;
  } else {
    alert('答错了，请换一个号码');
    ele.value = "";
  }
  // 检查数独是否完成
  if (sudokuOK()) {
    gameOver();
  }
}

/*3 完成游戏后的业务逻辑*/
// 开始游戏
function gameStart() {
  endTimer();
  change();
  startTimer();
}

// 换一个数独
function change() {
  createGame();
  setTable(sudoku);
}
// 暂停时间
function endTimer() {
  countTime = false;
  clearTimeout(timerId);
}

//完成游戏
function gameOver() {
  endTimer();
  var restart = confirm('祝贺你!你已经完成了这个sudoku，点击ok开始一个新的游戏');
  if(restart) {
    gameStart();
  }
}

//查看答案
function showAnswer() {
  setTable(answer);
  endTimer();
}

/*4.计时器*/
var timeStart;
var countTime = false;
var timeArea;
var count = 0;
var timerId = -1;

function pad(i) {
  if (i < 10) {
    return "0" + i;
  }
  return i;
}

function timer() {
  count++;
  countTime = true;
  var m = pad(parseInt(count / 60));
  var s = pad(parseInt(count % 60));
  timeArea.innerHTML = m + " : " + s;
  if (countTime) {
    timerId = setTimeout(timer, 1000);
  }
}

function startTimer() {
  timeStart = new Date();
  countTime = true;
  count = 0;
  timerId = setTimeout(timer, 1000);
}

function endTimer() {
  countTime = false;
  clearTimeout(timerId);
}

(function loading() {
  bindTable()
  timeArea = document.getElementById("timer");
})();
/*计时器*/