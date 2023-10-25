
export class Animation {
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
      this.changeFontSize = this.changeFontSize.bind(this);
      this.changeOpacity = this.changeOpacity.bind(this);
      this.changeRotation = this.changeRotation.bind(this);
      this.pause = this.pause.bind(this);
      this.play = this.play.bind(this);
      this.offset = { start: 0, end: 0 };
      this.textObj = textObj;
      this.callback = null;
      this.isPlaying = true;
      this.currentLoop = 0;
      this.loopingData = null;
      this.progress = 0;
      this.pong = false;
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
    changeFontSize(time) {
      if (!this.isPlaying) return;
      const value = this.calculateValue(time);
      this.obj.style.fontSize = value.prefixedValue;
      if (this.textObj) {
        this.textObj.textContent = value.orginalValue.toFixed(1) + this.units;
      }
      if (this.offset.end > this.offset.start) {
        if (value.orginalValue < this.offset.end) {
          requestAnimationFrame(this.changeFontSize);
        }
      } else {
        if (value.orginalValue > this.offset.end) {
          
          requestAnimationFrame(this.changeFontSize);
        }
      }
    }
    changeOpacity(time) {
      if (!this.isPlaying) return;
      const value = this.calculateValue(time);
      this.obj.style.opacity = value.prefixedValue;
      if (this.textObj) {
        this.textObj.textContent = value.orginalValue.toFixed(1) + this.units;
      }
      if (this.offset.end > this.offset.start) {
        if (value.orginalValue < this.offset.end) {
          requestAnimationFrame(this.changeOpacity);
        }
      } else {
        if (value.orginalValue > this.offset.end) {
          // console.log(value.orginalValue);
          requestAnimationFrame(this.changeOpacity);
        }
      }
    }
    changeRotation(time) {
      if (!this.isPlaying) return;
      const value = this.calculateValue(time);
      const rotatedValue = value.orginalValue%360;
      //console.log(this.obj.id+","+ rotatedValue);
      this.obj.style.transform = `rotate(${rotatedValue}deg)`;
  
      if (this.textObj) {
        this.textObj.textContent = value.orginalValue.toFixed(1) + this.units;
      }
     
      if (this.loopingData != null) {
        //console.log("Not Null");
        if (this.loopingData.infinite) {
          if (value.progress >= 1) {
            this.startTime = time;
            this.pong = !this.pong;
            //console.log("ReversePong"+value.orginalValue);
          }
          requestAnimationFrame(this.changeRotation);
        } else {
          //console.log("Loops"+value.progress);
          if (value.progress >= 1) {
            if (this.currentLoop < this.loopingData.loops) {
              this.startTime = time;
              this.pong = !this.pong;
              requestAnimationFrame(this.changeRotation);
              this.currentLoop++;
            } else {
              this.isPlaying = false;
              if (this.callback != null) this.callback();
            }
          } else {
            requestAnimationFrame(this.changeRotation);
          }
        }
      } else {
        if (value.progress < 1) {
          requestAnimationFrame(this.changeRotation);
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
        //console.log("cache"+ this.obj.id);
     
        const x = time - this.startTime;
        //console.log("Progress"+ x/mills);
      }
      const elapsedTime = time - this.startTime;
      var t = elapsedTime/mills;
      var newT = t;
      if(this.pong)
      {
        newT = 1-newT;
      }
      const dir = Math.sign(this.offset.end - this.offset.start);
      const value =
        this.offset.start +
        dir *
        newT *
          Math.abs(this.offset.end - this.offset.start);
      this.progress = t;
      return { orginalValue:  value,progress:t,  prefixedValue: value + this.units };
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
    animateFontSize(duration, offset, callback =null,units= "%")
    {
      this.duration = duration;
      this.offset = offset;
      this.callback = callback;
      this.units = units;
      requestAnimationFrame(this.changeFontSize);
    } 
    animateOpacity(duration, offset, callback =null)
    {
      this.duration = duration;
      this.offset = offset;
      this.callback = callback;
      requestAnimationFrame(this.changeOpacity);
    } 
    animateRotation(duration, offset, loopingData,callback =null)
    {
      this.duration = duration;
      this.offset = offset;
      this.callback = callback;
      this.loopingData = loopingData;
      requestAnimationFrame(this.changeRotation);
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
  function hex0xToRgb(hex0x) {
    // Extract the red, green, and blue components from the 0xRRGGBB value
    const red = (hex0x >> 16) & 0xff;
    const green = (hex0x >> 8) & 0xff;
    const blue = hex0x & 0xff;
  
    return `rgb(${red}, ${green}, ${blue})`;
  }