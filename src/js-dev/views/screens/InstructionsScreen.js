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
/* globals preload:true  */

var InstructionsScreen = (function(){

    var self;

    function InstructionsScreen(instructionsData){

        self = this;

        // EVENT TYPES
        InstructionsScreen.INSTRUCTIONS_DONE = "INSTRUCTIONS_DONE";

        this.instructionsData = instructionsData;
        this.currentInstruction = 0;
        this.view = new createjs.Container();

        var colorPanel = new createjs.Shape();
        colorPanel.graphics.beginFill(createjs.Graphics.getRGB(0,0,0));
        colorPanel.graphics.drawRect(0,0,stage.canvas.width,stage.canvas.height);
        colorPanel.alpha = 0.5;
        this.view.addChild(colorPanel);

        showNextInstruction();

        this.view.cursor = 'pointer';
        this.view.addEventListener("click",function(e){
            showNextInstruction();
        });
    }

    function showNextInstruction(){
        if(self.currentInstruction < self.instructionsData.length){
            removeCurrentInstruction();
            self.instructionImg = new createjs.Bitmap(preload.getResult($(self.instructionsData[self.currentInstruction]).attr("img")));
            self.view.addChild(self.instructionImg);
            console.log($(self.instructionsData[self.currentInstruction]).attr("img"));
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