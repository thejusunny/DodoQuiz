class animation {
  constructor(obj, textObj = null) {
    this.duration = null;
    this.startTime = null;
    this.obj = obj;
    this.units = null;
    this.changeHeight = this.changeHeight.bind(this);
    this.changeBottomPivot = this.changeBottomPivot.bind(this);
    this.changeWidth = this.changeWidth.bind(this);
    this.calculateValue = this.calculateValue.bind(this);
    this.calculateColor = this.calculateColor.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.offset = { start: 0, end: 0 };
    this.textObj = textObj;
    this.callback = null;
    this.isPlaying = true;
    this.currentLoop = 0;
    this.loopingData = null;
    this.progress = 0;
  }
  changeHeight(time) {
    if (!this.isPlaying) return;
    const value = this.calculateValue(time);
    this.obj.style.height = value.prefixedValue;
    if (this.textObj) {
      this.textObj.textContent = value.orginalValue.toFixed(1) + this.units;
    }
    if (this.offset.end > this.offset.start) {
      if (value.orginalValue < this.offset.end) {
        requestAnimationFrame(this.changeHeight);
      } else if (this.callback != null) this.callback();
    } else {
      if (value.orginalValue > this.offset.end) {
        requestAnimationFrame(this.changeHeight);
      } else if (this.callback != null) this.callback();
    }
  }
  changeBottomPivot(time) {
    if (!this.isPlaying) return;
    const value = this.calculateValue(time);
    this.obj.style.bottom = value.prefixedValue;
    if (this.textObj) {
      this.textObj.textContent = value.orginalValue.toFixed(1) + this.units;
    }
    if (value.orginalValue < this.offset.end) {
      requestAnimationFrame(this.changeBottomPivot);
    }
  }
  changeWidth(time) {
    if (!this.isPlaying) return;
    const value = this.calculateValue(time);
    this.obj.style.width = value.prefixedValue;
    if (this.textObj) {
      this.textObj.textContent = value.orginalValue.toFixed(1) + this.units;
    }
    if (this.offset.end > this.offset.start) {
      if (value.orginalValue < this.offset.end) {
        requestAnimationFrame(this.changeWidth);
      }
    } else {
      if (value.orginalValue > this.offset.end) {
        console.log(value.orginalValue);
        requestAnimationFrame(this.changeWidth);
      }
    }
  }
  changeColor(time) {
    if (!this.isPlaying) return;
    const value = this.calculateColor(time);
    this.obj.style.backgroundColor = `#${value.color.toString(16)}`;

    if (this.loopingData != null) {
      //console.log("Not Null");
      if (this.loopingData.infinite) {
        if (value.progress >= 1) {
          this.startTime = time;
        }
        requestAnimationFrame(this.changeColor);
      } else {
        //console.log("Loops"+value.progress);
        if (value.progress >= 1) {
          if (this.currentLoop < this.loopingData.loops) {
            this.startTime = time;
            requestAnimationFrame(this.changeColor);
            this.currentLoop++;
          } else {
            this.isPlaying = false;
            console.log("Last frame" + this.obj.style.backgroundColor);
            this.obj.style.backgroundColor = hex0xToRgb(this.offset.end);
            console.log(hex0xToRgb(this.offset.end));
            if (this.callback != null) this.callback();
          }
        } else {
          requestAnimationFrame(this.changeColor);
        }
      }
    } else {
      if (value.progress < 1) {
        requestAnimationFrame(this.changeColor);
      } else {
        this.isPlaying = false;
        if (this.callback != null) this.callback();
      }
    }
  }
  calculateValue(time) {
    const mills = this.duration * 1000;
    if (!this.startTime) {
      this.startTime = time;
    }
    const elapsedTime = time - this.startTime;
    this.progress = elapsedTime/mills;
    const dir = Math.sign(this.offset.end - this.offset.start);
    const value =
      this.offset.start +
      dir *
        (elapsedTime / mills) *
        Math.abs(this.offset.end - this.offset.start);
    return { orginalValue: value, prefixedValue: value + this.units };
  }
  calculateColor(time) {
    const mills = this.duration * 1000;
    if (!this.startTime) {
      this.startTime = time;
    }
    const elapsedTime = time - this.startTime;
    const t = elapsedTime / mills;
    this.progress = t;
    const value = this.lerpColor(this.offset.start, this.offset.end, t);
    return { color: value, progress: t };
  }
  animateHeight(duration, offset, callback = null, units = "%") {
    this.duration = duration;
    this.offset = offset;
    this.units = units;
    this.callback = callback;
    requestAnimationFrame(this.changeHeight);
  }
  animateWidth(duration, offset, units = "%") {
    this.duration = duration;
    this.offset = offset;
    this.units = units;
    requestAnimationFrame(this.changeWidth);
  }
  animateBottomPivot(duration, offset, units = "%") {
    this.duration = duration;
    this.units = units;
    this.offset = offset;
    requestAnimationFrame(this.changeBottomPivot);
  }
  animatecolor(duration, colorOffset, loopData = null, callback = null) {
    this.duration = duration;
    this.offset = colorOffset;
    this.loopingData = loopData;
    this.loopCount = 0;
    this.callback = callback;
    requestAnimationFrame(this.changeColor);
  }
  pause() {
    this.isPlaying = false;
  }
  play() {
    this.isPlaying = true;
  }
  lerpColor(colorA, colorB, t) {
    // Ensure t is in the range [0, 1]
    t = Math.max(0, Math.min(1, t));

    // Extract the red, green, and blue components of colorA and colorB
    const rA = colorA >> 16;
    const gA = (colorA >> 8) & 0xff;
    const bA = colorA & 0xff;

    const rB = colorB >> 16;
    const gB = (colorB >> 8) & 0xff;
    const bB = colorB & 0xff;

    // Interpolate each component
    const r = Math.round(rA + (rB - rA) * t);
    const g = Math.round(gA + (gB - gA) * t);
    const b = Math.round(bA + (bB - bA) * t);

    // Combine the interpolated components into a single color value
    return (r << 16) | (g << 8) | b;
  }
}
class QuizData {
  constructor(mainData) {
    this.mainData = mainData;
    this.quizItems = new Array();
    for (let index = 0; index < this.mainData.questions.length; index++) {
      const quiz = {
        question: this.mainData.questions[index],
        options: this.mainData.options[index],
        image: this.mainData.images[index],
        answer: this.mainData.answers[index],
        rewards: this.mainData.rewards[index],
      };
      this.quizItems.push(quiz);
    }
  }
  getAll() {
    return this.quizItems;
  }
  getQuizAt(index) {
    return this.quizItems[index];
  }
}
class PlayerScore
{
    constructor()
    {
        this.time = new Array();
        this.correct = 0;
        this.wrong = 0;
        this.coin = 0;
        this.xp = 0;
    }
    addCoin(amount)
    {
        this.coin += Number(amount);
    }
    addXp(amount)
    {
        this.xp += Number(amount);
    }
    addCorrect()
    {
        this.correct += 1;
    }
    addWrong()
    {
        this.wrong += 1;
    }
    addTime(t)
    {
        this.time.push(Number(t));
    }
    averageTime()
    {
        if (this.time.length === 0) {
            return 0; // To avoid division by zero
          }
          const sum = this.time.reduce((total, num) => total + num, 0);
          return (sum / this.time.length).toFixed(2);
    }
}
class User
{
    constructor(userName, point, rank)
    {
        this.userName=userName;
        this.points=point;
        this.rank = rank;
    }

}
class LeaderBoardUsers
{
    constructor(data)
    {
        this.mainData  = data;
        this.users = new Array();
        for (let index = 0; index < this.mainData.name.length; index++) 
        {
            const userName = this.mainData.name[index];
            const point = this.mainData.points[index];
            const rank = this.mainData.rank[index];
            const user = new User(userName, point, rank);
            this.users.push(user);
            console.log(user);
        }
        this.users.sort((a,b)=>a.rank - b.rank);

    }
    getUsers()
    {
        return this.users;
    }
    getOrderedUsers()
    {

    }
}
const mockUsers =
{
    name:
    [
        "Athul",
        "Jhon",
        "Thejus",
        "James",
        "Varun",
    ],
    points:
    [
        "192",
        "140",
        "122",
        "170",
        "167",
    ],
    rank:
    [
        "1",
        "2",
        "3",
        "5",
        "4",
    ],

};
const mockQuizData = {
  questions: [
    "Who is developed GTA 5?",
    "Who is the lead character in GTA 5?",
    "What is the name of this anime?",
    "Who is the actor below?"
  ],
  options: [
    ["EA sports", "Blizzard", "Rockstar Games", "Ubisoft"],
    ["Trevor", "Michael","Franklin", "Glyn"],
    ["One piece", "Naruto", "Shingek ino Kyojin", "Jujitsu Kaisan"],
    ["Jhonny Depp", "BrockLesnar", "Brook", "Dwayne Jhonson"],
  ],
  answers: [3, 2, 4,1],
  images: [
    "https://assets.xboxservices.com/assets/0b/17/0b179504-412d-4af7-9e00-3e3d92633577.jpg?n=GTA-V_GLP-Page-Hero-1084_1920x1080.jpg",
    "https://news.xbox.com/en-us/wp-content/uploads/sites/2/2021/12/GTAO_Contract_Launch_MSFT_YTthumbnail_1920x1080.jpg",
    "https://static.bandainamcoent.eu/high/jujutsu-kaisen/jujutsu-kaisen-cursed-clash/00-page-setup/JJK-header-mobile2.jpg",
    "https://res.cloudinary.com/jerrick/image/upload/v1684913593/646dbdb8fccd75001d86d6e9.jpg",
  ],
  rewards: [
    ["10", "100"],
    ["20", "100"],
    ["5", "200"],
    ["5", "100"],
  ],
};
const quizDataElements = new Map([
  ["coin-txt", "l-coin-quiz"],
  ["xp-txt", "l-xp-quiz"],
  ["meterbg-img", "img-meterbg1-quiz"],
  ["meterfill-img", "img-meterfill1-quiz"],
  ["question-txt", "l-question-quiz"],
  ["image-img", "img-main-quiz"],
  ["option1-btn", "btn-choice1-quiz"],
  ["option2-btn", "btn-choice2-quiz"],
  ["option3-btn", "btn-choice3-quiz"],
  ["option4-btn", "btn-choice4-quiz"],
  ["option1-txt", "l-option1-quiz"],
  ["option2-txt", "l-option2-quiz"],
  ["option3-txt", "l-option3-quiz"],
  ["option4-txt", "l-option4-quiz"],
  ["meterfill-img", "img-meterfill-quiz"],
  ["options-div", "div-options-quiz"],
  ["timestats-txt", "l-time-summary"],
  ["correctstats-txt", "l-correct-summary"],
  ["wrongstats-txt", "l-wrong-summary"],
  ["coinstats-txt", "l-coins-summary"],
  ["xpstats-txt", "l-xp-summary"],
  ["playerscore-txt", "l-yourscore-summary"],
  
]);
const startPrompts =[
    "1",
    "2",
    "3",
    "Start!",
]
const promptText = document.getElementById('l-prompt-quiz');
let count = 0;
let promptInterval = setInterval(()=>{

    promptText.textContent = startPrompts[count];
    if(count>=startPrompts.length)
    {
        clearInterval(promptInterval);
        startQuiz();
        return;
    }
    count++;
}, 1000);

