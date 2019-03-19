import UIPlugin from "./rexTemplates/ui/ui-plugin.js";



class Boot extends Phaser.Scene
{
    constructor(){
        super('Boot');
        this.loaded;
    }

    preload(){

        this.load.image('preloaderBackground', 'Assets/Sprites/preloader_main_bg.jpg');
        this.load.image('preloadBar', 'Assets/Sprites/preloader_mainbar.jpg');
        this.load.image('preloaderFront','Assets/Sprites/Preloader_front.png');
        this.load.image('preloaderBack', 'Assets/Sprites/preloader_back.jpg');
        this.load.image('preloaderEffect', 'Assets/Sprites/preloader_effect.png');
        this.load.image('logo_horizontal', 'Assets/Sprites/logo-horizontal.png');


        this.load.once('complete', function () {

            console.log('complete preloader');
        });

    }

    create(){
        this.scene.start('Preloader');


    }
}



class Preloader extends Phaser.Scene
{

    constructor(){
        super('Preloader');
    }

    preload(){

        let background = this.placeBackground('preloaderBackground');
        let progressBar = this.placePreloadBar('preloadBar');
        let logoHorizontal = this.placeLogo('logo_horizontal');
        //let progressEffect = this.add.sprite(progressBar.x - progressBar.width/2, progressBar.y - 10,'preloaderEffect');
       // progressEffect.setDisplaySize(50, progressBar.height - 10);


        this.load.on('progress', function (value) {
            console.log(value);
            progressBar.setCrop(0,0,window.innerWidth * value, 35);
            //progressEffect.x = (progressBar.x - progressBar.width/2) - 142 +   window.innerWidth * value;
        });

        this.load.on('fileprogress', function (file) {
            console.log(file.src);
        });

        this.load.on('complete', function () {
            background.destroy();
            progressBar.destroy();
            console.log('complete');
        });

        this.load.image('arrow', 'Assets/Sprites/Arrow.png');
        this.load.image('button_big', 'Assets/Sprites/Button_big.png');
        this.load.image('button_regular', 'Assets/Sprites/Button_regular.png');
        this.load.image('install_text', 'Assets/Sprites/text_install.png');
        this.load.image('character', 'Assets/Sprites/Character.png');
        this.load.image('hor_text', 'Assets/Sprites/Horizontal_text_BG.png');
        this.load.image('ver_text', 'Assets/Sprites/vertical_Text_BG.png');
        this.load.image('icon_farm', 'Assets/Sprites/icon_farm.png');
        this.load.image('icon_gold', 'Assets/Sprites/icon_gold.png');
        this.load.image('icon_ore', 'Assets/Sprites/icon_ore.png');
        this.load.image('icon_frame', 'Assets/Sprites/icon_frame.png');
        this.load.image('icon_resource_food', 'Assets/Sprites/icon_resource_food.png');
        this.load.image('icon_resource_gold', 'Assets/Sprites/icon_resource_gold.png');
        this.load.image('icon_resource_ore', 'Assets/Sprites/icon_resource_ore.png');
        this.load.image('background', 'Assets/Sprites/main_bg.jpg');
        this.load.image('elipse', 'Assets/Sprites/Ellipse-1.png');
        this.load.image('mark_light', 'Assets/Sprites/mark_Light.png');
        this.load.image('mine_farm', 'Assets/Sprites/mine_farm.png');
        this.load.image('mine_ore', 'Assets/Sprites/Mine_Ore.png');
        this.load.image('mine_villa', 'Assets/Sprites/mine_villa.png');
        this.load.image('popup', 'Assets/Sprites/popup.png');
        this.load.image('arrow', 'Assets/Sprites/Arrow.png');

        this.load.audio('popup', 'Assets/Audio/sound_popup.mp3');
        this.load.audio('build', 'Assets/Audio/sound_build.mp3');
        this.load.audio('build_placed', 'Assets/Audio/sound_building_placed.mp3');
        this.load.audio('click', 'Assets/Audio/sound_button_click.mp3');
        this.load.audio('base_view', 'Assets/Audio/music_base_view.mp3');
        this.load.audio('collect_resource', 'Assets/Audio/sound_collect_resource.mp3');
    }

    placePreloadBar(image){
        let preloaderBack = this.add.sprite(window.innerWidth/2,(window.innerHeight/4 * 3) - 5,'preloaderBack');
        preloaderBack.setDisplaySize(window.innerWidth/2, 20);
        let preloaderBar = this.add.sprite(window.innerWidth/2,window.innerHeight/4 * 3,image);
        preloaderBar.setDisplaySize(window.innerWidth/2, 35);
        let preloaderFront = this.add.sprite(window.innerWidth/2,(window.innerHeight/4 * 3) - 10,'preloaderFront');
        preloaderFront.setDisplaySize(window.innerWidth/2 + 60, 45);
        return preloaderBar;
    }

