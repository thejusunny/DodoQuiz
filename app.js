// import { QuizData } from "./quizdata.js";
// import { QuizUser } from "./user.js";
// import { PlayerScore } from "./quizdata.js";
// import { LeaderBoardUsers } from "./quizdata.js";
// import { Animation } from "./animation.js";
let deviceID = localStorage.getItem('deviceID');
if(!deviceID)
{ 
    deviceID = uuid.v4();
    localStorage.setItem('deviceID', deviceID);
}
console.log(deviceID);

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
  name:"DodoQuizGame",
  data:{
    
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
  }
  
};
let quizData = new QuizData(mockQuizData);
let startInstruction = 'None';
let url = "https://thejusunny.github.io/DodoQuiz/";
const splashScreenDuration = 4;
let splashStartTime;
const splashScreen = document.getElementById ("div-splash-quiz");
const currentUser = new QuizUser();
let cachedUserData = null;
const loadingDiv = document.getElementById("div-loading-quiz");
const startDiv = document.getElementById("div-start-quiz");
const overlayElement = document.getElementById("overlay");
const wrongAudioPlayer = document.getElementById('wrong-audio');
const correctAudioPlayer = document.getElementById('correct-audio');
const countDownAudioPlayer = document.getElementById('countdown-audio');
const timerAudioPlayer = document.getElementById('timer-audio');
const goAudioPlayer = document.getElementById('go-audio');
const audioButton = document.getElementById('btn-audiotoggle-quiz');
const audioImage = document.getElementById('img-audio-quiz');
const startButton = document.getElementById('btn-start-quiz');
startButton.addEventListener('click', startButtonClicked);

const audioPlayers = new Array();
audioPlayers.push(wrongAudioPlayer);
audioPlayers.push(correctAudioPlayer);
audioPlayers.push(countDownAudioPlayer);
audioPlayers.push(goAudioPlayer);
audioPlayers.push(timerAudioPlayer);
audioPlayers.forEach(player => {
  player.volume = 0.5;
  player.muted = false;
});

document.addEventListener('visibilitychange', ()=>{
  if(document.hidden)
  {
    audioPlayers.forEach(player => {
      player.muted = true;
    });
  }
  else
  {
    audioPlayers.forEach(player => {
      player.muted = false;
    });
  }
});
function fakePlay()
{
  audioPlayers.forEach(player => {
    player.volume = 0;
    player.play();
  });
  setTimeout(()=>{
    audioPlayers.forEach(player => {
      player.volume = 0.4;
      player.pause();
    });
  },10);
}
let audioEnabled = true;
audioButton.addEventListener('click',()=>{
  audioEnabled = !audioEnabled;
  const volume = audioEnabled?1:0;
  audioPlayers.forEach(audioPlayer => {
    audioPlayer.volume = volume;
  });
  audioImage.src = audioEnabled? "./assets/soundon.png": "./assets/soundoff.png";
});

let leaderBoardUsers ;
const playerScore = new PlayerScore(); 
 
