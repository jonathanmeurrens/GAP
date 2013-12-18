/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 26/11/13
 * Time: 19:32
 * To change this template use File | Settings | File Templates.
 */

/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */

var InstructionsScreen = (function(){

    var self;

    function InstructionsScreen(instructionsData){

        self = this;

        // EVENT TYPES
        InstructionsScreen.INSTRUCTIONS_DONE = "INSTRUCTIONS_DONE";

        this.instructionsData = instructionsData;
        this.currentInstruction = 0;
        this.screenType = ScreenManager.INSTRUCTIONS;

        this.view = new createjs.Container();

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(0,0,255));
        colorPanel.graphics.drawRect(0,0,200,200);

        this.view.addChild(colorPanel);
        showNextInstruction();
        colorPanel.addEventListener("click",function(e){
            showNextInstruction();
        });
    }

    function showNextInstruction(){
        //console.log(self.instructionsData);
        if(self.currentInstruction < self.instructionsData.length){
            removeCurrentInstruction();
            self.instructionImg = new createjs.Bitmap("img/instructions/instruction-"+$(self.instructionsData[self.currentInstruction]).attr("img"));
            self.view.addChild(self.instructionImg);
            //console.log($(self.instructionsData[self.currentInstruction]).attr("img"));
        }
        else{
            removeCurrentInstruction();
            var event = new createjs.Event(InstructionsScreen.INSTRUCTIONS_DONE, true);
            self.view.dispatchEvent(event);
        }
        self.currentInstruction++;
    }

    function removeCurrentInstruction(){
        if(self.instructionImg != null){
            self.view.removeChild(self.instructionImg);
            self.instructionImg = null;
        }
    }

    return InstructionsScreen;
})();