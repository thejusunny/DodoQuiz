import { QuizData } from "./quizdata.js";
import { QuizUser } from "./user.js";
import { PlayerScore } from "./quizdata.js";
import { LeaderBoardUsers } from "./quizdata.js";
import { Animation } from "./animation.js";

const quizUser = new QuizUser();

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
  ["clock-img", "img-clock-quiz"],
  ["user1-txt", "l-user1-quiz"],
  ["user2-txt", "l-user2-quiz"],
  ["user3-txt", "l-user3-quiz"],
  
]);
const startPrompts =[
    "3",
    "2",
    "1",
    "Start!",
]
var userDataRecieved = false;
const createUserEndPoint = "https://zgmb05jg6e.execute-api.ap-southeast-1.amazonaws.com/createUser";
setUserDetails({email:'xyz@gmail.com', userName:'Big boy'});
//setUserDetails(null);

//Call this function from flutter webview widget
async function setUserDetails(data)
{
  await createUser(data);
  quizUser.email = data?.email ??'guest@dodonews.app';
  quizUser.userName = data?.userName??'guest';
  userDataRecieved  = true;
  entryPoint();
}
async function createUser(data) {
  // Your asynchronous code here
  if(data!= null && data.email!=null)
  {
    try{
      fetch(createUserEndPoint,{
        method:'POST',
        mode:'cors',
        headers: {
          'content-Type': 'application/json'
        },
        body: JSON.stringify({
          "email": data.email,
          "userName": data.userName,
        })
  
      }).then(response=>{
        if(!response.ok)
        throw new Error('Network response was not ok');
        return response.json();
      }).then(data=>{
        console.log(data);
      })
    } 
    catch(err)
    {
      console.log(err.message);
    } 
   
  }
}


let quizData = new QuizData(mockQuizData);
let url = "https://thejusunny.github.io/DodoQuiz/";
if(!window.location.href.includes('index.html'))
{
  url = window.location.href;
  console.log("Using currentPage URL");
}
else
  console.log("Using default URL"+ url);
quizUser.quizId = url;
const getQuizEndPoint = `https://zgmb05jg6e.execute-api.ap-southeast-1.amazonaws.com/getQuiz?url=${url}`;
fetch(getQuizEndPoint,
  {
    method:'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(resposne=>{
    if(!resposne.ok)
    {
      throw new Error('Network response was not ok');
    }
    return resposne.json();
  }).then(data=>{
    
    quizData = new QuizData(data.quiz);
    createQuizPages();

  });
const rootContainer = document.getElementById("root-page");
const quizContainer = document.getElementById("quiz-page");//Page to be cloned
const summaryContainer = document.getElementById("quiz-summary-page"); // Last page of the quiz/results page
const overlayElement = document.getElementById("overlay");

const noOfQuiz = 4;
const correctConstant = 200;


const leaderBoardUsers = new LeaderBoardUsers(mockUsers);
const playerScore = new  PlayerScore(); 

let clockAnimation;
var meterFillAnimation = null;
const quizDuration = 5;

//entryPoint();// app starts here 
function entryPoint()
{
  //createQuizPages(); //cloning pages 
  const promptText = document.getElementById('l-prompt-quiz');
  let count = 0;
  let promptInterval = setInterval(()=>{

  promptText.textContent = startPrompts[count];
  const fontScaleAnimation = new Animation(promptText);
  const fontOpacityAnimation = new Animation(promptText);
    if (count >= startPrompts.length - 1) {
      fontScaleAnimation.animateFontSize(0.2, { start: 300, end: 500 });
      setTimeout(() => {
        fontOpacityAnimation.animateOpacity(0.5, { start: 1, end: 0 });
      }, 1000);
    } else fontScaleAnimation.animateFontSize(0.5, { start: 600, end: 300 });
    
    fontOpacityAnimation.animateOpacity(0.25, {start:0, end:1});
    if(count>=startPrompts.length)
    {
       
        clearInterval(promptInterval);
        startQuiz();
        return;
    }
    count++;
}, 1500);
}
/*
(c/tq * 0.5/avgt)*c1+ 0.2/avgt*5;  
3/3 * 1* 20 + 1*15;
20+ 15 =35
3/3 * 0.5* 20 + 0.5*8 
10+4 = 14

*/
function startQuiz() 
{
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

  meterFillAnimation = new Animation(meterFillImg);
  meterFillAnimation.animateHeight(quizDuration, { start: 100, end: 0.01 }, () => {
    meterFillAnimation.pause();
    timerRanOut();
  });
   colorChangeTimeout =  setTimeout(() => {
        meterFillImg.style.backgroundColor ='red';
        const clockImg = getElementsFromCurrentPage('clock-img');
        clockAnimation = new Animation(clockImg);
        clockAnimation.animateRotation(0.1,{start:345, end:375}, {infinite:true,loops:0, pingpong: false});
        setTimeout(()=>{
          clockAnimation.pause();
        },3000);
    }, (quizDuration*1000)*0.7);    
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
  clockAnimation?.pause();
  clearTimeout(colorChangeTimeout);
  console.log("Selected" + index);
  const scaleAnimation = new Animation(button);
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
    const bgAnim = new Animation(correctBg);
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
    const user1Text = getElementsFromCurrentPage('user1-txt');
    const user2Text = getElementsFromCurrentPage('user2-txt');
    const user3Text = getElementsFromCurrentPage('user3-txt');
    user2Text.textContent = quizUser.userName;
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


//Utility functions
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
