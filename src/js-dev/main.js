/**
 * Created with JetBrains PhpStorm.
 * User: Jonathan
 * Date: 05/11/13
 * Time: 10:35
 * To change this template use File | Settings | File Templates.
 */


/* globals Box2D:true  */
/* globals createjs:true  */
/* globals GameData:true  */
/* globals PreloadManager:true  */
/* globals SoundManager:true  */
/* globals GameContainer:true  */
/* globals Statistics:true  */
/* globals ScreenManager:true  */
/* globals StartScreen:true  */
/* globals LevelNest:true  */
/* globals InstructionsScreen:true  */
/* globals NextLevelScreen:true  */
/* globals GameOverScreen:true  */
/* globals Bird:true  */


var box2d = {
    b2Vec2 : Box2D.Common.Math.b2Vec2,
    b2BodyDef : Box2D.Dynamics.b2BodyDef,
    b2Body : Box2D.Dynamics.b2Body,
    b2FixtureDef : Box2D.Dynamics.b2FixtureDef,
    b2Fixture : Box2D.Dynamics.b2Fixture,
    b2World : Box2D.Dynamics.b2World,
    b2MassData : Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape : Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape : Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw : Box2D.Dynamics.b2DebugDraw,
    b2DistanceJointDef : Box2D.Dynamics.Joints.b2DistanceJointDef,
    b2BuoyancyController : Box2D.Dynamics.Controllers.b2BuoyancyController
};
var SCALE = 30;
var stage, world, debug, preload;

