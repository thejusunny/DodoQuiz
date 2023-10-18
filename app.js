
class animation
{
    constructor(obj, textObj = null)
    {
        this.duration = null;
        this.startTime = null;
        this.obj = obj;
        this.units = null;
        this.changeHeight = this.changeHeight.bind(this);
        this.changeBottomPivot = this.changeBottomPivot.bind(this);
        this.changeWidth = this.changeWidth.bind(this);
        this.calculateValue = this.calculateValue.bind(this);
        this.pause = this.pause.bind(this);
        this.play = this.play.bind(this);
        this.offset = {start:0, end:0};
        this.textObj = textObj;
        this.callback = null;
        this.isPlaying = true;
    }
    changeHeight(time)
    {
        
        if(!this.isPlaying)
            return;
        const value = this.calculateValue(time);
        this.obj.style.height = value.prefixedValue ;
        if(this.textObj)
        {
            this.textObj.textContent = value.orginalValue.toFixed(1)+ this.units;
        }
        if(this.offset.end> this.offset.start)
        {
            if( value.orginalValue<this.offset.end)
            {
                requestAnimationFrame(this.changeHeight)
            }
            else
                if(this.callback!=null)
                this.callback();
        }
        else
        {
            if( value.orginalValue>this.offset.end)
            {
                requestAnimationFrame(this.changeHeight)
            }
            else
                if(this.callback!=null)
                this.callback();
        }
    }
    changeBottomPivot(time)
    {
        if(!this.isPlaying)
            return;
        const value = this.calculateValue(time);
        this.obj.style.bottom = value.prefixedValue;
        if(this.textObj)
        {
            this.textObj.textContent = value.orginalValue.toFixed(1)+ this.units;
        }
        if(value.orginalValue<this.offset.end)
        {
            requestAnimationFrame(this.changeBottomPivot)
        }
    }
    changeWidth(time)
    {
        if(!this.isPlaying)
            return;
        const value = this.calculateValue(time);
        this.obj.style.width = value.prefixedValue;
        if(this.textObj)
        {
            this.textObj.textContent = value.orginalValue.toFixed(1)+ this.units;
        }
        if(this.offset.end> this.offset.start)
        {
            if( value.orginalValue<this.offset.end)
            {
                requestAnimationFrame(this.changeWidth)
            }
        }
        else
        {
            if( value.orginalValue>this.offset.end)
            {
                console.log(value.orginalValue);
                requestAnimationFrame(this.changeWidth)
            }
        }
       
    }
    calculateValue(time)
    {
        const mills = this.duration*1000;
        if(!this.startTime)
        {
            this.startTime = time;
        }
        const elapsedTime = time- this.startTime;
        const dir = Math.sign ((this.offset.end - this.offset.start));
        const value = this.offset.start+ (dir*( elapsedTime/mills) *  Math.abs ((this.offset.end-this.offset.start)));
        return {orginalValue:value, prefixedValue: (value + this.units)};
    }
    animateHeight(duration, offset,callback=null,units="%") 
    {
        this.duration = duration;
        this.offset = offset;
        this.units = units;
        requestAnimationFrame(this.changeHeight)
    }
    animateWidth(duration, offset,units="%")
    {
        this.duration = duration;
        this.offset = offset;
        this.units = units;
        requestAnimationFrame(this.changeWidth)
    }
    animateBottomPivot(duration, offset,units="%") 
    {
        this.duration = duration;
        this.units = units;
        this.offset = offset;
        requestAnimationFrame(this.changeBottomPivot)
    }
    animatecolor(duration, colorOffset, timeToRepeat)
    {

    }
    pause()
    {
        this.isPlaying = false;
    }
    play()
    {
        this.isPlaying = true;
    }

}
class QuizData
{
    constructor(mainData)
    {
       this.mainData = mainData;
       this.quizItems = new Array();
       for (let index = 0; index < this.mainData.questions.length; index++) 
       {
           
            const quiz =
            {
                question: this.mainData.questions[index],
                options: this.mainData.options[index],
                image: this.mainData.images[index],
                answer: this.mainData.answers[index],
                rewards: this.mainData.rewards[index]
            }
            this.quizItems.push(quiz);
        
       }
    }
    getAll() {
        return this.quizItems;
    }
    getQuizAt(index)
    {
        return this.quizItems[index];
      
    }
}
const mockQuizData=
{
    questions:["Who is Elon Musk?",
    "When is Indias Indpenedence Day?",
    "When is Argentinas first world cup",
    ],
    options:
    [
        ["Buisness man", "Scientist","Engineer", "Genius"],
        ["Mars", "Venus", "Earth", "Pluto"],
        ["William Shakespeare", "George Orwell", "Jane Austen","Barack Obama"],
        
    ],
    answers: [1, 1, 2],
    images:[
        "https://assets.xboxservices.com/assets/0b/17/0b179504-412d-4af7-9e00-3e3d92633577.jpg?n=GTA-V_GLP-Page-Hero-1084_1920x1080.jpg",
        "https://news.xbox.com/en-us/wp-content/uploads/sites/2/2021/12/GTAO_Contract_Launch_MSFT_YTthumbnail_1920x1080.jpg",
        "https://static.bandainamcoent.eu/high/jujutsu-kaisen/jujutsu-kaisen-cursed-clash/00-page-setup/JJK-header-mobile2.jpg"
    ],
    rewards:
    [
        ["10","100"],
        ["20","100"],
        ["5","200"],
    ]

};
const quizDataElements = new Map(
    [
        ["coin-txt","l-coin-quiz"],
        ["xp-txt","l-xp-quiz"],
        ["meterbg-img","img-meterbg1-quiz"],
        ["meterfill-img","img-meterfill1-quiz"],
        ["question-txt","l-question-quiz"],
        ["image-img","img-main-quiz"],
        ["option1-btn","btn-choice1-quiz"],
        ["option2-btn","btn-choice2-quiz"],
        ["option3-btn","btn-choice3-quiz"],
        ["option4-btn","btn-choice4-quiz"],
        ["option1-txt","l-option1-quiz"],
        ["option2-txt","l-option2-quiz"],
        ["option3-txt","l-option3-quiz"],
        ["option4-txt","l-option4-quiz"],
        ["meterfill-img","img-meterfill-quiz"],
    ])
