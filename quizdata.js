 class QuizData {
    constructor(quizData) {
      this.mainData = quizData.data;
      this.quizItems = new Array();
      this.quizName = quizData.name;
      this.duration = quizData.duration;
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
      this.endDate = quizData.endDate;
    }
    getAll() {
      return this.quizItems;
    }
    getQuizAt(index) {
      return this.quizItems[index];
    }
    getQuizCount()
    {
        return this.mainData.questions.length;
    }
  }
   class PlayerScore
  {
      constructor()
      {
          this.timeArray = new Array();
          this.correct = 0;
          this.wrong = 0;
          this.coins = 0;
          this.xp = 0;
          this.points = 0;
          this.time = 0;
          this. correctConstant = 200;
          this.stats = new Array();

      }
      addCoin(amount)
      {
          this.coins += Number(amount);
      }
      addXp(amount)
      {
          this.xp += Number(amount);
      }
      setStats(correct, time)
      {
        this.stats.push(
          {
            correct: correct,
            time: time
          }
        );
      }
      getCorrect()
      {
          var correct = this.stats.filter(element=> element.correct == true);
          return correct.length;
      }
      getWrong()
      {
        var wrong = this.stats.filter(element=> element.correct == false);
        return wrong.length;
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
        console.log(t);  
        this.timeArray.push(Number(t));
      }
      finalizeScore()
      {
        this.time = this.averageTime();
        this.points = Number( this.GetScore())
        this.correct = this.getCorrect();
        this.wrong = this.getWrong();
      }
      averageTime()
      {
          // if (this.timeArray.length === 0) 
          // {
          //     return 0; // To avoid division by zero
          // }
          // const sum = this.timeArray.reduce((total, num) => total + num, 0);
          // return (sum / this.timeArray.length).toFixed(2);
          if(this.stats.length ===0)
          return 0;
        let totalTime=0;
        this.stats.forEach(stat => {
          totalTime += stat.time;
        });
        return (totalTime/this.stats.length).toFixed(2);
      }
      GetScore()
      {
       
        const maxScoreForReaction = 30;
        const scorePerCorrectAnswer = 70;
        const scorePerWrongAnswer = 0;
        const fastestResponseTime = 2;
        const miniumResponseTime = quizDuration - fastestResponseTime;

       

        let points = 0;
        let totalScore =0;
        
        this.stats.forEach(stat=>{
          var index = this.stats.findIndex(item => item === stat)+1; 
          var clampedTime = Math.max(stat.time - fastestResponseTime,0);
          var mult  = Math.min( 1 - (clampedTime/miniumResponseTime),1);
          if(stat.correct)
          {
            mult = mult<0? 0: mult;
            points = scorePerCorrectAnswer + Number(maxScoreForReaction * mult);
          }
          // if answer is wrong but response time is between 1-quizDuration/2 then maxScoreforReaction* ratio *0.5
          else
          {
              mult  = 1 - (clampedTime/(miniumResponseTime*0.5));
              mult = mult<0? 0: mult;
              points = scorePerWrongAnswer + Number(maxScoreForReaction * (mult*0.5));
          }
          console.log("Question"+ index+":"+ points);
          totalScore += points;
        });
        
        
        //const miniumScore = 100;
        
        // const averageResponseTime = 1;
        // const score = miniumScore + (scorePerCorrectAnswer* this.correct) + (50 * Math.max (0,averageResponseTime/this.averageTime()));
        // const score = 100+ (25* this.correct*noOfQuiz);
        return isNaN(totalScore)?0:totalScore.toFixed(0);
    }
}
 class LeaderBoardUsers
{
    constructor( quizData)
    {
        // this.sortedUsers = sortedUsers;
        // this.userIndex = userIndex;
        // this.sortedView = new Array();
        this.quizData = quizData;
        // this.userRank = userIndex +1;
        // this.userName = sortedUsers[userIndex].userName;
        // if(sortedUsers.length>=3)
        // {
        //     if(userIndex===0)
        //     {
        //         const user1 ={
        //             userName:sortedUsers[userIndex].userName,
        //             points: sortedUsers[userIndex].points,
        //             rank: this.userRank
        //         };
        //         const user2 ={
        //             userName:sortedUsers[userIndex+1].userName,
        //             points: sortedUsers[userIndex+1].points,
        //             rank: this.userRank+1
        //         };
        //         const user3 ={
        //             userName:sortedUsers[userIndex+2].userName,
        //             points: sortedUsers[userIndex+2].points,
        //             rank: this.userRank+2
        //         };
        //         this.sortedView.push (user1);
        //         this.sortedView.push (user2);
        //         this.sortedView.push (user3);
        //     }
        //     else
        //     {
        //        if(userIndex == sortedUsers.length-1)
        //        {
        //         const user1 ={
        //             userName:sortedUsers[userIndex-2].userName,
        //             points: sortedUsers[userIndex-2].points,
        //             rank: this.userRank-2
        //         };
        //         const user2 ={
        //             userName:sortedUsers[userIndex-1].userName,
        //             points: sortedUsers[userIndex-1].points,
        //             rank: this.userRank-1
        //         };
        //         const user3 ={
        //             userName:sortedUsers[userIndex].userName,
        //             points: sortedUsers[userIndex].points,
        //             rank: this.userRank
        //         };
        //         this.sortedView.push (user1);
        //         this.sortedView.push (user2);
        //         this.sortedView.push (user3);
        //        }
        //        else
        //        {
        //         const user1 ={
        //             userName:sortedUsers[userIndex-1].userName,
        //             points: sortedUsers[userIndex-1].points,
        //             rank: this.userRank-1
        //         };
        //         const user2 ={
        //             userName:sortedUsers[userIndex].userName,
        //             points: sortedUsers[userIndex].points,
        //             rank: this.userRank
        //         };
        //         const user3 ={
        //             userName:sortedUsers[userIndex+1].userName,
        //             points: sortedUsers[userIndex+1].points,
        //             rank: this.userRank+1
        //         };
        //         this.sortedView.push (user1);
        //         this.sortedView.push (user2);
        //         this.sortedView.push (user3);
        //        }
               
        //     }
        // }
        // else
        // {
        //     const dummyCount = 3 - sortedUsers.length;
        //     const dummyPlayers = this.getDummyPlayers(dummyCount);
        //     sortedUsers.forEach(user => {
        //         this.sortedView.push({userName: user.userName, points: user.points, rank:0})
        //     });
        //     dummyPlayers.forEach(dummyPlayer => {
        //         this.sortedView.push({userName: dummyPlayer.userName, points: dummyPlayer.points, rank:0 });
        //     });
        //     this.sortedView.sort((a,b)=>b.points- a.points);
        //     this.sortedView.forEach(user => {
        //         user.rank = this.sortedView.findIndex((e)=> e==user)+1;
        //     });
           
        // }
        // this.sortedView.forEach(user => {
        //     console.log(user.userName +":"+user.rank);
        // });
       
        // this.normalizedRank =  this.sortedView.findIndex((element)=>element.userName == this.userName);
    }
    getNormalizedUserRank()
    {
        return (this.normalizedRank+1);
    }
    getNormalizedSortedView()
    {
        return this.sortedView;
    }
    getUserRank()
    {
        return this.userRank+1;
    }
    getDummyPlayers(count)
    {
        const names =[
            "Albin",
            "Akhil",
            "Joyal jhon",
            "Riya James",
            "Noel Jhon",
            "Nina",
            "Akhila",
            "Sam",
            "Ahmed",
            "Pete K"
        ]
        const playerNames = this.getRandomDistinctNames(names, count);
        const quizNo = this.quizData.getQuizCount();
        const maxScore = quizNo*100;
        const dummyPlayer = new Array();
        for (let index = 0; index < count; index++) {
           
            const player = {
                userName: playerNames[index],
                points : (maxScore * this.getRandomNumber(0.3,0.95)).toFixed(0),
            }
            dummyPlayer.push(player);
        }
        return dummyPlayer;

    }
     getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
      }
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    getRandomDistinctNames(names, count) {
        if (count >= names.length) {
          return names; // Return all names if count is greater than or equal to the array length
        }
      
        const shuffledNames = [...names]; // Create a copy of the original array
        for (let i = shuffledNames.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]]; // Shuffle the array
        }
      
        return shuffledNames.slice(0, count); // Get the first 'count' names
      }

    getUsers()
    {
        return this.users;
    }
    getOrderedUsers()
    {

    }
}