/*
(c/tq * 0.5/avgt)*c1+ 0.2/avgt*5;  
3/3 * 1* 20 + 1*15;
20+ 15 =35
3/3 * 0.5* 20 + 0.5*8 
10+4 = 14

*/

const correctConstant = 200;
const quizData = new QuizData(mockQuizData);
const leaderBoardUsers = new LeaderBoardUsers(mockUsers);
const playerScore = new  PlayerScore(); 
const overlayElement = document.getElementById("overlay");
//overlayElement.addEventListener("click", startQuiz);
var meterFillAnimation = null;
const quizDuration = 5;
function startQuiz() {
  overlayElement.style.display = "none";
  setupQuiz();
}
let colorChangeTimeout = null;
function setupQuiz() {
  const meterFillImg = getElementsFromCurrentPage("meterfill-img");
  const btn1 = getElementsFromCurrentPage("option1-btn");
  btn1.addEventListener("click", () => {
    OptionSelected(1, btn1);
  });

  const btn2 = getElementsFromCurrentPage("option2-btn");
  btn2.addEventListener("click", () => {
    OptionSelected(2, btn2);
  });

  const btn3 = getElementsFromCurrentPage("option3-btn");
  btn3.addEventListener("click", () => {
    OptionSelected(3, btn3);
  });

  const btn4 = getElementsFromCurrentPage("option4-btn");
  btn4.addEventListener("click", () => {
    OptionSelected(4, btn4);
  });

  meterFillAnimation = new animation(meterFillImg);
  meterFillAnimation.animateHeight(quizDuration, { start: 100, end: 0.01 }, () => {
    meterFillAnimation.pause();
    timerRanOut();
  });
    const meterColorChangeAnimation = new animation(meterFillImg);
   colorChangeTimeout =  setTimeout(() => {
        meterFillImg.style.backgroundColor ='red';
    }, (quizDuration*1000)*0.7);
    // meterColorChangeAnimation.animatecolor(0.5,
    //     {
    //         start:rgbToHex({ red: 0, green: 0, blue: 128 }),
    //         end:rgbToHex({ red: 220, green: 0, blue: 0 })
    //     },
    // );
    // meterFillImg.style.backgroundColor =
    
}
function startNextQuiz() {
  if (currentPage >= noOfQuiz - 1) {
    scrollToNext();
    updateSummaryUI();
    return;
  }
  scrollToNext();
  setupQuiz();
}
function timerRanOut() {
  startNextQuiz();
}
function OptionSelected(index, button) {
  meterFillAnimation?.pause();
  clearTimeout(colorChangeTimeout);
  console.log("Selected" + index);
  const scaleAnimation = new animation(button);
//   button.style.width = 47.5 + "%";
//   button.style.height = 38 + "%";
  const quizElement = quizData.getQuizAt(currentPage);
  const bgDiv = button.querySelector("div");
  if (index == quizElement.answer) {
    bgDiv.style.backgroundColor = "green";
    setTimeout(() => {
      startNextQuiz();
    }, 1000);
    disableOptions();
    playerScore.addCorrect();
    playerScore.addCoin(quizElement.rewards[0]);
    playerScore.addXp(quizElement.rewards[1]);
    playerScore.addTime( meterFillAnimation.progress* quizDuration);
  } 
  else 
  {
    playerScore.addWrong();
    playerScore.addTime( quizDuration);
    bgDiv.style.backgroundColor = "red";
    const correctButton = getElementsFromCurrentPage(
      "option" + quizElement.answer + "-btn"
    );
    const correctBg = correctButton.querySelector("div");
    const startColor = { red: 229, green: 235, blue: 231 };
    //correctBg.style.backgroundColor ='green';
    const bgAnim = new animation(correctBg);
    bgAnim.animatecolor(
      0.75,
      {
        start: rgbToHex(startColor),
        end: rgbToHex({ red: 0, green: 128, blue: 0 }),
      },
      { infinite: false, loops: 2 },
      () => {
        startNextQuiz();
      }
    );
    disableOptions();
  }
}
function disableOptions() {
  const div = getElementsFromCurrentPage("options-div");
  div.style.pointerEvents = "none";
}

