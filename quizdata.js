export class QuizData {
    constructor(quizData) {
      this.mainData = quizData.data;
      this.quizItems = new Array();
      this.name = quizData.name;
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
          this.timeArray.push(Number(t));
      }
      averageTime()
      {
          if (this.timeArray.length === 0) {
              return 0; // To avoid division by zero
            }
            const sum = this.timeArray.reduce((total, num) => total + num, 0);
            this.time = (sum / this.timeArray.length).toFixed(2);
            return this.time;
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
            //console.log(user);
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