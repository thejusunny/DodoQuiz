export class QuizData {
    constructor(quizData) {
      this.mainData = quizData.data;
      this.quizItems = new Array();
      this.quizName = quizData.name;
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
    getQuizCount()
    {
        return this.mainData.questions.length;
    }
  }
  export class PlayerScore
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

      }
      addCoin(amount)
      {
          this.coins += Number(amount);
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
        console.log(t);  
        this.timeArray.push(Number(t));
      }
      finalizeScore(noOfQuiz)
      {
        this.time = Number( this.averageTime());
        this.points = Number( this.GetScore(noOfQuiz))

      }
      averageTime()
      {
          if (this.timeArray.length === 0) {
              return 0; // To avoid division by zero
            }
            const sum = this.timeArray.reduce((total, num) => total + num, 0);
            return (sum / this.timeArray.length).toFixed(2);
      }
      GetScore(noOfQuiz)
      {
       
        const score = 100+ (25* this.correct*noOfQuiz);
        return isNaN(score)?0:score.toFixed(0);
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
export class LeaderBoardUsers
{
    constructor(sortedUsers, userIndex, quizData)
    {
        this.sortedUsers = sortedUsers;
        this.userIndex = userIndex;
        this.sortedView = new Array();
        this.quizData = quizData;
        this.userRank = userIndex +1;
        if(sortedUsers.length>=3)
        {
            if(userIndex===0)
            {
                const user1 ={
                    userName:sortedUsers[userIndex].userName,
                    points: sortedUsers[userIndex].points,
                    rank: this.userRank
                };
                const user2 ={
                    userName:sortedUsers[userIndex+1].userName,
                    points: sortedUsers[userIndex+1].points,
                    rank: this.userRank+1
                };
                const user3 ={
                    userName:sortedUsers[userIndex+2].userName,
                    points: sortedUsers[userIndex+2].points,
                    rank: this.userRank+2
                };
                this.sortedView.push (user1);
                this.sortedView.push (user2);
                this.sortedView.push (user3);
            }
            else
            {
                console.log(userIndex);
                const user1 ={
                    userName:sortedUsers[userIndex-1].userName,
                    points: sortedUsers[userIndex-1].points,
                    rank: this.userRank-1
                };
                const user2 ={
                    userName:sortedUsers[userIndex].userName,
                    points: sortedUsers[userIndex].points,
                    rank: this.userRank
                };
                const user3 ={
                    userName:sortedUsers[userIndex+1].userName,
                    points: sortedUsers[userIndex+1].points,
                    rank: this.userRank+1
                };
                this.sortedView.push (user1);
                this.sortedView.push (user2);
                this.sortedView.push (user3);
            }
        }
        else
        {
            const dummyCount = 3 - sortedUsers.length;
            const dummyPlayers = this.getDummyPlayers(dummyCount);
            sortedUsers.forEach(user => {
                this.sortedView.push({userName: user.userName, points: user.stats[0].points, rank:0})
            });
            dummyPlayers.forEach(dummyPlayer => {
                this.sortedView.push({userName: dummyPlayer.userName, points: dummyPlayer.points, rank:0 });
            });
            this.sortedView.sort((a,b)=>b.points- a.points);
            this.sortedView.forEach(user => {
                user.rank = this.sortedView.findIndex(user)+1;
            });
        }
        this.sortedView.forEach(user => {
            console.log(user.userName +":"+user.rank);
        });

    }
    getSortedView()
    {
        return this.sortedView;
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
                points : maxScore * this.getRandomNumber(0.3,0.85),
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