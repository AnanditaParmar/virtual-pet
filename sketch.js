var dog,dogImg,dogImg1;
var database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObject;

function preload(){
   dogImg=loadImage("Images/Dog.png");
   dogImg1=loadImage("Images/happy dog.png");
  }

//Function to set initial environment
function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  dog=createSprite(450,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 

  feed=createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  foodObject=new Food();

}

// function to display UI
function draw() {
  background(46,139,87);
  foodObject.display();
  fedTime=database.ref("fedTime");
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
 
  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(dogImg1);
    
  }
textSize(15);
if(lastFed>=12){
  text("Last Feed: " + lastFed%12 + "p.m." , 350,30);
}
else if(lastFed===0){
  text("Last Feed : 12 a.m." , 350,30);
}
else{
  text("Last Feed:" + lastFed + "a.m." , 350,30);
}
  drawSprites();
  fill(255,255,254);
  stroke("black");
  text("Food remaining : "+foodS,470,200);
  textSize(13);
  text("Note: Press UP_ARROW Key To Feed Drago Milk!",130,10,300,20);
}

//Function to read values from DB
function readStock(data){
  foodS=data.val();
  foodObject.updatefoodStock(foodS);
}

//Function to write values in DB
function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(dogImg1);
  if(foodObject.getfoodStock()<= 0){
    foodObject.updatefoodStock(foodObject.getfoodStock()*0);

  }
  else{
    foodObject.updatefoodStock(foodObject.getfoodStock()-1);
  }
  database.ref("/").update({
    Food:foodObject.getfoodStock(),
    fedTime:hour()
  })
}
function addFoods(){
    foodS++;
    database.ref("/").update({
      food:foodS
    })
}