function cacheUserDataLocally(data)
{
  const parsedData = data;
  //const parsedData = JSON.parse(data);
  cachedUserData = parsedData;
  getQuizInformation();
}
/*
userName: string
email: string
image: image/ string
*/
//*******Call this function from flutter webview widget********
function cacheUserDataFromApp(data)
{
  console.log(data);
  // const parsedData = data;
  const parsedData = JSON.parse(data);
  if(parsedData.userName==''|| parsedData.email=='' )
    parsedData = getLocalUserData();
  cachedUserData = parsedData;
  getQuizInformation();
}
function helloWorld()
{
  console.log("HelloWorld");
}
window.helloWorld = helloWorld;
function getLocalUserData()
{
  return {
    email: deviceID+'@guest.com',
    userName: "guest"+deviceID.substring(0,5)
  };
}
const daysLabel = document.getElementById('l-days-quiz');
const hoursLabel = document.getElementById('l-hours-quiz');
const minutesLabel = document.getElementById('l-minutes-quiz');
const quizEndDiv = document.getElementById('div-quizend-quiz');
const millisecondsInSecond = 1000;
const millisecondsInMinute = 60 * millisecondsInSecond;
const millisecondsInHour = 60 * millisecondsInMinute;
const millisecondsInDay = 24 * millisecondsInHour;
let remainingTime = null;
function showRemainingTime()
{
  const localDate = new Date();
  const utcDate = new Date(localDate.toISOString());
  const endDate = new Date(quizData.endDate);
  const timeDifference = endDate - utcDate; 
  
  const days = Math.max( Math.floor(timeDifference / millisecondsInDay),0);
  const hours = Math.max( Math.floor((timeDifference % millisecondsInDay) / millisecondsInHour),0);
  const minutes = Math.max( Math.floor((timeDifference % millisecondsInHour) / millisecondsInMinute),0);
  const seconds = Math.max( Math.floor((timeDifference % millisecondsInMinute) / millisecondsInSecond),0);
  remainingTime = 
  {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
  daysLabel.textContent = remainingTime.days.toString();
  hoursLabel.textContent = remainingTime.hours.toString();
  minutesLabel.textContent = remainingTime.minutes.toString();
  console.log(hasQuizExpired());
}
function hasQuizExpired()
{
  return (remainingTime.days<=0&& remainingTime.hours<=0&& remainingTime.minutes<=0);
}
const lottieBearContainer = document.getElementById('div-lottiebig-quiz');
const lottierLoaderContainer = document.getElementById('div-lottieloader-quiz');
const lottieEndContainer = document.getElementById('div-lottieend-quiz');
loadSplashScreen();
function loadSplashScreen()
 {
    splashStartTime = performance.now();
    const animationConfig1 = {
    container: lottieBearContainer,
    renderer: 'svg', // You can choose 'svg', 'canvas', or 'html'
    loop: true, // Set to true if you want the animation to loop
    autoplay: true, // Set to true if you want the animation to play automatically
    path: './animations/bearanimation.json', // Replace with the path to your Lottie animation JSON file
    };
    const animationConfig2 = {
      container: lottierLoaderContainer,
      renderer: 'svg', // You can choose 'svg', 'canvas', or 'html'
      loop: true, // Set to true if you want the animation to loop
      autoplay: true, // Set to true if you want the animation to play automatically
      path: './animations/loading.json', // Replace with the path to your Lottie animation JSON file
      };
   
    const animation1 = lottie.loadAnimation(animationConfig1);
    const animation2 = lottie.loadAnimation(animationConfig2);
    /* Start the application after user data is cached locally or from flutter app */
    //cacheUserDataFromApp({email:'Albin@example.com', userName:'Albin J'});
    //cacheUserDataLocally(getLocalUserData());
 }
async function getQuizInformation()
{
  if(!window.location.href.includes('index.html'))
  {
    url = window.location.href;
    console.log("Using currentPage URL");
  }
  else
    console.log("Using default URL"+ url);
  currentUser.quizId = url;
  const getQuizEndPoint = `https://zgmb05jg6e.execute-api.ap-southeast-1.amazonaws.com/getQuiz?url=${url}`;
  fetch(getQuizEndPoint,
    {
      method:'GET',
      mode: 'cors',
      headers: {
        'content-Type': 'application/json',
      },
    }).then(resposne=>{
      if(!resposne.ok)
      {
        throw new Error('Network response was not ok');
      }
      return resposne.json();
    }).then(data=>{
      
      quizData = new QuizData(data.quiz);
      noOfQuiz = quizData.getQuizCount();
      console.log(quizData.quizName + " count:"+ noOfQuiz);
      checkForUser();
      showRemainingTime();
      currentUser.email = cachedUserData?.email;
      currentUser.userName = cachedUserData?.userName;
      currentUser.image = cachedUserData?.image;

    });
}

/*auto loading splash screen*/
// let splashTimeElapsed = false;
// let mainDataLoaded  = false;
// const splashInterval = setInterval(()=>{
//   const delta = performance.now()-splashStartTime;
//   if(delta>splashScreenDuration && mainDataLoaded)
//   {
//       splashTimeElapsed = true;
//       splashScreen.style.display ='none';
//       clearInterval(splashInterval);
//       //createQuizPages();
//   }
// }, 200);


function startButtonClicked()
{

  if(startInstruction== StartInstruction.Quiz)
  {
    loadQuiz();
    
  }
  else
  {
    showExistingUserSummary();
  }
  splashScreen.style.display ='none';
}

function loadQuiz()
{
  fakePlay();
  createQuizPages();
  setTimeout(()=>{
    startCountDown();
  },20)
}
function showExistingUserSummary()
{
    overlayElement.style.display = "none"; 
    const quizPage = document.getElementById('quiz-page');
    quizPage.style.display ='none'; 
    noOfQuiz=0;
    //sorterView.splice(1,4);
    console.log(sortedView);
    leaderBoardUsers = new LeaderBoardUsers(quizData);
    if(sortedView.length<3)
    {
      const dummyPlayers = leaderBoardUsers.getDummyPlayers(3-sortedView.length);
      dummyPlayers.forEach(dummy => {
        sortedView.push({userName:dummy.userName, points: dummy.points});
      });
      sortedView.sort((a,b)=> b.points - a.points);
    }
    createLeaderBoardUI();
    scrollToPage(1);
    updateSummaryUI();
}


  //animation2.play();
 


  //setUserDetails({email:'Athul@example.com', userName:'Athul'});
  //setUserDetails(null);
  const getUserEndPoint = "https://zgmb05jg6e.execute-api.ap-southeast-1.amazonaws.com/getUser";
  const getQuizUserEndPoint = "https://zgmb05jg6e.execute-api.ap-southeast-1.amazonaws.com/getQuizUser";
  const deleteUserEndPoint = "https://zgmb05jg6e.execute-api.ap-southeast-1.amazonaws.com/deleteUser";
  const createUserEndPoint = "https://zgmb05jg6e.execute-api.ap-southeast-1.amazonaws.com/createUser";
  const upsertStatsEndPoint = "https://zgmb05jg6e.execute-api.ap-southeast-1.amazonaws.com/upsertQuizStats";
  async function checkForUser()
  {
    const localUser = getLocalUserData();
    //Local user signed in again, or without loggin in
    if(cachedUserData.email == localUser.email)
    {
      const endPoint = `${getUserEndPoint}?email=${cachedUserData.email}`;
      fetch(endPoint,{
        method: 'GET',
        mode:'cors',
      }).then(response=>{
        if(!response.ok)
        throw new Error("Response"+ response.statusText);
        return response.json();
      }).then(data=>{
        const user = data.user;
        if(!user)
        {
          createUser(cachedUserData);
          console.log("Created a local user");
        }
          
      });
      
      fetchAndsortAllQuizUsers();
      return;
    }
    //Check if the new email user exist
    const endPoint = `${getUserEndPoint}?email=${cachedUserData.email}`;
    fetch(endPoint,{
      method: 'GET',
      mode:'cors',
    }).then(response=>{
      if(!response.ok)
      throw new Error("Response"+ response.statusText);
      return response.json();
    }).then(data=>{
      const user = data.user;
      //If the user doesn't exist check if does a guest user account exist 
      if(!user)
      {
        const localUserEndPoint = `${getUserEndPoint}?email=${localUser.email}`;
        fetch(localUserEndPoint,{
          method: 'GET',
          mode:'cors',
          headers :{
            'Content-Type':'Application/json'
          } 
    
        }).then(response=>{
          if(!response.ok)
          throw new error("Response"+ response.statusText);
          return response.json();
        }).then(async data=>{
          const localUser = data.user;
          //if local user exist then update local user.email and userName to the new username and push that to server and delete local user
          if(localUser)
          {
            const oldEmail = localUser.email;
            localUser.email = cachedUserData.email;
            localUser.userName = cachedUserData.userName;
            deleteUser(oldEmail);
            await createUser(localUser);
            fetchAndsortAllQuizUsers();
          }
          else
          {
            await createUser(cachedUserData); // First time logged in user
            fetchAndsortAllQuizUsers();
          }

        })
        //createUser(data);
      }
      else //User exists, don't do anything for now
      {
        console.log("Found");
        fetchAndsortAllQuizUsers();
      }
    });
  }
  function deleteUser(email)
  {
    fetch(deleteUserEndPoint,{
      method:'DELETE',
      mode:'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": email,
      })

    }).then(response=>{
      if(!response.ok)
      throw new Error('Network response was not ok');
      return response.json();
    }).then(data=>{
      console.log(data);
    })
  }
  const StartInstruction =
  {
    Quiz:'Quiz',
    Summary:'Summary',
  }



  function showStartButton(instruction)
  {
    loadingDiv.style.display ='none';
    startDiv.style.display = 'flex';
    startInstruction = instruction;
  }
  function showQuizExpired()
  {
   
    lottieBearContainer.style.display = 'none';
    lottieEndContainer.style.display ='block';
    const animationConfig = {
      container: lottieEndContainer,
      renderer: 'svg', // You can choose 'svg', 'canvas', or 'html'
      loop: true, // Set to true if you want the animation to loop
      autoplay: true, // Set to true if you want the animation to play automatically
      path: './animations/ended.json', // Replace with the path to your Lottie animation JSON file
      };
    const anim =  lottie.loadAnimation(animationConfig);
    anim.play();
    loadingDiv.style.display ='none';
    quizEndDiv.style.display ='flex';
  }
  function checkForUserPresenceInQuiz()
  {
      
    const index = sortedUsers.findIndex((user)=> user.email == currentUser.email);  
    currentUser.rank = index;
    if(hasQuizExpired())
    {
      showQuizExpired();
      return;
    }
    if(index<0)
      {
        console.log("No user found in the same quiz");
        //loadQuiz();
        showStartButton(StartInstruction.Quiz);
      }
      else
      {
        console.log("Found user at rank"+ (index+1));
        const user = sortedUsers[index];
        console.log(user);
        playerScore.points = user.quizStats[0].stats.points;
        playerScore.correct = user.quizStats[0].stats.correct;
        playerScore.wrong = user.quizStats[0].stats.wrong;
        playerScore.coins = user.quizStats[0].stats.coins;
        playerScore.time = user.quizStats[0].stats.time;
        playerScore.xp = user.quizStats[0].stats.xp;
        showStartButton(StartInstruction.Summary);
        //showUserSummary();
      }
      //mainDataLoaded = true;
  }
  async function createUser(data) {
    if(data!= null && data.email!=null)
    {
      try{
        const response = await fetch(createUserEndPoint,{
          method:'POST',
          mode:'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "email": data.email,
            "userName": data.userName,
            "quizStats": data.quizStats || null,
            "pollStats": data.pollStats || null,
          })
    
        });
        
        if(!response.ok)
          throw new Error('Network response was not ok');
        const responseData = await response.json();
        console.log(responseData);
      } 
      catch(err)
      {
        console.log(err.message);
      } 
     
    }
  }
  const getAllQuizUsersEndPoint = "https://zgmb05jg6e.execute-api.ap-southeast-1.amazonaws.com/getQuizUsers";
  let sortedUsers = new Array();
  let sortedView = new Array();
  async function fetchAndsortAllQuizUsers()
  {
    const endPoint = `${getAllQuizUsersEndPoint}?quizName=${quizData.quizName}`;
    fetch(endPoint,
      {
        method:'GET',
        mode:'cors',
        headers:{
          'Content-Type':'application/json',
        }
      }).then(response=>{
        if(!response.ok)
        {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(data=>{
        sortedUsers = data.users;
        sortedUsers.sort((a,b)=> b.quizStats[0].stats.points -a.quizStats[0].stats.points);
        sortedUsers.forEach(sortedUser => {
          const  user = {
            userName:sortedUser.userName,
            email: sortedUser.email,
            points: sortedUser.quizStats[0].stats.points,
          }
          sortedView.push(user);
          console.log(user);
        });
        checkForUserPresenceInQuiz();

      });
  }




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
  ["rank1-txt", "l-rank1-quiz"],
  ["rank2-txt", "l-rank2-quiz"],
  ["rank3-txt", "l-rank3-quiz"],
  ["points1-txt", "l-points1-quiz"],
  ["points2-txt", "l-points2-quiz"],
  ["points3-txt", "l-points3-quiz"],
  ["pp1-img", "img-pp1-quiz"],
  ["pp2-img", "img-pp2-quiz"],
  ["pp3-img", "img-pp3-quiz"],
]);
const startPrompts =[
    "3",
    "2",
    "1",
    "Start!",
]



const rootContainer = document.getElementById("root-page");
const quizContainer = document.getElementById("quiz-page");//Page to be cloned
const summaryContainer = document.getElementById("quiz-summary-page"); // Last page of the quiz/results page


let noOfQuiz = 4;




let clockAnimation;
var meterFillAnimation = null;
let quizDuration = 5;

//entryPoint();// app starts here 
function startCountDown()
{
  //createQuizPages(); //cloning pages 
  const promptText = document.getElementById('l-prompt-quiz');
  let count = 0;
  let promptInterval = setInterval(()=>{

 
  promptText.textContent = startPrompts[count];
  const fontScaleAnimation = new Animation(promptText);
  const fontOpacityAnimation = new Animation(promptText);
    if (count >= startPrompts.length - 1) {
      if(count=== startPrompts.length-1)
        goAudioPlayer.play();
      fontScaleAnimation.animateFontSize(0.2, { start: 300, end: 500 });
      setTimeout(() => {
        fontOpacityAnimation.animateOpacity(0.5, { start: 1, end: 0 });
      }, 1000);
    } else 
    {
      countDownAudioPlayer.play();
      fontScaleAnimation.animateFontSize(0.5, { start: 600, end: 300 });
    }

    
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
  quizDuration = quizData.duration;
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
  //A slight time out so pause doesn;t stop play
  setTimeout(()=>{
    timerAudioPlayer.playbackRate = 1;
    timerAudioPlayer.play();
  },300);
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
    }, (quizDuration*1000)*0.6);    
}
function startNextQuiz() {
  if (currentPage >= noOfQuiz - 1) {
    scrollToNext();
    playerScore.finalizeScore(quizData.getQuizCount());
    const newUser= {userName:currentUser.userName, points:playerScore.points};
    sortedView.push(newUser);
    sortedView.sort((a,b)=> b.points - a.points);
    const index = sortedView.findIndex((user)=> user== newUser);
    leaderBoardUsers = new LeaderBoardUsers(quizData);
    if(sortedView.length<3)
    {
      const dummyPlayers = leaderBoardUsers.getDummyPlayers(3-sortedView.length);
      dummyPlayers.forEach(dummy => {
        sortedView.push({userName:dummy.userName, points: dummy.points});
      });
      sortedView.sort((a,b)=> b.points - a.points);
      
    }
    setTimeout(()=>{
      for(var i=0;i<noOfQuiz;i++)
      {
         const page =  GetPage(i);
         page.style.display = 'none';
      }
    },1000);
    const postScore =
    {
      coins: playerScore.coins,
      xp: playerScore.xp
    }
    createLeaderBoardUI();
    sendRewardsToApp(postScore);
    updateSummaryUI();
    sendUserStatsToServer();
    return;
  }
  scrollToNext();
  setupQuiz();
}
function sendRewardsToApp(score)
{
    window.setRewards?.postMessage(JSON.stringify({coins: playerScore.coins, xp: playerScore.xp}));
}
function timerRanOut() {
  startNextQuiz();
  timerAudioPlayer.pause();
}
function OptionSelected(index, button) {
  meterFillAnimation?.pause();
  clockAnimation?.pause();
  clearTimeout(colorChangeTimeout);
  console.log("Selected" + index);
  timerAudioPlayer.pause();
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
    correctAudioPlayer.play();
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
    wrongAudioPlayer.play();
  }
}
function disableOptions() {
  const div = getElementsFromCurrentPage("options-div");
  div.style.pointerEvents = "none";
}
function sendUserStatsToServer()
{
  const finalUserData =
    {
      email: currentUser.email,
      quizName: quizData.quizName,
      url: url,
      stats:{
        points: playerScore.points,
        correct: playerScore.correct,
        wrong: playerScore.wrong,
        coins: playerScore.coins,
        xp: playerScore.xp,
        time: Number( playerScore.averageTime()),
      }
       
    }
 
  try
  {
    fetch(upsertStatsEndPoint, {
      method: 'PUT',
      headers: 
      {
        'Content-Type':'application/json',
      },
      body: JSON.stringify(finalUserData)
    }).then((response)=>{
      console.log('Put succesful'+ response);
    });
  }
  catch(err)
  {
    console.error("Insertion of stats failed"+err);
  }
 
}
function isAGuestUser()
{
  return currentUser.email == getLocalUserData().email;
}
function sendLoginEvent()
{
  window.loginRequest?.postMessage("login"); 
  console.log('User tried to login');
}
function updateSummaryUI()
{
    
    if(isAGuestUser())
    {
      const loginDiv = document.getElementById('div-login-quiz');
      const loginPromptDiv = document.getElementById('div-loginprompt-quiz')
      const loginButton = document.getElementById('btn-login-quiz');
      loginDiv.style.display ='flex';
      loginPromptDiv.style.display ='flex';
      loginButton.addEventListener('click',sendLoginEvent);
    }
    const timeText = getElementsFromCurrentPage('timestats-txt');

    const coinText = getElementsFromCurrentPage('coinstats-txt');
    const xpText = getElementsFromCurrentPage('xpstats-txt');
    const correctText = getElementsFromCurrentPage('correctstats-txt');
    const wrongText = getElementsFromCurrentPage('wrongstats-txt');

    
    timeText.textContent = playerScore.time +" sec";
    coinText.textContent = playerScore.coins;
    xpText.textContent = playerScore.xp;
    correctText.textContent = playerScore.correct;
    wrongText.textContent = playerScore.wrong;

    const normalizedSortedView = leaderBoardUsers.getNormalizedSortedView();
    const userRank = leaderBoardUsers.getNormalizedUserRank(); //1-3
    const userTexts = new Array();
    const rankTexts = new Array();
    const pointTexts = new Array();
    const profileImages = new Array();
    userTexts.push ( getElementsFromCurrentPage('user1-txt'));
    userTexts.push ( getElementsFromCurrentPage('user2-txt'));
    userTexts.push ( getElementsFromCurrentPage('user3-txt'));
    
    pointTexts.push ( getElementsFromCurrentPage('points1-txt'));
    pointTexts.push ( getElementsFromCurrentPage('points2-txt'));
    pointTexts.push ( getElementsFromCurrentPage('points3-txt'));

    rankTexts.push ( getElementsFromCurrentPage('rank1-txt'));
    rankTexts.push ( getElementsFromCurrentPage('rank2-txt'));
    rankTexts.push ( getElementsFromCurrentPage('rank3-txt'));

    profileImages.push ( getElementsFromCurrentPage('pp1-img'));
    profileImages.push ( getElementsFromCurrentPage('pp2-img'));
    profileImages.push ( getElementsFromCurrentPage('pp3-img'));
    let imageToHighlight = null;
    let textToHightlight = null;
    let rankToHighLight = null;
    let pointsToHighlight = null;
    if(userRank<=1)
    {
      imageToHighlight = profileImages[0];
      textToHightlight = userTexts[0];
      rankToHighLight = rankTexts[0];
      pointsToHighlight = pointTexts[0];
    }
    else if(userRank<=2)
    {
      imageToHighlight =  profileImages[1];
      textToHightlight = userTexts[1];
      rankToHighLight = rankTexts[1];
      pointsToHighlight = pointTexts[1];
    }
    else
    {
      imageToHighlight =  profileImages[2];
      textToHightlight = userTexts[2];
      rankToHighLight = rankTexts[2];
      pointsToHighlight = pointTexts[2];
    }
    // imageToHighlight.style.borderWidth = '2px';
    // imageToHighlight.style.borderColor  = 'royalBlue';
    // imageToHighlight.style.borderStyle  = 'round';
    // imageToHighlight.style.borderRadius  = '100px';
    // textToHightlight.style.color = 'royalBlue';
    // rankToHighLight.style.color = 'royalBlue';
    // pointsToHighlight.style.color = 'royalBlue';

    // for (let index = 0; index < userTexts.length; index++) {
    //   const userName = userTexts[index];
    //   userName.textContent = normalizedSortedView[index].userName;
    //   pointTexts[index].textContent = normalizedSortedView[index].points;
    //   rankTexts[index].textContent = normalizedSortedView[index].rank;
    // } 
        

}
let leaderboardElements =  new Array();
// [
//   {
//     userName: null,
//     rank :null,
//     points: null,
//     image: null
//   }
// ]