(function(){

    var self;

    function init(){
        self = this;

        stage = new createjs.Stage(document.getElementById("game"));
        stage.enableMouseOver();
        debug = document.getElementById('debug');
        this.width = stage.canvas.width;
        this.height = stage.canvas.height;
        this.levelStarted = false;
        this.collisionDetected = false;
        this.isPaused = true;
        this.keypressCount = 0;

        this.gameData = new GameData('data/game.xml');
        $(this.gameData).on("parsed", gameDataLoadedHandler);
        this.gameData.parse();

        setupPhysics();
        addListeners();
    }

    // ------------------- PHYSICS FUNCTIONS

    function setupPhysics(){

        // create world
        world = new box2d.b2World(new box2d.b2Vec2(0,20), true);

        // setup debug draw
        var debugDraw = new box2d.b2DebugDraw();
        debugDraw.SetSprite(debug.getContext('2d'));
        debugDraw.SetDrawScale(SCALE);
        debugDraw.SetFillAlpha(0.2);
        debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);

        var listener = new Box2D.Dynamics.b2ContactListener();
        listener.BeginContact = function(contact) {

            self.gameContainer.handleBeginContact(contact);

            var colliderA = contact.GetFixtureA().GetUserData();
            var colliderB = contact.GetFixtureB().GetUserData();
            //console.log("[MAIN] collision: ",contact.GetFixtureA().GetUserData(), contact.GetFixtureB().GetUserData());

            if(colliderA === "ground" || colliderB === "ground"){
                if(!self.collisionDetected){
                    showGameOverScreen();
                    self.collisionDetected = true;
                }
            }
            else if(colliderA === "rock" || colliderB === "rock"){
                if(!self.collisionDetected){
                    showGameOverScreen();
                    self.collisionDetected = true;
                }
            }
            else if(colliderA === "leaf" && colliderB === "bird" || colliderB === "bird" && colliderA === "leaf"){
                if(!self.collisionDetected){
                    // make leaf move a bit
                    SoundManager.playBounce();
                    self.stats.increaseBounce();
                }
            }
            else if(colliderA === "top-nest" || colliderB === "top-nest"){
                if(!self.collisionDetected){
                    self.gameContainer.bird.rest({x:self.gameContainer.nest.view.x, y:self.gameContainer.nest.view.y});
                    showNextLevelScreen();
                    self.collisionDetected = true;
                }
            }
            else if(colliderA === "tornado" || colliderB === "tornado"){
                self.gameContainer.bird.tornadoFly();
            }
            else if(colliderA === "enemyBird" || colliderB === "enemyBird"){
                showGameOverScreen();
                self.collisionDetected = true;
            }
            else if(colliderA === "balloon" || colliderB === "balloon"){
                showGameOverScreen();
                self.collisionDetected = true;
            }
            else if(colliderA === "miniTree" || colliderB === "miniTree"){
                showGameOverScreen();
                self.collisionDetected = true;
            }
            else if(colliderA.indexOf("timeCoin") !== -1 || colliderB.indexOf("timeCoin") !== -1){
                if(colliderA.indexOf("timeCoin") !== -1){
                    self.gameContainer.removeTimeCoinWithUserData(colliderA);
                }
                else{
                    self.gameContainer.removeTimeCoinWithUserData(colliderB);
                }
                self.gameContainer.view.addEventListener(GameContainer.COIN_REMOVED, catchedCoinHandler);
            }
        };
        listener.EndContact = function(contact) {
            self.gameContainer.handleEndContact(contact);
        };
        /*listener.PostSolve = function(contact, impulse) {

        };
        listener.PreSolve = function(contact, oldManifold) {

        };*/
        world.SetContactListener(listener);
    }


    //**
    //
    //
    // --------------- STARTER FUNCTIONS

    function gameDataLoadedHandler(){
        self.preloadManager = new PreloadManager();
        self.preloadManager.view.addEventListener(PreloadManager.LOADING_DONE, preloadHandler);
        self.preloadManager.preloadGame();
    }

    function preloadHandler(e){
        if(self.preloadManager.isPreloadingGame){
            drawLevel();
            drawGameInfo();
            showStartScreen();

        }else{
            var instructionsData = self.gameData.getLevelInstructionsForLevel(self.stats.level);
            if(instructionsData.length > 0 && !self.gameData.didUserGetInstructionForLevel(self.stats.level)){
                drawLevel();
                showInstructionsScreen(instructionsData);
            }
            else{
                startGame();
            }
        }
    }

    function addListeners(){

        createjs.Ticker.addEventListener("tick",tick);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.useRAF = true;

        $(document).on("keydown",function(e){

            if(e.which >= 37 && e.which <= 39){
               self.keypressCount++;
                if(self.keypressCount > 3){
                    return;
                }
            }

            if(e.which === 32){
                launchEgg();
            }
            else if(e.which === 39){
                self.gameContainer.bird.moveRight();
            }
            else if(e.which === 37){
                self.gameContainer.bird.moveLeft();
            }
            else if(e.which === 38){
                self.gameContainer.bird.fly();
            }
            else if(e.which === 80){
                self.isPaused = !self.isPaused;
            }
        });
        $(document).on("keyup", function(){
            self.keypressCount = 0;
        });
    }

    //**
    //
    //
    // ------------------ MAIN DRAWING FUNCTIONS

    function drawGameInfo(){
        if(this.stats == null){
            createStatistics();
        }
        if(this.screenManager == null){
            createScreenManager();
        }
    }

    function drawLevel(){

        self.levelStarted = false;

        if(self.gameContainer == null){
            this.gameContainer = new GameContainer();
            stage.addChild(this.gameContainer.view);
        }

        this.gameContainer.resetContainer();

        var level=0;
        if(self.stats!=null){
            level = self.gameData.getLevel(self.stats.level);
            self.stats.leafsCount = $(level).find('leaf').length;
            self.stats.maxTime = $(level).attr("time");
        }

        $(level).find('background').each(function(i, obj){
            if(i<=0){
                $("#game").css('background-image','url('+$(obj).attr("img")+')');
            }
            else{
                self.gameContainer.createBackground($(obj).attr("img"));
            }
        });
        $(level).find('ground').each(function(i, obj){
            self.gameContainer.createGround($(obj).attr("img"), self.width/2, self.height - parseInt($(obj).attr("height")), self.width, parseInt($(obj).attr("height")));
        });
        $(level).find('tree').each(function(i, obj){
            self.gameContainer.createTree($(obj).attr("img"), $(obj).attr("x"), $(obj).attr("width"), $(obj).attr("height"));
        });
        $(level).find('leaf').each(function(i, obj){
            self.gameContainer.createLeaf($(obj).attr("x"), $(obj).attr("y"), $(obj).attr("rotation"), $(obj).attr("restitution"));
        });
        $(level).find('rock').each(function(i, obj){
            self.gameContainer.createRock($(obj).attr("img"), $(obj).attr("x"), $(obj).attr("y"), $(obj).attr("width"), $(obj).attr("height"));
        });
        $(level).find('tornado').each(function(i, obj){
            self.gameContainer.createTornado($(obj).attr("x"), $(obj).attr("y"));
        });
        $(level).find('enemyBird').each(function(i, obj){
            self.gameContainer.createEnemyBird($(obj).attr("img"), $(obj).attr("x"), $(obj).attr("y"), $(obj).attr("direction"));
        });
        $(level).find('balloon').each(function(i, obj){
            self.gameContainer.createBalloon($(obj).attr("img"), $(obj).attr("x"), $(obj).attr("y"), $(obj).attr("direction"));
        });
        $(level).find('egg').each(function(i, obj){
            self.gameContainer.createBird($(obj).attr("x"), $(obj).attr("y"));
            self.gameContainer.bird.setMaxRotations(self.gameData.getEggDataForLevel(self.stats.level).getAttribute("maxRotations"));
            self.gameContainer.bird.setEvolution(self.gameData.getEggDataForLevel(self.stats.level).getAttribute("evolution"));
        });
        $(level).find('nest').each(function(i, obj){
            self.gameContainer.createNest($(obj).attr("x"), $(obj).attr("y"), $(obj).attr("start"));
        });
        $(level).find('miniTree').each(function(i, obj){
            self.gameContainer.createMiniTree( $(obj).attr("img"), $(obj).attr("x"));
        });
        $(level).find('cloud').each(function(i, obj){
            self.gameContainer.createCloud($(obj).attr("img"), $(obj).attr("x"), $(obj).attr("y"));
        });
        $(level).find('timeCoin').each(function(i, obj){
            self.gameContainer.createTimeCoin($(obj).attr("x"), $(obj).attr("y"), $(obj).attr("worth"), i);
        });
    }


    //**
    //
    //
    // --------------- CREATE STATIC GAME INFO

    function createStatistics(){
        this.stats = new Statistics(20, 20);
        this.stats.view.addEventListener(Statistics.LEVELS_CLICKED, showLevelsScreen);
        this.stats.view.addEventListener(Statistics.TIME_OUT, showGameOverScreen);
        stage.addChild(this.stats.view);
    }

    function createScreenManager(){
        this.screenManager = new ScreenManager();
        stage.addChild(this.screenManager.view);
    }


    //**
    //
    //
    // --------------- GAME NAVIGATION HANDLERS

    function showStartScreen(){
        self.screenManager.showScreen(ScreenManager.START);
        self.screenManager.view.addEventListener(StartScreen.START, function(e){
            showLevelsScreen();
        });
        self.screenManager.view.addEventListener(StartScreen.OPTIONS, function(e){
            showOptionsScreen();
        });
    }

    function showLevelsScreen(){
        self.isPaused = true;
        self.screenManager.showLevelsScreen(self.gameData);
        self.screenManager.view.addEventListener(LevelNest.LEVEL_SELECTED, function(e){
            self.stats.setLevel(e.levelIndex);
            preloadLevel(e.levelIndex);
        });
    }

    function showOptionsScreen(){
        self.isPaused = true;
        self.screenManager.showOptionsScreen(self.gameData);
        self.screenManager.view.addEventListener(StartScreen.SAVE, function(e){

        });
    }

    function preloadLevel(levelIndex){
        self.preloadManager.preloadLevel(self.gameData.getManifestForLevel(levelIndex));
    }

    function showInstructionsScreen(instructionsData){
        console.log(instructionsData);
        self.isPaused = true;
        self.screenManager.showInstructionsScreen(instructionsData);
        self.screenManager.view.addEventListener(InstructionsScreen.INSTRUCTIONS_DONE, function(e){
            self.gameData.storeGamerInstructionGiven(self.stats.level);
            startGame();
        });
    }

    function startGame(){
        drawLevel();
        self.isPaused = false;
        self.collisionDetected = false;
        self.stats.resetStats();
        SoundManager.startSounds();
        self.gameContainer.showSpacebarInstruction();
    }

    function showGameOverScreen(){
        if(!self.isPaused){
            SoundManager.playGameOver();
            self.screenManager.showScreen(ScreenManager.GAME_OVER);
            self.screenManager.view.addEventListener(GameOverScreen.RESTART_LEVEL, restartLevelHandler);
            self.isPaused = true;
        }
    }

    function showNextLevelScreen(){
        if(!self.isPaused){
            SoundManager.playSuccess();
            self.gameData.storeGamerLevelData(this.stats.level, this.stats.getStars()); // KEEP GAMER DATA STORED
            self.isPaused = true;
            self.screenManager.showNextLevelScreen(this.stats.level, this.stats.getStars());
            self.screenManager.view.addEventListener(NextLevelScreen.NEXT_LEVEL, nextLevelHandler);
            self.screenManager.view.addEventListener(NextLevelScreen.PLAY_AGAIN, restartLevelHandler);
        }
    }

    function restartLevelHandler(e){
        startGame();
        self.isPaused = false;
        self.collisionDetected = false;
    }

    function nextLevelHandler(e){
        self.stats.levelUp();
        preloadLevel(self.stats.level);
    }


    //**
    //
    //
    // --------------- EGG

    function launchEgg(){
        if(self.levelStarted || self.isPaused)
        {
            return;
        }
        self.gameContainer.removeSpacebarInstruction();
        this.gameContainer.bird.push();
        this.gameContainer.bird.view.addEventListener(Bird.DIED, function(){
            showGameOverScreen();
        });
        self.levelStarted = true;
    }

    function catchedCoinHandler(e){
        self.stats.earnTime();
        self.gameContainer.view.removeEventListener(GameContainer.COIN_REMOVED, catchedCoinHandler);
        SoundManager.playCoinCatched();
    }


    // --------------- TICK

    function tick(){
        stage.update();
        world.DrawDebugData();
        world.Step(1/60, 10, 10);
        world.ClearForces();
    }

    init();

})();