function rgbToHex(color) {
  // Ensure that the RGB values are within the valid range (0-255)
  color.red = Math.min(255, Math.max(0, color.red));
  color.green = Math.min(255, Math.max(0, color.green));
  color.blue = Math.min(255, Math.max(0, color.blue));

  // Convert each RGB component to a two-digit hexadecimal string
  const redHex = color.red.toString(16).padStart(2, "0");
  const greenHex = color.green.toString(16).padStart(2, "0");
  const blueHex = color.blue.toString(16).padStart(2, "0");

  // Combine the hexadecimal components to form the full hex color code
  const hexColor = `0x${redHex}${greenHex}${blueHex}`;

  return hexColor;
}
function hex0xToRgb(hex0x) {
  // Extract the red, green, and blue components from the 0xRRGGBB value
  const red = (hex0x >> 16) & 0xff;
  const green = (hex0x >> 8) & 0xff;
  const blue = hex0x & 0xff;

  return `rgb(${red}, ${green}, ${blue})`;
}
const rootContainer = document.getElementById("root-page");
const quizContainer = document.getElementById("quiz-page");
const summaryContainer = document.getElementById("quiz-summary-page");
const noOfQuiz = 4;

createQuizPages();
const pages = new Array();
function updateSummaryUI()
{
    const timeText = getElementsFromCurrentPage('timestats-txt');
    const scoreText = getElementsFromCurrentPage('playerscore-txt');
    const coinText = getElementsFromCurrentPage('coinstats-txt');
    const xpText = getElementsFromCurrentPage('xpstats-txt');
    const correctText = getElementsFromCurrentPage('correctstats-txt');
    const wrongText = getElementsFromCurrentPage('wrongstats-txt');
    timeText.textContent = playerScore.averageTime();
    coinText.textContent = playerScore.coin;
    xpText.textContent = playerScore.xp;
    correctText.textContent = playerScore.correct;
    wrongText.textContent = playerScore.wrong;
    scoreText.textContent = GetScore().toFixed(1);
}
function GetScore()
{
    const score = (playerScore.correct/noOfQuiz)* (0.5/ playerScore.averageTime())* (correctConstant+ (0.1/playerScore.averageTime())* correctConstant*0.25)
    return isNaN(score)?0:score;
}
function createQuizPages() {
  for (let index = 0; index < noOfQuiz; index++) {
    var clonedNode = quizContainer.cloneNode(true);
    for (const [K, V] of quizDataElements) {
      const currentId = V;
      //console.log(currentId);
      const element = clonedNode.querySelector("#" + currentId);
      if (element) element.id = currentId + index;
    }
    const quizItem = quizData.getQuizAt(index);
    console.log(quizItem);
    const questionText = GetDataElementInPage(
      clonedNode,
      index,
      "question-txt"
    );
    questionText.textContent = quizItem.question;

    const optionText1 = GetDataElementInPage(clonedNode, index, "option1-txt");
    optionText1.textContent = quizItem.options[0];

    const optionText2 = GetDataElementInPage(clonedNode, index, "option2-txt");
    optionText2.textContent = quizItem.options[1];

    const optionText3 = GetDataElementInPage(clonedNode, index, "option3-txt");
    optionText3.textContent = quizItem.options[2];

    const optionText4 = GetDataElementInPage(clonedNode, index, "option4-txt");
    optionText4.textContent = quizItem.options[3];

    const coinText = GetDataElementInPage(clonedNode, index, "coin-txt");
    coinText.textContent = quizItem.rewards[0];

    const xpText = GetDataElementInPage(clonedNode, index, "xp-txt");
    xpText.textContent = quizItem.rewards[1];

    const image = GetDataElementInPage(clonedNode, index, "image-img");
    image.src = quizItem.image;

    clonedNode.id = "quiz-page" + index;
    rootContainer.insertBefore(clonedNode, summaryContainer);
    //pages.push(clonedNode);
  }
  quizContainer.style.display = "none";
}
function GetDataElementInPage(page, index, name) {
  const element = page.querySelector("#" + quizDataElements.get(name) + index);
  return element;
}
function getElementsFromCurrentPage(name) {
  const page = GetPage(currentPage);
  
  const element = currentPage<noOfQuiz? page.querySelector(
    "#" + quizDataElements.get(name) + currentPage
  ):  page.querySelector(
    "#" + quizDataElements.get(name));
  return element;
}
function GetPage(index) {
  if(index>=noOfQuiz)
  {
    return document.getElementById("quiz-summary-page");
  }
  return document.getElementById("quiz-page" + index);
}
function getCurrentQuiz()
{
    return quizData.getQuizAt(currentPage);
}
let currentPage = 0;
let scrollPosition = 0;
// scrollToPage(3);
function scrollToPage(page) {
  scrollPosition = page * window.innerWidth;
  rootContainer.scrollTo({ left: scrollPosition, behavior: "smooth" });
}
function scrollToNext() {
  currentPage = Math.min(noOfQuiz, currentPage+1);
  scrollPosition = currentPage * window.innerWidth;
  rootContainer.scrollTo({ left: scrollPosition, behavior: "smooth" });
}
//setTimeout(scrollBack,5000);
function scrollBack() {
  scrollToPage(0);
}