    placeBackground(image){
        let background = this.add.sprite(0, 0, image);
        let coof;
        if (window.innerHeight/window.innerWidth > 1) {
            coof = background.height / background.width;
            background.setOrigin(0).setDisplaySize(window.innerHeight * coof, window.innerHeight);
            background.x = (window.innerWidth - background.displayWidth)/2;
        } else {
            coof = background.width / background.height;
            background.setOrigin(0).setDisplaySize(window.innerWidth, window.innerWidth * coof);
            background.y = (window.innerHeight - background.displayHeight)/2;
        }
        return background;
    }

    placeLogo(image){
        let logo = this.add.sprite(0,0,image);
        let coof = logo.height / logo.width;
        logo.setDisplaySize(window.innerWidth/2.5,window.innerWidth/2.5 * coof );
        logo.x = window.innerWidth/2;
        logo.y = 100;
        return logo;
    }

    create(){
        this.scene.start('Game');
    }

}

class Game extends Phaser.Scene
{

    constructor() {
        super('Game');
    }

    preload(){
        this.nextReason = Object.freeze({"chooseBuilding":1, "placeBuilding":2, "getLevel4":3});
        this.holePlaces = [new WholePlace(-70, -55),
            new WholePlace(-150, -150),
            new WholePlace(-30, -180),
            new WholePlace(120, -130),
            new WholePlace(125, -55)];
        this.steps = [new Step(true, false, this.nextReason.chooseBuilding),
                    new Step(true, true,this.nextReason.placeBuilding),
                    new Step(false, true,this.nextReason.getLevel4)
        ];
        this.buildingIcons = ['mine_farm','mine_ore','mine_villa'];
        this.buildingsOnMap = ['icon_farm','icon_ore','icon_gold'];
        this.placedBuildings = [];
        this.buildingsCounter = 0;
        this.isTutorial = true;
    }

    create(){
        this.main_background = this.placeBackground('background');
        this.currentStep = 0;
        this.placeText();
        this.character = this.placeCharacter('character');
        this.logoHorizontal = this.placeLogo('logo_horizontal');
        this.buildings = this.placeBuildingsButton();
        this.addArrow();
        this.nextStep();
        this.createInstallButton();
        this.canChoose = true;
        this.addButtonListeners();
        this.scale.on('resize', this.resize, this);

    }

    // Tutorial steps controller
    nextStep(){
        if (this.steps[this.currentStep].reason === this.nextReason.getLevel4){
            this.isTutorial = false;
            this.removeTint();
        }else {
            if (this.steps[this.currentStep].isTined)
                this.setTint();
            else
                this.removeTint();
            if (this.steps[this.currentStep].holePlaced && this.holes === undefined) {
                this.holes = this.placeHoles('mark_light');
                this.addHolesListener();
            }
            this.resizeBuildingButtons();
        }
        switch(this.steps[this.currentStep].reason){
            case this.nextReason.chooseBuilding:
                break;
            case this.nextReason.placeBuilding:
                break;
            case this.nextReason.getLevel4:
                this.buildings.forEach(element => {
                    element.clearTint();
                });
                this.arrow.destroy();
                this.character.destroy();
                this.textContainer.destroy();
                this.buildingButContainer.x = window.innerWidth/2;
                this.buildingButContainer.y = (window.innerHeight/5) * 3.5;
                this.installButContainer.x = window.innerWidth/2;
                break;
        }
    }

    // Adding listeners
    // Building buttons listeners
    addButtonListeners(){
            this.buildings.forEach(element => {
                element.on('pointerup', function () {
                    if (this.isTutorial){
                        this.tutorialBuildingActions(element);
                    }else{
                        this.freePlayBuildingActions(element);
                    }
                }, this);
            });
    }

    tutorialBuildingActions(element){
        if (!element.getData('active')) {
            if (this.canChoose) {
                this.stopArrow(element.getData('id'));
                this.canChoose = false;
                this.currentStep++;
                this.nextStep();
                this.canChoose = false;
                this.currentBuilding = this.buildingsOnMap[element.getData('id')]
            }
            element.setData('active', true);
            this.activeBuildingBut = element;
        }

    }

    freePlayBuildingActions(element){
        if (!element.getData('active')) {
            this.resizeBuildingButtons();
            element.scaleX = 0.3;
            element.scaleY = 0.3;
            this.canChoose = false;
            this.currentBuilding = this.buildingsOnMap[element.getData('id')];
            this.activeBuildingBut.setData('active', false);
            element.setData('active', true);
            this.activeBuildingBut = element;
        }
    }
    // Holes buttons listeners
    addHolesListener(){
            this.holes.forEach(element => {
            element.on('pointerup', function () {
                if (this.isTutorial){
                    this.tutorialHolesActions(element);
                }else{
                    this.freePlayHolesActions(element)
                }
                }, this);
            });

    }