function createLeaderBoardUI()
{
  const leaderboardDiv = document.getElementById('div-leaderboard-quiz');
  const leaderboardElement = document.getElementById('div-leaderelement-quiz');
  for (let index = 0; index < sortedView.length; index++) {
    const clonedElement = leaderboardElement.cloneNode(true);
    const userName = clonedElement.querySelector('#l-user')
    const rank = clonedElement.querySelector('#l-rank')
    const points = clonedElement.querySelector('#l-points')
    const image = clonedElement.querySelector('#img-pp')
    userName.id ='l-user'+index;
    rank.id ='l-rank'+index;
    points.id ='l-points'+index;
    image.id ='img-pp'+index;
    const entry ={
      userName: userName,
      rank: rank,
      points: points,
      image :image,
      div: clonedElement
    }
    clonedElement.id ='div-leaderelement'+index;
    leaderboardElements.push(entry);
    leaderboardDiv.insertBefore(clonedElement, leaderboardElement);
  }
  leaderboardElement.style.display ='none';
  updateLeaderboardUI(sortedView);
}
const leaderUpButton = document.getElementById("btn-leaderup-quiz");
const leaderDownButton = document.getElementById("btn-leaderdown-quiz");
leaderUpButton.addEventListener('click',scrollToleaderboardTop);
leaderDownButton.addEventListener('click',scrollToleaderboardUser);
function updateLeaderboardUI(sortedView)
{
  for (let index = 0; index < sortedView.length; index++) {
    const user = sortedView[index];
    const leaderBoardElement = leaderboardElements[index];
    leaderBoardElement.userName.textContent = user.userName;
    leaderBoardElement.points.textContent = user.points;
    leaderBoardElement.rank.textContent = index+1;    
    leaderBoardElement.image.src = "./assets/pp"+getRandomInt(1,3)+".png";
  }
  const userIndex = sortedView.findIndex((user)=>user.userName == currentUser.userName);
  leaderboardElements[userIndex].userName.style.color ='royalBlue';
  leaderboardElements[userIndex].rank.style.color ='royalBlue';
  leaderboardElements[userIndex].points.style.color ='royalBlue';
  // leaderboardElements[userIndex].image.src =`./assets/pp${getRandomInt(1,3)}.png`;
  leaderboardElements[userIndex].image.style.borderColor ='royalBlue';
  leaderboardElements[userIndex].image.style.borderWidth ='2px';
  leaderboardElements[userIndex].image.style.borderStyle ='round';
  leaderboardElements[userIndex].image.style.borderRadius ='100px';
  console.log(`./assets/pp${getRandomInt(1,3)}.png`);
  setTimeout(scrollToleaderboardUser,500); 
  //scrollToleaderboardUser();
      // imageToHighlight.style.borderWidth = '2px';
    // imageToHighlight.style.borderColor  = 'royalBlue';
    // imageToHighlight.style.borderStyle  = 'round';
    // imageToHighlight.style.borderRadius  = '100px';
    // textToHightlight.style.color = 'royalBlue';
    // rankToHighLight.style.color = 'royalBlue';
    // pointsToHighlight.style.color = 'royalBlue';
}
function getRandomInt(min, max) 
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function scrollToleaderboardTop()
{
  leaderboardElements[0].div.scrollIntoView({ behavior: "smooth"});
}
function scrollToleaderboardUser()
{
  const userIndex = sortedView.findIndex((user)=>user.userName == currentUser.userName);
  leaderboardElements[userIndex].div.scrollIntoView({ behavior: "smooth"});
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
  currentPage = page;
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
