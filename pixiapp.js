

class Vector2 {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
  
    // Add two vectors and return a new Vector2 instance
    add(vector) {
      return new Vector2(this.x + vector.x, this.y + vector.y);
    }
  
    // Subtract two vectors and return a new Vector2 instance
    subtract(vector) {
      return new Vector2(this.x - vector.x, this.y - vector.y);
    }
  
    // Calculate the dot product of two vectors
    dot(vector) {
      return this.x * vector.x + this.y * vector.y;
    }
  
    // Calculate the magnitude (length) of the vector
    magnitude() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
  
    // Normalize the vector (return a new vector with the same direction but a magnitude of 1)
    normalize() {
      const mag = this.magnitude();
      if (mag === 0) {
        return new Vector2();
      }
      return new Vector2(this.x / mag, this.y / mag);
    }
  
    // Clone the vector and return a new Vector2 instance
    clone() {
      return new Vector2(this.x, this.y);
    }
  }
const referenceResolution = new Vector2(480, 854);
const app = new PIXI.Application({ background: '#FFFDEC',  width:referenceResolution.x ,height:referenceResolution.y, resizeTo:window,  resolution: 1 });
var font = new FontFaceObserver('Montserrat');
const mainContainer = new PIXI.Container();
const headerContainer = new PIXI.Container();
const meterContainer = new PIXI.Container();
const choicesContainer = new PIXI.Container();
font.load().then(function(){
    console.log("Loaded");    
    const question = new PIXI.Text("Who won golden boot in 2022 FIFA world cup?",{fontFamily: 'Montserrat',
    fontSize: 22,
    fill: 000000,
    align: 'left',
    wordWrap: true,       // Enable word wrapping
    wordWrapWidth: 300,   // Set the width for word wrapping
    });
    question.x = 0;
    question.y = -200;
    question.anchor.set(0.5);
    headerContainer.addChild(question);
    //question.maxWidth = 100;

});

//const image = PIXI.Sprite.from('assets/quizimageicon.png');


const meterBgImage = PIXI.Sprite.from('assets/meterbg.png');
const meterfillImage = PIXI.Sprite.from('assets/meterfill.png');
const maskGraphics = new PIXI.Graphics();

const clockImage = PIXI.Sprite.from('assets/clock.png');

clockImage.anchor.set(0.5);
meterBgImage.anchor.set(0.5);
meterfillImage.anchor.set(0,0);

clockImage.y =20;
clockImage.x = 23;
meterBgImage.y = 300;
meterBgImage.x = 20;
meterfillImage.x = 14;
meterfillImage.y =47;
maskGraphics.beginFill(0xffffff); // Fill color (white)
maskGraphics.drawRect(15, 210, 15, 600); // Position and size of the mask
maskGraphics.endFill();

meterfillImage.mask = maskGraphics;

meterContainer.addChild(clockImage);
meterContainer.addChild(meterBgImage);
meterContainer.addChild(meterfillImage);
meterContainer.addChild(maskGraphics);
meterContainer.x = 0;
meterContainer.y = 40;


createChoices();
function createChoices()
{
    var elementsPerRow = 2;
    var width = 160;
    var height = 100;
    const padding = new Vector2(2, 2);
    for (let y = 0; y < elementsPerRow; y++) 
    {
        for (let x = 0; x < elementsPerRow; x++) 
        {
            
            const pos = new Vector2(10+(width+ padding.x) *x  ,10+ (height+padding.y)*y);
            const scale = new Vector2(width, height);
            
            var choice = CreateButtonGraphics('assets/choicebutton-default.png','Messi',pos , scale);
            choicesContainer.addChild(choice);
        }
        
        
    }
    choicesContainer.y =(app.screen.height/2)+100;
    choicesContainer.x =(app.screen.width/2)-140;
    choicesContainer.scale.x *=0.8;
    choicesContainer.scale.y *=0.8;
    
}

function CreateButtonGraphics(path,text ,pos, scale, color ='#ffffff00')
{
    const buttonDefaultImage = PIXI.Sprite.from(path);
    const buttonGraphics = new PIXI.Graphics();
    var centerPivotPos = new Vector2(pos.x+(scale.x)/2,pos.y +(scale.y)/2 );
   
    buttonGraphics.beginFill(color); // Red background color
    //buttonGraphics.beginFill((pos.x+pos.y)*200); // Red background color
    buttonGraphics.drawRect(pos.x, pos.y, scale.x, scale.y); // Position and size of the graphic
    buttonGraphics.endFill();
    buttonDefaultImage.anchor.set(0.5);
    buttonGraphics.addChild(buttonDefaultImage);
    
    buttonDefaultImage.x = centerPivotPos.x;
    buttonDefaultImage.y =  centerPivotPos.y;
    if(text!='')
    {
        const buttonText = new PIXI.Text(text,{fontFamily: 'Montserrat',
        fontSize: 22,
        fill: 000000,
        align: 'left',
        wordWrap: true,       // Enable word wrapping
        wordWrapWidth: 300,   // Set the width for word wrapping
        });
        buttonText.anchor.set(0.5);
        buttonGraphics.addChild(buttonText);
        buttonText.x = centerPivotPos.x;
        buttonText.y = centerPivotPos.y;
    }
    return buttonGraphics;
}

// create a new Sprite from an image path
const quizImageIcon = PIXI.Sprite.from('assets/quizimageicon.png');



//mainContainer.addChild(graphics);
const width = app.screen.width*0.8;
const height = app.screen.height*0.9;



headerContainer.x = app.screen.width/2;
headerContainer.y = app.screen.height/2;

quizImageIcon.anchor.set(0.5);
quizImageIcon.y -=20;

headerContainer.addChild(quizImageIcon);

headerContainer.scale.x *=0.95;
headerContainer.scale.y *=0.95;

mainContainer.addChild(headerContainer);
mainContainer.addChild(choicesContainer);
mainContainer.addChild(meterContainer);



//app.stage.addChild(bunny);
app.stage.addChild(mainContainer); 
var h = meterfillImage.getGlobalPosition().y+511;
// Listen for animate update
app.ticker.add((delta) =>
{
    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    //bunny.rotation += 0.1 * delta;
  
    h-=0.8* delta;
    maskGraphics.clear();
    maskGraphics.beginFill(0xffffff); // Fill color (white)
    maskGraphics.drawRect(meterfillImage.x,(meterfillImage.getGlobalPosition().y+ meterfillImage.height)-h, 20, h); // New position and size
    maskGraphics.endFill();
});
document.body.appendChild(app.view);
window.addEventListener('resize', resizeMainContainer);
resizeMainContainer();
function resizeMainContainer()
{
    const newRes = new Vector2( window.innerWidth, window.innerHeight);
    const perc = new Vector2(newRes.x/ referenceResolution.x, newRes.y/ referenceResolution.y);
    mainContainer.scale.x = perc.magnitude();
    mainContainer.scale.y = perc.magnitude();
    console.log(perc);
}