    tutorialHolesActions(element){
        this.placeBuilding(new WholePlace(element.x, element.y),
            window.innerHeight/window.innerWidth > 1? 110/this.vertCoof : 110/this.horCoof,
            this.currentBuilding, element.getData('id'));
        this.canChoose = true;
        this.currentStep++;
        this.nextStep();
        this.activeBuildingBut.setData('active', false);
        element.destroy();
    }

    freePlayHolesActions(element){
        this.placeBuilding(new WholePlace(element.x, element.y),
            window.innerHeight/window.innerWidth > 1? 110/this.vertCoof : 110/this.horCoof,
            this.currentBuilding, element.getData('id'));
        this.activeBuildingBut.setData('active', false);
        element.destroy();
    }

    // Resize user interface
    resize(){
        this.cameras.resize(window.innerWidth, window.innerHeight);
        this.resizeBackground();
        this.resizeCharacter();
        this.resizeText();
        this.resizeLogo();
        if (this.steps[this.currentStep].holePlaced)
            this.resizeHoles();
        this.resizeBuildingButtons();
        this.replaceInstallButton();
        this.replaceArrow();
    }

    // Methods for tint
    setTint(){
        this.main_background.setTint(0x444444);
    }

    removeTint(){
        this.main_background.clearTint();
    }

    // Work with buildings buttons
    placeBuildingsButton(){
        this.buildingButContainer = this.add.container((window.innerWidth/3) * 2,(window.innerHeight/5) * 3.2);
        let buildings = [];
        let positions = [-window.innerWidth/5, 0, window.innerWidth/5];
        for (let i = 0;i < 3;i++){
            buildings[i] = this.add.sprite(positions[i],0,this.buildingIcons[i]);
            let width = window.innerWidth/6;
            let coof = buildings[i].height/buildings[i].width;
            buildings[i].setDisplaySize(width,width*coof);
            buildings[i].setInteractive();
            buildings[i].setData('id', i);
            buildings[i].setData('name', this.buildingIcons[i]);
            buildings[i].setData('active', false);

        }
        this.buildingButContainer.add(buildings);
        return buildings;
    }

    resizeBuildingButtons(){
        let positions = [];
        if (window.innerHeight/window.innerWidth > 1)
            positions = [-window.innerWidth/5, 0, window.innerWidth/5];
        else
            positions = [-window.innerWidth/7, 0, window.innerWidth/7];
        let counter = 0;
        this.buildingButContainer.iterate((element) =>{
            let coof = element.height/element.width;
            let width = 0;
            if (window.innerHeight/window.innerWidth > 1)
                width = window.innerWidth/5;
            else
                width = window.innerWidth/7;
            element.setDisplaySize(width,width*coof);
            element.x = positions[counter];
            counter++;
        });
        if (window.innerHeight/window.innerWidth > 1){
            this.buildingButContainer.y = (window.innerHeight/5) * 3.2;
            this.buildingButContainer.x = (window.innerWidth/3) * 1.9;
        }else{
            this.buildingButContainer.y = (window.innerHeight/6)  * 5;
            this.buildingButContainer.x = (window.innerWidth/3) * 2;
        }
        if (this.currentStep >= 2){
            this.buildingButContainer.x = window.innerWidth/2;
            this.buildingButContainer.y = (window.innerHeight/5) * 3.5;
        }
    }

    placeText(){
        this.textContainer = this.add.container(0,0);
        if (window.innerHeight/window.innerWidth > 1) {
            this.textContainer.x = window.innerWidth/2;
            this.textContainer.y = (window.innerHeight/5) * 4;
            let back_text = this.add.sprite(0, 0, 'ver_text');
            back_text.setDisplaySize(window.innerWidth, window.innerHeight/7);
            back_text.setData('name', 'back');
            let text = this.add.text(-40, - 20, 'My captain,\nBuild Constructions', {fontSize: '25px', align: 'center'});
            text.setData('name', 'text');
            this.textContainer.add(back_text);
            this.textContainer.add(text)
        }else{
            this.textContainer.x = (window.innerWidth / 7) * 2;
            this.textContainer.y = (window.innerHeight/5) * 4;
            let back_text = this.add.sprite(0, 0, 'ver_text');
            back_text.setDisplaySize(window.innerWidth/5, window.innerHeight/3);
            back_text.setData('name', 'back');
            let fontS = window.innerWidth/63;
            let text = this.add.text(0, 0, 'My captain,\nBuild Constructions', {fontSize: fontS.toString() + 'px', align: 'center'});
            text.x = -text.width/2;
            text.y = -((text.height/2) * 3);
            text.setData('name', 'text');
            this.textContainer.add(back_text);
            this.textContainer.add(text)
        }
    }

