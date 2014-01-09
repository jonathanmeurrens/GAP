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
        EndScreen.PLAY_AGAIN = "PLAY_AGAIN";

        this.view = new createjs.Container();

        var background = new createjs.Bitmap(preload.getResult("end-background"));
        this.view.addChild(background);

        // PLAY AGAIN BTN
        var playAgainBtn = new Button(Button.PLAY_AGAIN);
        playAgainBtn.view.x = 143;
        playAgainBtn.view.y = this.height + 24;
        this.view.addChild(playAgainBtn.view);
        playAgainBtn.view.on("click", function(){
            var event = new createjs.Event(EndScreen.PLAY_AGAIN, true);
            self.view.dispatchEvent(event);
        });
    }

    return EndScreen;
})();