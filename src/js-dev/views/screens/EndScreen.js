/* globals stage:true  */
/* globals createjs:true  */
/* globals ScreenManager:true  */
/* globals Button:true  */
/* globals preload:true  */

var EndScreen = (function(){

    var self;

    function EndScreen(){

        self = this;

        // EVENT TYPES
        EndScreen.MENU = "MENU";

        this.view = new createjs.Container();

        var background = new createjs.Bitmap(preload.getResult("end-background"));
        this.view.addChild(background);

        // PLAY AGAIN BTN
        var playAgainBtn = new Button(Button.PLAY_MORE);
        playAgainBtn.view.x = 925;
        playAgainBtn.view.y = 120;
        this.view.addChild(playAgainBtn.view);
        playAgainBtn.view.on("click", function(){
            var event = new createjs.Event(EndScreen.MENU, true);
            self.view.dispatchEvent(event);
        });
    }

    return EndScreen;
})();