    resizeText(){
        if (window.innerHeight/window.innerWidth > 1) {
            this.textContainer.x = window.innerWidth/2;
            this.textContainer.y =(window.innerHeight/5) * 4;
            this.textContainer.list.forEach(element => {
                let coof = 0;
                switch(element.getData('name')){
                    case 'back':
                        coof = element.height/element.width;
                        element.setDisplaySize(window.innerWidth, window.innerHeight/7);
                        break;
                    case 'text':
                        element.setFontSize('25px');
                        element.x = -40;
                        element.y = -20;
                        break;
                }
            });
        }else {
            this.textContainer.x = (window.innerWidth / 7) * 2;
            this.textContainer.y = (window.innerHeight/5) * 4;
            this.textContainer.list.forEach(element => {
                let coof = 0;
                switch(element.getData('name')){
                    case 'back':
                        coof = element.height/element.width;
                        element.setDisplaySize(window.innerWidth/5, window.innerHeight/3);
                        break;
                    case 'text':
                        let fontS = window.innerWidth/63;
                        element.setFontSize( fontS.toString() + 'px');
                        element.setAlign('center');
                        element.x = -element.width/2;
                        element.y = -((element.height/2) * 3);
                        break;
                }
            });
        }

    }

    createInstallButton() {
        this.installButContainer = this.add.container(0, 0);
        if (window.innerHeight/window.innerWidth > 1){
            this.installButContainer.x = (window.innerWidth / 3) * 2;
            this.installButContainer.y = window.innerHeight/5;
            let button_back = this.add.image(-20, 0, 'button_regular');
            let coof = button_back.height / button_back.width;
            button_back.setDisplaySize(window.innerWidth / 2, window.innerWidth / 2 * coof);
            button_back.setData('name', 'back');
            let text = this.add.image(0, 0, 'install_text');
            coof = text.height / text.width;
            text.setDisplaySize(window.innerWidth / 3, window.innerWidth / 3 * coof);
            text.setData('name', 'text');
            this.installButContainer.add(button_back);
            this.installButContainer.add(text);
            text.setInteractive();
            text.on('pointerup', function () {
                let win = window.open('https://play.google.com/store/apps/details?id=com.whaleapp.piratesails', '_blank');
                win.focus();
            });
            this.installButContainer.y = window.innerHeight - text.displayHeight - 30;
        }else{
            this.installButContainer.x = (window.innerWidth / 7) * 2;
            this.installButContainer.y = (window.innerHeight/5) * 4.3;
            let button_back = this.add.image(-20, 0, 'button_regular');
            let coof = button_back.height / button_back.width;
            button_back.setDisplaySize(window.innerWidth / 5, window.innerWidth / 5 * coof);
            button_back.setData('name', 'back');
            let text = this.add.image(0, 0, 'install_text');
            coof = text.height / text.width;
            text.setDisplaySize(window.innerWidth / 8, window.innerWidth / 8 * coof);
            text.setData('name', 'text');
            this.installButContainer.add(button_back);
            this.installButContainer.add(text);
            text.setInteractive();
            text.on('pointerup', function () {
                let win = window.open('https://play.google.com/store/apps/details?id=com.whaleapp.piratesails', '_blank');
                win.focus();
            });
        }
        this.tweens.add({
            targets: this.installButContainer,
            scaleX: 0.9,
            scaleY: 0.9,
            ease: 'Linear',
            duration: 400,
            repeat: -1,
            yoyo: true
        });
    }

    replaceInstallButton(){
        if (window.innerHeight/window.innerWidth > 1){
            this.installButContainer.x = (window.innerWidth / 3) * 2;
            this.installButContainer.y = window.innerHeight;
            this.installButContainer.list.forEach(element => {
                let coof = 0;
                switch(element.getData('name')){
                    case 'back':
                        coof = element.height / element.width;
                        element.setDisplaySize(window.innerWidth / 2, window.innerWidth / 2 * coof);
                        break;
                    case 'text':
                        coof = element.height / element.width;
                        element.setDisplaySize(window.innerWidth / 3, window.innerWidth / 3 * coof);
                        this.installButContainer.y = window.innerHeight - element.displayHeight - 30;
                        break;
                }
            });

        }else{
            this.installButContainer.x = (window.innerWidth / 7) * 2;
            this.installButContainer.y = (window.innerHeight/5) * 4.3;
            this.installButContainer.list.forEach(element => {
                let coof = 0;
                switch(element.getData('name')){
                    case 'back':
                        coof = element.height / element.width;
                        element.setDisplaySize(window.innerWidth / 5, window.innerWidth / 5 * coof);
                        break;
                    case 'text':
                        coof = element.height / element.width;
                        element.setDisplaySize(window.innerWidth / 8, window.innerWidth / 8 * coof);
                        break;
                }
            });
        }
    }