const quizData = new QuizData(mockQuizData);



const overlayElement = document.getElementById("overlay");
overlayElement.addEventListener('click', startQuiz);
var meterFillAnimation = null;
function startQuiz()
{
    overlayElement.style.display = 'none';
    const page = GetPage(0);
    const meterFillImg = GetDataElementInPage(page,0,'meterfill-img');
    const btn1 = GetDataElementInPage(page,0, 'option1-btn');
    btn1.addEventListener('click', ()=>{OptionSelected(1, btn1)});

    const btn2 = GetDataElementInPage(page,0, 'option2-btn');
    btn2.addEventListener('click', ()=>{OptionSelected(2,btn2)});

    const btn3 = GetDataElementInPage(page,0, 'option3-btn');
    btn3.addEventListener('click', ()=>{OptionSelected(3,btn3)});

    const btn4 = GetDataElementInPage(page,0, 'option4-btn');
    btn4.addEventListener('click', ()=>{OptionSelected(4,btn4)});

    meterFillAnimation = new animation(meterFillImg);
    meterFillAnimation.animateHeight(5, {start:100,end:0.01},()=>{
        meterFillAnimation.pause();
        timerRanOut();
    });
}
function timerRanOut()
{

}
function OptionSelected(index, button)
{
    meterFillAnimation?.pause();
    console.log("Selected"+index);
    const scaleAnimation = new animation(button);
    button.style.width = 47.5+"%";
    button.style.height =38+"%";
    const quizElement = quizData.getQuizAt(0);
    const bgDiv = button.querySelector('div');
    if(index== quizElement.answer)
    {
       
        bgDiv.style.backgroundColor ='green';
    }
    else
    {
        bgDiv.style.backgroundColor ='red';
        const currentPage = GetPage(0);
        const correctButton = GetDataElementInPage(currentPage,0,'option'+quizElement.answer+"-btn");
        const correctBg = correctButton.querySelector('div');
        correctBg.style.backgroundColor ='green';
    }
    //scaleAnimation.animateWidth(3, {start:20, end:50});
}
// const fillMeterAnimation1 = new animation( fillImage1);
// const knobAnimation1 = new animation( knobImage1, progressLabel1);
// const fillMeterAnimation2 = new animation( fillImage2);
// const knobAnimation2 = new animation( knobImage2,progressLabel2);
// const knobScaleAnimation = new animation( knobImage2);
// animateMeters();
// function animateMeters()
// {
//     fillMeterAnimation1.animateHeight(1, {start:0,end:40});
//     knobAnimation1.animateBottomPivot(1,  {start:0,end:40});