    // Work with background
    placeBackground(image){
        let background = this.add.sprite(0, 0, image);
        let coof;
        if (window.innerHeight/window.innerWidth > 1) {
            coof = background.height / background.width;
            background.setOrigin(0).setDisplaySize(window.innerHeight * coof, window.innerHeight);
            background.x = (window.innerWidth - background.displayWidth)/2;
        } else {
            coof = background.width / background.height;
            background.setOrigin(0).setDisplaySize(window.innerWidth, window.innerWidth * coof);
            background.y = (window.innerHeight - background.displayHeight)/2;
        }
        return background;
    }

    resizeBackground(){
        let coof;
        if (window.innerHeight/window.innerWidth > 1) {
            coof = this.main_background.height / this.main_background.width;
            this.main_background.setOrigin(0).setDisplaySize(window.innerHeight * coof, window.innerHeight);
            this.main_background.x = (window.innerWidth - this.main_background.displayWidth)/2;
        } else {
            coof = this.main_background.width / this.main_background.height;
            this.main_background.setOrigin(0).setDisplaySize(window.innerWidth, window.innerWidth * coof);
            this.main_background.y = (window.innerHeight - this.main_background.displayHeight)/2;
        }
        if (this.holesContainer !== undefined) {
            this.holesContainer.x = window.innerWidth / 2;
            this.holesContainer.y = window.innerHeight / 2;
            this.holesContainer.setSize(this.main_background.displayWidth, this.main_background.displayHeight);
        }
        if (this.steps[this.currentStep].reason === this.nextReason.getLevel4) {
            this.buildingButContainer.x = window.innerWidth / 2;
            this.buildingButContainer.y = (window.innerHeight / 5) * 4;
        }else {
            this.buildingButContainer.x = (window.innerWidth / 3) * 1.9;
            this.buildingButContainer.y = (window.innerHeight / 5) * 3.2;
        }

    }

    // Work with character
    placeCharacter(image){
        let character = this.add.sprite(0,0, image);
        let coof = character.height/character.width;
        if (window.innerHeight/window.innerWidth > 1){
            character.setDisplaySize(window.innerHeight/2.5 / coof, window.innerHeight/2.5);
        }else{
            character.setDisplaySize(window.innerHeight/2 / coof, window.innerHeight/2);

        }
        character.x = character.displayWidth/2;
        character.y = window.innerHeight - character.displayHeight/2;
        return character;
    }

    resizeCharacter(){
        let coof = this.character.height/this.character.width;

        if (window.innerHeight/window.innerWidth > 1){
            this.character.setDisplaySize(window.innerHeight/2.5 / coof, window.innerHeight/2.5);
        }else{
            this.character.setDisplaySize(window.innerHeight/2 / coof, window.innerHeight/2);
        }
        this.character.x = this.character.displayWidth/2;
        this.character.y = window.innerHeight - this.character.displayHeight/2;
    }

    // Work with logo
    placeLogo(image){
        let logo = this.add.sprite(0,0,image);
        let coof = logo.height / logo.width;
        logo.setDisplaySize(200,200 * coof);
        if (window.innerHeight/window.innerWidth > 1) {
            logo.x = window.innerWidth / 2;
            logo.y = 100;
        }else{
            logo.x = window.innerWidth - 150;
            logo.y = 100;
        }
        return logo;
    }

    resizeLogo(){
        if (window.innerHeight/window.innerWidth > 1) {
            this.logoHorizontal.x = window.innerWidth / 2;
        }else{
            this.logoHorizontal.x = window.innerWidth - 150;
        }
        this.logoHorizontal.y = 100;
    }

    // Method for placing buildings
    placeBuilding(position, width, image, id){
        let building = this.add.sprite(position.x ,position.y - 40, image);
        let coof = building.width/building.height;
        building.setDisplaySize(width*0.8,width*0.8/coof);
        this.tweens.add({
            targets: building,
            y: position.y - 20,
            ease: 'Linear',
            duration: 600,
            repeat: 0
        });
        building.setData('id', id);
        this.placedBuildings[this.buildingsCounter] = building;
        this.holesContainer.add(building);
        this.buildingsCounter++;
    }