//     fillMeterAnimation2.animateHeight(2, {start:40,end:90});
//     knobAnimation2.animateBottomPivot(2,  {start:40,end:90});
//     knobScaleAnimation.animateWidth(2000, {start:75, end:120 });
// }
const rootContainer = document.getElementById("root-page");
const quizContainer = document.getElementById("quiz-page");
const summaryContainer = document.getElementById("quiz-summary-page");
const noOfQuiz = 3;


createQuizPages();
const pages = new Array();
function createQuizPages()
{
    for (let index = 0; index < noOfQuiz; index++) 
    {
        var clonedNode = quizContainer.cloneNode(true);
       for (const [K,V] of quizDataElements) 
       {
            const currentId = V;
            //console.log(currentId);
            const element = clonedNode.querySelector("#"+currentId);
            if(element)
                element.id  = currentId + index;

            
       }
       const quizItem = quizData.getQuizAt(index);
       console.log(quizItem);
       const questionText = GetDataElementInPage(clonedNode,index,"question-txt");
       questionText.textContent = quizItem.question;

       const optionText1 = GetDataElementInPage(clonedNode,index,"option1-txt");
       optionText1.textContent = quizItem.options[0];

       const optionText2 = GetDataElementInPage(clonedNode,index,"option2-txt");
       optionText2.textContent = quizItem.options[1];

       const optionText3 = GetDataElementInPage(clonedNode,index,"option3-txt");
       optionText3.textContent =quizItem.options[2];

       const optionText4 = GetDataElementInPage(clonedNode,index,"option4-txt");
       optionText4.textContent = quizItem.options[3];

       const coinText = GetDataElementInPage(clonedNode,index,"coin-txt");
       coinText.textContent = quizItem.rewards[0];

       const xpText = GetDataElementInPage(clonedNode,index,"xp-txt");
       xpText.textContent = quizItem.rewards[1];

       const image = GetDataElementInPage(clonedNode, index, "image-img");
       image.src  = quizItem.image;

       clonedNode.id = 'quiz-page'+index;
       rootContainer.insertBefore(clonedNode, summaryContainer);
       //pages.push(clonedNode);
    }
    quizContainer.style.display = 'none';
}
function GetDataElementInPage(page,index,name)
{
    //console.log(quizDataElements.get(name));
    const element = page.querySelector('#'+ quizDataElements.get(name)+index);
    return element;
}
function GetPage(index)
{
    return document.getElementById('quiz-page'+index);
}
let currentPage = 0;
let scrollPosition = 0;
//scrollToPage(2);
function scrollToPage(page) {
    scrollPosition = page * window.innerWidth;
    rootContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
}
//setTimeout(scrollBack,5000);
function scrollBack()
{
    scrollToPage(0);
}