    replaceBuildings(){
        this.placedBuildings.forEach(element => {
            let width = 0;
            if (window.innerHeight/window.innerWidth > 1) {
                element.x = this.holePlaces[element.getData('id')].x / this.vertCoof;
                element.y = this.holePlaces[element.getData('id')].y / this.vertCoof - 20;
                width = 110 / this.vertCoof;
            }
            else {
                element.x = this.holePlaces[element.getData('id')].x / this.horCoof;
                element.y = this.holePlaces[element.getData('id')].y / this.horCoof - 20;
                width = 110 / this.horCoof;
            }
            let coof = element.width/element.height;
            element.setDisplaySize(width*0.8,width*0.8/coof);
        });
    }
    // Work with holes
    placeHoles(image){
        this.holesContainer = this.add.container(window.innerWidth/2,window.innerHeight/2);
        this.holesContainer.setSize(this.main_background.displayWidth, this.main_background.displayHeight);
        let holes = [];
        // Hooles adjusted for screen size 927/927
        this.vertCoof = 927/window.innerHeight;
        this.horCoof = 927/window.innerWidth;
        for (let i = 0;i < this.holePlaces.length;i++){
            let width;
            if (window.innerHeight/window.innerWidth > 1) {
                holes[i] = this.add.sprite(this.holePlaces[i].x / this.vertCoof, this.holePlaces[i].y / this.vertCoof, image);
                width = 110 / this.vertCoof;
            }
            else {
                holes[i] = this.add.sprite(this.holePlaces[i].x / this.horCoof, this.holePlaces[i].y / this.horCoof, image);
                width = 110 / this.horCoof;
            }
            let coof = holes[i].height / holes[i].width;
            holes[i].setDisplaySize(width,width*coof);
            holes[i].setData('id', i);
            holes[i].setInteractive();
        }
        this.holeAnims = this.tweens.add({
            targets: holes,
            scaleX: 0.3,
            scaleY: 0.3,
            ease: 'Linear',
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        this.holesContainer.add(holes);
        return holes;
    }

    resizeHoles(){
        this.vertCoof = 927/window.innerHeight;
        this.horCoof = 927/window.innerWidth;
        let counter = 0;
        this.tweens.killTweensOf(this.holes);
        this.holesContainer.iterate(element=>{
            let width;
            if (window.innerHeight/window.innerWidth > 1) {
                element.x = this.holePlaces[counter].x / this.vertCoof;
                element.y = this.holePlaces[counter].y / this.vertCoof;
                width = 110 / this.vertCoof;
            }
            else {
                element.x = this.holePlaces[counter].x / this.horCoof;
                element.y = this.holePlaces[counter].y / this.horCoof;
                width = 110 / this.horCoof;
            }
            let coof = element.height / element.width;
            element.setDisplaySize(width,width*coof);
            counter++;
        });
        if (this.placedBuildings.length > 0)
            this.replaceBuildings();
        this.holeAnims = this.tweens.add({
            targets: this.holes,
            scaleX: 0.3,
            scaleY: 0.3,
            ease: 'Linear',
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    // Work with arrow
    addArrow(){
        this.arrow = this.add.sprite(this.buildingButContainer.x + this.buildings[0].x,
            this.buildingButContainer.y + this.buildings[0].y - this.buildings[0].displayWidth,'arrow');
        let coof = this.arrow.height/this.arrow.width;
        this.arrow.setDisplaySize(window.innerWidth/25, window.innerWidth/20 * coof);
        this.tweens.add({
           targets: this.arrow,
            x: this.buildingButContainer.x + this.buildings[2].x,
            ease: 'Linear',
            repeat: -1,
            yoyo: true
        });

    }

    replaceArrow(){
        this.tweens.killTweensOf(this.arrow);
        this.arrow.x = this.buildingButContainer.x + this.buildings[0].x;
        this.arrow.y = this.buildingButContainer.y + this.buildings[0].y - this.buildings[0].displayWidth;
        let coof = this.arrow.height/this.arrow.width;
        this.arrow.setDisplaySize(window.innerWidth/25, window.innerWidth/20 * coof);
        this.tweens.add({
            targets: this.arrow,
            x: this.buildingButContainer.x + this.buildings[2].x,
            ease: 'Linear',
            repeat: -1,
            yoyo: true
        });
    }

    stopArrow(id){
        this.tweens.killTweensOf(this.arrow);
        this.buildings.forEach(element => {
           if (element.getData('id') === id){
               this.arrow.y = this.buildingButContainer.y + this.buildings[id].y - this.buildings[id].displayWidth;
               this.tweens.add({
                   targets: this.arrow,
                   x: this.buildingButContainer.x + this.buildings[id].x,
                   ease: 'Linear',
                   duration: 300,
                   yoyo: false
               });
           }else{
               element.setTint(0x444444);
           }
        });
    }


    // Clearing all UI except background
    clearAll(){
        do{
            this.holesContainer.list[this.holesContainer.list.length - 1].destroy();
        }while(this.holesContainer.list.length !== 0);
        this.character.destroy();
        do{
            this.buildingButContainer.list[this.buildingButContainer.list.length - 1].destroy();
        }while(this.buildingButContainer.list.length !== 0);
        this.placedBuildings.forEach(element =>{
            element.destroy();
        });
        this.placedBuildings = [];
        this.installButContainer.destroy();
    }

    showLevelUp(){
        this.clearAll();
        this.setTint();
        this.levelUpContainer = this.add.container(window.innerWidth/2, (window.innerHeight/4) * 3);
        let popup = this.add.sprite(0, 0, 'popup');
        let coof = popup.height/popup.width;
        popup.setDisplaySize(window.innerWidth/2, (window.innerWidth/2) * coof);
        this.levelUpContainer.add(popup);
        let txt = this.add.text(0, 20, 'Level up!', {fontSize: '35px'});
        txt.x = -txt.width/2;
        this.levelUpContainer.add(txt);
        this.tweens.add({
            targets: this.levelUpContainer,
            y: window.innerHeight/2,
            ease: 'Linear',
            duration: 1000,
            repeat: 0
        });
        this.time.delayedCall(2000, ()=> {this.scene.start('Finish');},[],0);
    }

    update(){
        if (this.buildingsCounter === 4){
            this.time.delayedCall(1000, ()=>{
                this.showLevelUp();
            },[],0);
            this.buildingsCounter++;
        }
    }

}

class WholePlace{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class Step{
    constructor(isTined, holePlaced, reason){
        this.reason = reason;
        this.isTined = isTined;
        this.holePlaced = holePlaced;
    }
}

class Finish extends Phaser.Scene
{
    constructor() {
        super('Finish');
    }

    create(){
        this.placeBackground('preloaderBackground');
        this.placeLogo('logo_horizontal');
        this.placeTextContainer();
        this.createInstallButton();
        this.scale.on('resize', this.resize, this);
    }

    resize(){
        this.cameras.resize(window.innerWidth, window.innerHeight);
        this.resizeBackground();
        this.resizeLogo();
        this.resizeTextContainer();
        this.resizeInstallButton();
    }

    placeBackground(image){
        this.main_background = this.add.sprite(0, 0, image);
        let coof;
        if (window.innerHeight/window.innerWidth > 1) {
            coof = this.main_background.height / this.main_background.width;
            this.main_background.setOrigin(0).setDisplaySize(window.innerHeight * coof, window.innerHeight);
            this.main_background.x = (window.innerWidth - this.main_background.displayWidth)/2;
        } else {
            coof = this.main_background.width /this.main_background.height;
            this.main_background.setOrigin(0).setDisplaySize(window.innerWidth, window.innerWidth * coof);
            this.main_background.y = (window.innerHeight - this.main_background.displayHeight)/2;
        }
    }

    resizeBackground(){
        let coof;
        if (window.innerHeight/window.innerWidth > 1) {
            coof = this.main_background.height / this.main_background.width;
            this.main_background.setOrigin(0).setDisplaySize(window.innerHeight * coof, window.innerHeight);
            this.main_background.x = (window.innerWidth - this.main_background.displayWidth)/2;
        } else {
            coof = this.main_background.width / this.main_background.height;
            this.main_background.setOrigin(0).setDisplaySize(window.innerWidth, window.innerWidth * coof);
            this.main_background.y = (window.innerHeight - this.main_background.displayHeight) / 2;
        }
    }

    placeLogo(image){
        this.logoHorizontal = this.add.sprite(0,0,image);
        let coof = this.logoHorizontal.height / this.logoHorizontal.width;
        this.logoHorizontal.setDisplaySize(300,300 * coof);
        if (window.innerHeight/window.innerWidth > 1) {
            this.logoHorizontal.x = window.innerWidth / 2;
            this.logoHorizontal.y = 100;
        }else{
            this.logoHorizontal.x = window.innerWidth - 250;
            this.logoHorizontal.y = 100;
        }
    }

    resizeLogo(){
        if (window.innerHeight/window.innerWidth > 1) {
            this.logoHorizontal.x = window.innerWidth / 2;
        }else{
            this.logoHorizontal.x = window.innerWidth - 250;
        }
        this.logoHorizontal.y = 100;
    }

    placeTextContainer(){
        this.textContainer = this.add.container(0,0);
        if (window.innerHeight/window.innerWidth > 1) {
            this.textContainer.x = window.innerWidth / 2;
            this.textContainer.y = (window.innerHeight/4) * 3;
            let back = this.add.sprite(0,0,'ver_text');
            back.setDisplaySize(window.innerWidth/1.5, window.innerHeight/4);
            back.setData('name', 'back');
            this.textContainer.add(back);
            let text = this.add.text(0,0,'Go for new adventures!\n Install full game',{fontSize: '25px', align: 'center'});
            text.setData('name', 'text');
            text.x = -text.width/2;
            text.y = -(text.height/2) * 3;
            this.textContainer.add(text);
        }else {
            this.textContainer.x = window.innerWidth / 2.8;
            this.textContainer.y = (window.innerHeight/5) * 4;
            let back = this.add.sprite(0,0,'ver_text');
            back.setDisplaySize(window.innerWidth/1.8, window.innerHeight/4);
            back.setData('name', 'back');
            this.textContainer.add(back);
            let text = this.add.text(0,0,'Go for new adventures!\n Install full game',{fontSize: '25px', align: 'center'});
            text.setData('name', 'text');
            text.x = -text.width/2;
            text.y = -text.height/2;
            this.textContainer.add(text);
        }
    }

    resizeTextContainer(){
        if (window.innerHeight/window.innerWidth > 1) {
            this.textContainer.x = window.innerWidth / 2;
            this.textContainer.y = (window.innerHeight/4) * 3;
            this.textContainer.list.forEach(element => {
                let coof = 0;
                switch(element.getData('name')){
                    case 'back':
                        coof = element.height/element.width;
                        element.setDisplaySize(window.innerWidth/1.5, window.innerHeight/4);
                        break;
                    case 'text':
                        element.x = -element.width/2;
                        element.y = -(element.height/2) * 3;
                        break;
                }
            });
        }else {
            this.textContainer.x = window.innerWidth / 2.8;
            this.textContainer.y = (window.innerHeight/5) * 4;
            this.textContainer.list.forEach(element => {
                let coof = 0;
                switch(element.getData('name')){
                    case 'back':
                        coof = element.height/element.width;
                        element.setDisplaySize(window.innerWidth/1.8, window.innerHeight/4);
                        break;
                    case 'text':
                        element.x = -element.width/2;
                        element.y = -element.height/2;
                        break;
                }
            });
        }
    }

    createInstallButton(){
        this.buttonContainer = this.add.container(0,0);
        if (window.innerHeight/window.innerWidth > 1) {
            this.buttonContainer.x = window.innerWidth/2;
            this.buttonContainer.y = (window.innerHeight/5) * 4;
            let button_back = this.add.image(-20, 0, 'button_regular');
            let coof = button_back.height / button_back.width;
            button_back.setDisplaySize(window.innerWidth / 2, window.innerWidth / 2 * coof);
            button_back.setData('name', 'button_back');
            let text = this.add.image(0, 0, 'install_text');
            coof = text.height / text.width;
            text.setDisplaySize(window.innerWidth / 3, window.innerWidth / 3 * coof);
            text.setData('name', 'text');
            this.buttonContainer.add(button_back);
            this.buttonContainer.add(text);
            text.setInteractive();
            text.on('pointerup', function () {
                let win = window.open('https://play.google.com/store/apps/details?id=com.whaleapp.piratesails', '_blank');
                win.focus();
            });
        }else{
            this.buttonContainer.x = (window.innerWidth/5) * 4;
            this.buttonContainer.y = (window.innerHeight/6) * 5;
            let button_back = this.add.image(-20, 0, 'button_regular');
            let coof = button_back.height / button_back.width;
            button_back.setDisplaySize(window.innerWidth / 3, window.innerWidth / 3 * coof);
            button_back.setData('name', 'button_back');
            let text = this.add.image(0, 0, 'install_text');
            coof = text.height / text.width;
            text.setDisplaySize(window.innerWidth / 4.3, window.innerWidth / 4.3 * coof);
            text.setData('name', 'text');
            this.buttonContainer.add(button_back);
            this.buttonContainer.add(text);
            text.setInteractive();
            text.on('pointerup', function () {
                let win = window.open('https://play.google.com/store/apps/details?id=com.whaleapp.piratesails', '_blank');
                win.focus();
            });
        }
        this.tweens.add({
           targets: this.buttonContainer,
            scaleX: 0.9,
            scaleY: 0.9,
            ease: 'Linear',
            duration: 400,
            repeat: -1,
            yoyo: true
        });
    }

    resizeInstallButton(){
        if (window.innerHeight/window.innerWidth > 1) {
            this.buttonContainer.x = window.innerWidth/2;
            this.buttonContainer.y = (window.innerHeight/5) * 4;
            this.buttonContainer.list.forEach(element => {
                let coof = 0;
               switch(element.getData('name')){
                   case 'button_back':
                       coof = element.height/element.width;
                       element.setDisplaySize(window.innerWidth / 2, window.innerWidth / 2 * coof);
                       break;
                   case 'text':
                       coof = element.height/element.width;
                       element.setDisplaySize(window.innerWidth / 3, window.innerWidth / 3 * coof);
                       break;
               }
            });
        }else{
            this.buttonContainer.x = (window.innerWidth/5) * 4;
            this.buttonContainer.y = (window.innerHeight/6) * 5;
            this.buttonContainer.list.forEach(element => {
                let coof = 0;
                switch(element.getData('name')){
                    case 'button_back':
                        coof = element.height/element.width;
                        element.setDisplaySize(window.innerWidth / 3, window.innerWidth / 3 * coof);
                        break;
                    case 'text':
                        coof = element.height/element.width;
                        element.setDisplaySize(window.innerWidth / 4.3, window.innerWidth / 4.3 * coof);
                        break;
                }
            });
        }
    }

    update(){
    }
}


let config = {
    type: Phaser.AUTO,
    plugins: {
      scene: [{
       key: 'rexUI',
       plugin: UIPlugin,
       mapping: 'rexUI'
      }]
    },
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'gameContainer',
    scene: [ Boot , Preloader, Game, Finish ],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

let game = new Phaser.Game(config);

//http://localhost/TestGame/index.html