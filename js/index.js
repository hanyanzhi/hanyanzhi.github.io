var bgMusic = document.getElementById("bgMusic");
var boomOneMusic = document.getElementById("boom");
var boomTwoMusic = document.getElementById("boom1");
var boomThreeMusic = document.getElementById("boom2");
var allBoom = document.getElementById("allBoom");
var gameOverMusic = document.getElementById("game_over");
//音频缓存
bgMusic.play();
bgMusic.pause();


//主内容--------------------------------------------------------------------
var rangeX = 0;
var rangeY = 0;
var moveBol = false;

var frameNum = 0;//帧数
//子弹数组,速度,删除bol值
var bullets = [];
var createBulletSpeed = 20;
var bulletSpeed = 10;
var removeBol = false;
var createBulletBol = false;
//怪兽的数组,创建速度
var monsters = [];
var createMonsterSpeed = 25;
var monsterMoveSpeed = 1.6;
var boomNum = 0;
//道具的数组,创建速度
var stages = [];
var createStageSpeed = 600;
var clearMonsterBol = false;
//分数
var scoreNum = 0;
var perishNum = 0;
var gameOverBol = true;

var winkyTimer = null;

var shareBol = false;//分享
var	concernBol = false;//关注
var fillBol = false;//填写信息
//以下的ajax应该是放在一个函数里面
ajaxGetUserDetails();

var allImg = ["img/bg.jpg","img/bomb.png","img/bullet1.png","img/bullet_big.png","img/bottom.png","img/monster_small1.png","img/monster_big1.png","img/hero.png","img/hero_shadow.png","img/clearMonster.png","img/score.png","img/monster_small2.png","img/monster_big2.png","img/rule.jpg","img/logo.png","img/bg.png","img/degerm.png","img/bg_anti.png","img/bg_monster.png","img/bg_instantly.png","img/bg_rank.png","img/bg_prize.png","img/again.png","img/at_once.png","img/monster2.png","img/bg_bigg1.png","img/awards_bg.png","img/beizi.png","img/buling.png","img/chance_over.png","img/close.png","img/convert_fail.png","img/concern.png","img/two.png","img/down_again.png","img/down_at_once.png","img/down_buling.png","img/down_duihuan.png","img/down_gongzuo.png","img/down_iknow.png","img/down_myjp.png","img/down_-prize_now.png","img/down_share_now.png","img/down_share.png","img/down_submit_info.png","img/duihuan.png","img/failed.png","img/gongzuo.png","img/ikonw.png","img/join.png","img/left.png","img/lingqu_succ.png","img/my_awards_bg.png","img/myjp.png","img/prize_now.png","img/queren.png","img/radiance1.png","img/radiance2.png","img/result.png","img/right.png","img/rule.jpg","img/share.png","img/share_now.png","img/shield.png","img/success.png","img/used.png","img/youhui.png","img/yusan.png","img/first.png","img/second.png","img/third.png","img/rank_bg.png","img/catch_now.png","img/info.png"];

var loadOver = [];
loadOver = loadImg(allImg,function(){
	$("#loading").hide();
	homeAnimate();
})

function homeAnimate(){
	$(".home_wrap").show();
    bgMusic.play();
	
	//首页-----------------------------
	setTimeout(function(){
		$(".degerm").addClass("animated fadeInLeft");
		$(".degerm").css({
			opacity: 1
		});
		
	},500);
	$(".degerm").get(0).addEventListener("webkitAnimationEnd",function(){
		$(".degerm .monster_min").css({
			opacity: 1
		});
		$(".degerm .monster_max").css({
			"-webkit-transform": "translateY(0%)",
            "transform": "translateY(0%)",
		});
		setTimeout(function(){
			$(".degerm .monster_max").css({
            		"opacity":1,
			});
		},500);
	})
	
	setTimeout(function() {
		$(".bg_monster").css({
			opacity: 1
		});
		$(".bg_monster").addClass("animated zoomIn");
	}, 1000);

	$(".bg_monster").get(0).addEventListener("webkitAnimationEnd",function(){
		$(".bg_anti").css({
			opacity: 1
		});
		$(".bg_anti").addClass("animated zoomIn");
	})
		
	
	main();
}

function main(){
	var rule = document.getElementById("rule");
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var body = document.getElementsByTagName("body")[0];
	var result = document.getElementById("result");
	var radiance = document.getElementById("radiance");
	var resultScore = document.getElementById("result_score");
	var hitNum = document.getElementById("hit_num").getElementsByTagName("span")[0];
	var btns = document.getElementById("btns");
	var awards = document.getElementById("awards");
	
	
	canvas.width = body.offsetWidth;
	canvas.height = body.offsetHeight;
	
	
		
	//对象的定义-------------------------------------------------------------------
	
	//背景图-----------------------------------------
	var bgH = canvas.height/canvas.width*640;
	var bgImg = {
		y:0,
		draw:function (){
			context.drawImage(loadOver[0],0,this.y,canvas.width,bgH);
			context.drawImage(loadOver[0],0,this.y-bgH,canvas.width,bgH);
		},
		move:function (){
			this.y++;
			if (this.y>=bgH){
				this.y = 0;
			}
		}
	}
	//英雄对象------------------------------------
	var heroW = 0.275*canvas.width;
	var heroH = 0.216*canvas.height;
	
	var hero = {
		w:heroW,
		h:heroH,
		drawX:canvas.width/2-heroW/2,
		drawY:canvas.height-heroH-10,
		draw:function(){
			context.drawImage(loadOver[7],this.drawX,this.drawY,this.w,this.h);
		}
	}
	//英雄阴影对象------------------------------------
	var heroShadow = {
		w:heroW,
		h:heroH,
		drawX:hero.drawX,
		drawY:hero.drawY+30,
		draw:function(){
			context.drawImage(loadOver[8],this.drawX,this.drawY,this.w,this.h);
		}
	}
	//英雄替身
	var heroDouble = {
		w:heroW-20,
		h:heroH-20,
		drawX:hero.drawX+10,
		drawY:hero.drawY+10,
		draw:function(){
			context.beginPath();
			context.fillStyle = "transparent";
			context.fillRect(this.drawX,this.drawY,this.w,this.h);
		}
	}
	
	//子弹对象------------------------------------
	var bulletW = 0.1656*canvas.width;
	var bulletH = 0.0934*canvas.height;
	
	function Bullet(){
		this.w = bulletW;
		this.h = bulletH;
		this.speed = bulletSpeed;
		this.drawX = hero.drawX+hero.w/2-this.w/2;
		this.drawY = hero.drawY - this.h;
		this.atk = 1;
		this.img = loadOver[2];
	}
	Bullet.prototype.draw = function(){
		context.drawImage(this.img,this.drawX,this.drawY,this.w,this.h);
	}
	Bullet.prototype.drawBig = function(){
		context.drawImage(loadOver[3],this.x,this.y,this.w,this.h,this.drawX,this.drawY,this.w,this.h);
	}

	Bullet.prototype.move = function(){
		this.drawY -= this.speed;
	}
	Bullet.prototype.clear = function(){
		if(this.drawY<=(-this.h)){
			for (var i=0; i<bullets.length; i++){
				if (this == bullets[i]){
					bullets.splice(i,1);
					return true;
				}
			}
		}
	}
	//怪兽对象--------------------------------------------
	function Monster(monster){
		this.w = monster.w;
		this.h = monster.h;
		this.drawX = randFn(0.1359*canvas.width,canvas.width-monster.w-0.1359*canvas.width);
		this.drawY = -monster.h;
		this.hit = 0;
		this.hp = monster.hp;
		this.score = monster.score;
		this.speed = monsterMoveSpeed+0.1*randFn(0,4);
		this.holdspeed = this.speed;
		this.survival = true;
		this.img = monster.img;
		this.length = 0;
        this.rock = 0;
	}
	Monster.prototype.draw = function(){
		context.drawImage(this.img,this.drawX,this.drawY,this.w,this.h);
		if(this.img == loadOver[5] || this.img == loadOver[11]){
			context.drawImage(loadOver[4],this.drawX,this.drawY+2/3*this.h+10,this.w,1/3*this.h);
		}else if(this.img == loadOver[6] || this.img == loadOver[12]){
			context.drawImage(loadOver[4],this.drawX,this.drawY+2/3*this.h,this.w,1/3*this.h);
		}
	}
	Monster.prototype.move = function(){
		this.drawY+=this.speed;
	}
	Monster.prototype.clear = function(){
		if (this.drawY>=canvas.height){
			for (var i=0; i<monsters.length; i++){
				if (this == monsters[i]){
					monsters.splice(i,1);
					return true;
				}
			}
		}
	}
	Monster.prototype.die = function(){
		if(!this.survival){
			
			var boom = new Boom();
			boom.drawX = this.drawX+this.w/2-boom.w/2;
			boom.drawY = this.drawY+this.h/2-boom.h/2;
			boom.score = this.score;
			boom.draw();
			drawAddScore(boom);
			this.length++;
			if(this.length>=30){
				delete boom;
				for (var i=0; i<monsters.length; i++){
					if (this == monsters[i]){
						monsters.splice(i,1);
						return true;
					}
				}
			}
		}
	}
	//爆炸对象---------------------------------
	var boomW = 0.2185*canvas.width;
	var boomH = 0.1189*canvas.height;
	function Boom(){
		this.w = boomW;
		this.h = boomH;
		this.drawX = 0;
		this.drawY = 0;
	}
	Boom.prototype.draw = function(){
		context.drawImage(loadOver[1],this.drawX,this.drawY,this.w,this.h);
	}
	
	//道具对象--------------------------------------
	function Stage(stage){
		this.w = bulletW;
		this.h = bulletH;
		this.drawX = randFn(0,canvas.width-this.w);
		this.drawY = -this.h;
		this.speedY = randFn(2,4);
		this.img = stage.img;
	}
	Stage.prototype.move = function(){
		this.drawY += this.speedY;
	}
	Stage.prototype.draw = function(){
		context.drawImage(this.img,this.drawX,this.drawY,this.w,this.h);
	}
	Stage.prototype.clear = function(){
		if(this.drawY>=canvas.height){
			for (var i=0; i<stages.length; i++){
				if (this == stages[i]){
					stages.splice(i,1);
					return true;
					break;
				}
			}
		}
	}
	
	
	var scoreW = 0.2*canvas.width;
	var scoreH = 0.111*canvas.height;
	var score = {
		w:scoreW,
		h:scoreH,
		drawX:canvas.width-scoreW-20,
		drawY:20,
		draw:function(){
			context.drawImage(loadOver[10],this.drawX,this.drawY,this.w,this.h);
		}
	}
	
	
	//功能函数------------------------------------------------------------------------------
	//判断用户是用的移动端还是PC端----------------------------
//		function goPAGE() {
//			if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
//				//手机浏览器	
//			}
//			else {
//		   		//桌面端
//		   		alert("请用手机打开");
//		    }
//		}
	
	
	function createBullet(){
		//创建子弹
		if(frameNum%createBulletSpeed == 0){
			var bullet = new Bullet();
			if(!createBulletBol){
				bullet.img = loadOver[2];
				bullet.atk = 1;
			}else{
				bullet.img = loadOver[3];
				bullet.atk = 2;
			}
			bullets.push(bullet);
		}
	}
	function drawBullet(){
		//绘制子弹
		for(var i=0; i<bullets.length;i++){
			bullets[i].move();
			bullets[i].draw();
			var bol = bullets[i].clear();
			if(!bol){
				monsterCollide(bullets[i],i);
			}
			if(bol||removeBol){
				i--;
				removeBol = false;
			}
		}
	}
	
	function randFn(min,max){
		//随机数
		return parseInt(Math.random()*(max-min)+min);
	}
	
	function createMonster(){
		//创建怪兽
		if(frameNum%createMonsterSpeed == 0){
			var monsterR = randFn(1,100);
			if (monsterR>=0&&monsterR<=85){
				var monster = {};
				monster.w = 0.1484*canvas.width;
				monster.h = 0.0854*canvas.height;
				monster.img = loadOver[5];
				monster.score = 10;
				monster.hp = 1;
			}else{
				var monster = {};
				monster.w = 0.1781*canvas.width;
				monster.h = 0.1489*canvas.height;
				monster.img = loadOver[6];
				monster.score = 20;
				monster.hp = 3;
			}
			var monsterObj = new Monster(monster);
			monsters.push(monsterObj);
		}
		
	}
	function drawMonster(){
		//绘制怪兽
		for(var i=0; i<monsters.length;i++){
			monsters[i].move();
            monsters[i].rock++;
			if(monsters[i].rock>=20){
				if(monsters[i].img == loadOver[5]){
					monsters[i].img = loadOver[11];
				}else if(monsters[i].img == loadOver[11]){
					monsters[i].img = loadOver[5];
				}else if(monsters[i].img == loadOver[6]){
					monsters[i].img = loadOver[12];
				}else if(monsters[i].img == loadOver[12]){
					monsters[i].img = loadOver[6];
				}
				monsters[i].rock = 0;
			}
			monsters[i].draw();
			var bol = monsters[i].clear();
			if(!bol){
				var dieBol = monsters[i].die();
				if(dieBol){
					i--;
				}
			}else{
				i--;
			}
		}
	}
	function createStage(){
		//创建道具
		if(frameNum%createStageSpeed == 0){
			var stageR = randFn(1,100);
			if (stageR>=0&&stageR<=75){
				var stage = {};
				stage.img = loadOver[3];
			}else{
				var stage = {};
				stage.img = loadOver[9];
			}
			var stageObj = new Stage(stage);
			stages.push(stageObj);
		}
	}
	function drawStage(){
		//绘制道具
		for(var i=0; i<stages.length;i++){
			stages[i].move();
			stages[i].draw();
			var bol = stages[i].clear();
			if(!bol){
				var eatBol = collide(stages[i],heroDouble);
				if(eatBol){
					if(stages[i].img == loadOver[9]){
						clearMonsterBol = true;
					}else if(stages[i].img == loadOver[3]){
						strengthenFrame = 0;
						createBulletBol = true;
					}
					stages.splice(i,1);
					i--;
				}
			}else{
				i--;
			}
		}
	}
	
	//清屏-------------------------------
	function clearMonster(){
		context.drawImage(loadOver[9],canvas.width-bulletW-20,canvas.height-bulletH-20,bulletW,bulletH);
	}
	//增强子弹----------------------------
	var strengthenFrame = 0;
	function strengthenBullet(){
		if(createBulletBol){
			strengthenFrame++;
			if(strengthenFrame == 300){
				createBulletBol = false;
			}
		}
	}
	
	
	//英雄移动限制---------------------------------
	function heroMoveLimit(){
		if(hero.drawX<=-hero.w/2){
			hero.drawX = -hero.w/2;
		}else if(hero.drawX>=canvas.width-hero.w/2){
			hero.drawX = canvas.width-hero.w/2;
		}else if(hero.drawY>=canvas.height-20){
			hero.drawY = canvas.height-20;
		}else if(hero.drawY<=0){
			hero.drawY = 0;
		}
	}
	
	
	//碰撞检测---------------------------------------
	function collide(obj1,obj2){
		var l1 = obj1.drawX;
		var r1 = l1+obj1.w;
		var t1 = obj1.drawY;
		var b1 = t1+obj1.h;
		
		var l2 = obj2.drawX;
		var r2 = l2+obj2.w;
		var t2 = obj2.drawY;
		var b2 = t2+obj2.h;
		
		if (r1>l2&&l1<r2&&b1>t2&&t1<b2){
			return true;
		}else{
			return false;
		}
	}
	//子弹与怪兽的碰撞检测-------------------------------
	function monsterCollide(obj,i){
		for(var j=0; j<monsters.length; j++){
			if(monsters[j].survival){
				var hitBol = collide(obj,monsters[j]);
				if(hitBol){
					bullets.splice(i,1);
					removeBol = true;
					monsters[j].hit += obj.atk;
					if(monsters[j].hit >= monsters[j].hp){
						scoreNum += monsters[j].score;
						monsters[j].survival = false;
						perishNum++;
						boomNum++;
						if (boomNum > 2) {
							boomNum = 0;
						}
						switch (boomNum){
							case 0:
								boomOneMusic.play();
								break;
							case 1:
								boomTwoMusic.play();
								break;
							case 2:
								boomThreeMusic.play();
								break;
						
						}
						break;
					}
				}	
			}
		}
	}
	//绘制分数------------------------------------
	function drawScore(){
		context.beginPath();
		context.fillStyle = "white";
		context.font = "12px";
		if(scoreNum<10){
			var shift = 3;
		}else if(scoreNum<100){
			var shift = 6;
		}else if(scoreNum<1000){
			var shift = 9;
		}else if(scoreNum<10000){
			var shift = 12;
		}else if(scoreNum<100000){
			var shift = 15;
		}
		context.fillText(scoreNum,score.drawX+score.w/2-shift,score.drawY+score.h/2);
	}
	//达到一定的分数改变怪物的生成速度和子弹的生成速度
	function changeSpeed(){
		if(scoreNum>=1000&&scoreNum<=2000){
			monsterMoveSpeed = 1.8;
		}else if(scoreNum>2000&&scoreNum<3000){
			monsterMoveSpeed = 2;
		}else if(scoreNum>=3000&&scoreNum<4000){
			monsterMoveSpeed = 2.2;
		}else if(scoreNum>=4000){
			monsterMoveSpeed = 2.4;
		}
	}
	//绘制爆炸时怪兽身上显示的分数-------------------------
	function drawAddScore(obj){
		context.beginPath();
		context.fillStyle = "white";
		context.font = "14px";
		var shift = 10;
		context.fillText("+"+obj.score,obj.drawX+obj.w/2-shift,obj.drawY+obj.h/2+4);
	}
	//英雄死亡
	function heroDie(){
		for(var i=0; i<monsters.length; i++){
            if(monsters[i].survival){
            	var heroBol = collide(monsters[i],heroDouble);
                if(heroBol){
                    gameOver();
                }
            }
			
		}
	}
	//游戏结束
	function gameOver(){
		updateNum();//更新最高分
		bullets = [];//子弹数组清空
		monsters = [];//怪物数组清空
		stages = [];//道具清空
		gameOverBol = false;
		bgMusic.pause();
		gameOverMusic.play();
		
		result.style.display = "block";
		resultScore.innerHTML = scoreNum+"分";
		hitNum.innerHTML = "抗菌侠顺利消灭"+perishNum+"只细菌怪！";
		winky();//闪闪发光
	}
	
	//动画------------------------------------------------
	function animate(){
		frameNum++;
		context.clearRect(0,0,canvas.width,canvas.height);//清屏
		bgImg.move();//背景动
		bgImg.draw();//背景绘制
		
		if(!gameOverBol){
			return;
		}
		heroMoveLimit();//英雄移动限制
		hero.draw();//英雄绘制
		heroShadow.draw();//阴影绘制
        heroDouble.draw();//英雄提升绘制
		
		createBullet();//创建子弹
		drawBullet();//绘制子弹
		createMonster();//创建怪兽
		drawMonster();//绘制怪兽
		createStage();//创建道具
		drawStage();//道具绘制
		
		strengthenBullet();//子弹增强
		score.draw();//分数背景绘制
		drawScore();//分数的绘制
		heroDie();//判断hero是否死亡
		
		if(clearMonsterBol){
			clearMonster();
		}
		changeSpeed();//达到一定分数改变子弹和怪物的生成速度
		if(frameNum == 1000){
			frameNum = 0;
		}
		
		window.requestAnimationFrame(animate);
		
	}
	function winky(){
		clearInterval(winkyTimer);
		winkyTimer = setInterval(function(){
			$(radiance).children().eq(0).toggle();
			$(radiance).children().eq(1).toggle();
		},100)
	}
	//游戏结束页面按钮--------------------------
	function buttons(){
		btnsDivs = btns.getElementsByTagName("div");
		var btnsDivsLen = btnsDivs.length;
		for(var i=0; i<btnsDivsLen; i++){
			btnsDivs[i].addEventListener("touchstart",function(){
				this.children[0].style.display = "none";
				this.children[1].style.display = "block";
			},false);
			btnsDivs[i].addEventListener("touchend",function(){
				this.children[1].style.display = "none";
				this.children[0].style.display = "block";
				if(this.className == "duihuan"){
					awards.style.display = "block";
					
				}else if(this.className == "myjp"){
					$("#my_awards").fadeIn();//我的奖品
				}else if(this.className == "again"){
					result.style.display = "none";
					if(shareBol){
						again();//再玩一次
						
					}else{
						$("#share_again").show();
						
					}
				}else if(this.className == "share"){
					$(".join").show();//分享haoyou
				}
			},false);
		}
		
	}
	//再玩一次--------------------------------------------------------------------
	function again(){
		gameOverBol = true;
		frameNum = 0;//帧数重置
		
		createBulletSpeed = 20;//子弹创建速度
		bulletSpeed = 10;//子弹的移动速度
		createBulletBol = false;//创建原始的子弹
		createMonsterSpeed = 25;//创建怪物速度重置
		monsterMoveSpeed = 1.6;
		createStageSpeed = 600;//穿件道具速度重置
		clearMonsterBol = false;//清屏效果重置
		scoreNum = 0;//分数重置
	    perishNum = 0;//hit数重置
		hero.drawX = canvas.width/2-heroW/2;//英雄位置重置
		hero.drawY = canvas.height-heroH-10;
		heroShadow.drawX = hero.drawX;//阴影重置
		heroShadow.drawY = hero.drawY+30;
		heroDouble.drawX = hero.drawX+10;//替身重置
		heroDouble.drawY = hero.drawY+10;
		bgMusic.play();
		animate();
	}
	//没有分享页面-----------------------------------------------------------
	function noshare(){
		var notShare = $(".share_again_now");
		notShare.get(0).addEventListener("touchstart",function(){
			
			notShare.children().eq(0).hide();
			notShare.children().eq(1).show();
		},false);
		notShare.get(0).addEventListener("touchend",function(){
			
			notShare.children().eq(1).hide();
			notShare.children().eq(0).show();
			$(".join").show();
		},false);
		$("#share_again .close").get(0).addEventListener("touchstart",function(){
			$("#share_again").hide();
			result.style.display = "block";
		},false);
	}
	//兑换奖品页面-----------------------------------------
	function exchangeAward(){
		
		var awardsBtns = awards.getElementsByTagName("div");
		var awardsBtnsLen = awardsBtns.length-1;
		for(var i=0; i<awardsBtnsLen; i++){
			awardsBtns[i].index = i;
			awardsBtns[i].addEventListener("touchstart",function(){
				
				this.children[0].style.display = "none";
				this.children[1].style.display = "block";
			},false);
			awardsBtns[i].addEventListener("touchend",function(){
				this.children[1].style.display = "none";
				this.children[0].style.display = "block";
				if(concernBol){//判断用户没有没关注过,默认没有关注false
					if(fillBol){//判断又没有填写过用户信息
						//直接发请求给后台兑换奖品
						ajaxExpiry();
					}else{
						//
						$("#submit_info").show();
					}
				}else{
					$("#follow").show();
					$("#follow .close").get(0).addEventListener("touchstart",function(){
						$("#follow").hide();
					},false);
				}
				
			},false);
		}
		awardsBtns[awardsBtns.length-1].addEventListener("touchstart",function(){
			awards.style.display = "none";
		},false);
	}
	//更新最高分------------------------------------
	function updateNum(){
		var openid = "openid";
		$.ajax({
			type:"get",
			url:"http://www.heminzhi.cn/archie/php/update.php",
			data:{
				openid:openid
			},
			success:function(str){
				//返回最高分
				$("#maxNum").html("您的最高纪录:"+str+"分");
			}
		});
	}
	//用户提交信息------------------------------
	function getUserInfo(){
		var submitBtn = $("#submit_btn");
		var openid = "openid";
		var img_src = "img_src";
		

		submitBtn.get(0).addEventListener("touchstart",function(ev){

			var user_name = $("#name").val();
			var user_phone = $("#phone").val();
			if(user_name == ""){
				alert("请输入您的姓名");
				return;
			}
			var arr = user_phone.split("");
			if(arr.length!=11){
				alert("请输入正确的手机号");
				return;
			}
			//这里需要发送的数据(openid,user_name,user_phone)
			//后台也需要记录着几条数据
			$.ajax({
				type:"get",
				url:"http://www.heminzhi.cn/archie/php/getuserinfo.php",
				data:{
					openid:openid,
					user_name:user_name,
					user_phone:user_phone,
				},
				success:function(str){
					//这里后台需要返回一个值(0:代表提交成功,1:代表提交失败)
					if(str == "0"){
						$("#submit_info").hide();
						$(".submit_success").show();
					}
				}
			});
			ev.cancelBubble=true;
		},false);
		$(".submit_success .close").get(0).addEventListener("touchstart",function(){
			$(".submit_success").hide();
		},false);
	}
	//立刻分享----------------------------------
	function shareNow(){
		var shareBtn = $("#share_btn");
		$("#share_btn").get(0).addEventListener("touchstart",function(){
			
			shareBtn.children().eq(0).hide();
			shareBtn.children().eq(1).show();
		},false);
		$("#share_btn").get(0).addEventListener("touchend",function(){
			
			shareBtn.children().eq(1).hide();
			shareBtn.children().eq(0).show();
			$(".join").show();
		},false);
		
	}
	//兑奖-------------------------------------
	function ajaxExpiry(){
		var openid = "openid";
		var maxNum = $("#maxNum").html();
		$.ajax({
			type:"get",
			url:"http://www.heminzhi.cn/archie/php/expiry.php",
			data:{
				openid:openid,
				max_Num:maxNum
			},
			dataType:"json",
			success:function(json){
				//需要返回的数据(兑换成功,奖品类型,奖品编码)
				if(json.err == "0"){
					alert("兑换成功");
					var awards_num = json.awards_num;
			
				}else if(json.err == "1"){
					$("#failed").show();
					$("#failed .close").get(0).addEventListener("touchstart",function(){
						$("#failed").hide();
					},false);
					$("#failed .iknow").get(0).addEventListener("touchstart",function(){
						$("#failed").hide();
					},false);
				}
			}
		});
	}
	
	//领奖界面----------------------------------
	function lingAwards(){
		$("#confirm .close").get(0).addEventListener("touchstart",function(){
			$("#confirm").hide();
		},false);
		var gongzuo = $("#confirm .gongzuo");
		$("#confirm .gongzuo").get(0).addEventListener("touchstart",function(){
			gongzuo.children().eq(0).hide();
			gongzuo.children().eq(1).show();
		},false);
		$("#confirm .gongzuo").get(0).addEventListener("touchend",function(){
			
			gongzuo.children().eq(1).hide();
			gongzuo.children().eq(0).show();
            $("#confirm").hide();
			$("#lingsucc").show();
			$("#lingsucc .close").get(0).addEventListener("touchstart",function(){
				$("#lingsucc").hide();
			},false);
			var share1 = $("#lingsucc .share1");
			$("#lingsucc .share1").get(0).addEventListener("touchstart",function(){
				share1.children().eq(0).hide();
				share1.children().eq(1).show();
			},false);
			$("#lingsucc .share1").get(0).addEventListener("touchend",function(){
				
				share1.children().eq(1).hide();
				share1.children().eq(0).show();
				$(".join").show();
			},false);
			var index = 0;
			var img = $("<img src='img/used.png'/>");
			for(var i=0; i<$("#my_awards .content").length; i++){
				if($("#my_awards .content").eq(i).get(0).style.display == "block"){
					index = i;
				}
			}
			$(".my_awards_wrap .content").eq(index).append(img);
			img.css({
				width:"40%",
				height:"40%",
				top:"2%",
				right:"2%",
			});
			//发送ajax改变领取状态	
		},false);
		var buling = $("#confirm .buling");
		$("#confirm .buling").get(0).addEventListener("touchstart",function(){
			buling.children().eq(0).hide();
			buling.children().eq(1).show();
		},false);
		$("#confirm .buling").get(0).addEventListener("touchend",function(){
			
			buling.children().eq(1).hide();
			buling.children().eq(0).show();
			$("#confirm").hide();
		},false);
	}
	
	//主内容--------------------------------
	$(".bg_rank").get(0).addEventListener("touchstart",function(){
		$(".ranking").fadeIn();
		var first = $("<img src='img/first.png'/>");
		var second = $("<img src='img/second.png'>/");
		var third = $("<img src='img/third.png'>/");
		$(".ranking .rank_wrap li").eq(0).find("span").eq(0).empty();
		$(".ranking .rank_wrap li").eq(0).find("span").eq(0).append(first);
		$(".ranking .rank_wrap li").eq(1).find("span").eq(0).empty();
		$(".ranking .rank_wrap li").eq(1).find("span").eq(0).append(second);
		$(".ranking .rank_wrap li").eq(2).find("span").eq(0).empty();
		$(".ranking .rank_wrap li").eq(2).find("span").eq(0).append(third);
	
	},false);
	$(".ranking .close").get(0).addEventListener("touchstart",function(){
		$(".ranking").fadeOut();
	},false);
	
	
	
	$(".bg_instantly").get(0).addEventListener("touchstart",function(){
		$(".bg_instantly").children().eq(0).hide();
		$(".bg_instantly").children().eq(1).show();
	},false);
	$(".bg_instantly").get(0).addEventListener("touchend",function(){
		$(".bg_instantly").children().eq(1).hide();
		$(".bg_instantly").children().eq(0).show();
		$(".home_wrap").hide();
        
        $(rule).show();
        setTimeout(function(){
			$(rule).hide();
            canvas.style.display = "block";
            
            animate();
		},2000);
		
	},false);
	$(".bg_prize").get(0).addEventListener("touchstart",function(){
		$("#my_awards").fadeIn();
	},false);
	
	
	canvas.addEventListener("touchstart",function (){
		var first = event.touches[0];
		moveBol = true;
		if(first.clientX>=hero.drawX&&first.clientX<=hero.drawX+hero.w&&first.clientY>=hero.drawY&&first.clientY<=hero.drawY+hero.h){
			rangeX = first.clientX - hero.drawX;
			rangeY = first.clientY - hero.drawY;
		}
		if(clearMonsterBol){
			if(first.clientX>=canvas.width-bulletW-20&&first.clientX<=canvas.width-20&&first.clientY>=canvas.height-bulletH-20&&first.clientY<=canvas.height-20){
				allBoom.play();
				for(var i=0; i<monsters.length; i++){
					scoreNum += monsters[i].score;
					monsters[i].survival = false;
					perishNum++;
				}
				clearMonsterBol = false;
			}
		}
		event.preventDefault();
	},false);
	canvas.addEventListener("touchmove",function (){
		var first = event.touches[0];
		
		if(first.clientX>=hero.drawX&&first.clientX<=hero.drawX+hero.w&&first.clientY>=hero.drawY&&first.clientY<=hero.drawY+hero.h){
			
			hero.drawX = first.clientX - rangeX;
			hero.drawY = first.clientY - rangeY;
			heroShadow.drawX = hero.drawX;
			heroShadow.drawY = hero.drawY +30;
            heroDouble.drawX = hero.drawX+10;
			heroDouble.drawY = hero.drawY+10;
		}
		
		event.preventDefault();
	},false);
	canvas.addEventListener("touchend",function(){
		moveBol = false;
	})	
	buttons();//按钮
	noshare();//分享过才能再玩
	exchangeAward();//兑换奖品
	getUserInfo();//用户提交信息
	shareNow();//立刻分享
	lingAwards();//领奖
	$("#my_awards .close").get(0).addEventListener("touchstart",function(){
        $("#my_awards").fadeOut();
    },false);
    //把我的奖品页面的close按钮放在这里是为了防止一进游戏的时候用户点击我的奖品页面,如果那个时候ajax还没有返回数据的话用户可以点击close按钮退出
	$(".join").get(0).addEventListener("touchstart",function(){
		$(".join").hide();
	},false);

	$("#convert_fail .convert_fail_wrap .close").get(0).addEventListener("touchstart",function(){
		$("#convert_fail").hide();
	},false);
	$("#convert_fail .convert_fail_wrap img").get(0).addEventListener("touchstart",function(){
		$(".join").show();//分享haoyou
	},false);
}

//加载图片
function loadImg(arr,fn){
	var arr1 = [];
   	var index = 0;
   	var arr2 = [];
   	for(var i=0; i<arr.length; i++){
   		var imgObj = new Image();
   		imgObj.src = arr[i];
   		imgObj.index = i;
   		imgObj.onload = function(){
   			index++;
   			$("#loading .text p").eq(1).html(Math.ceil(index/allImg.length*100)+'%');
			$("#loading .load_wrap .loadPer").width(Math.ceil(index/allImg.length*100)+'%');
   			arr1.push(this);
   			if(index>arr.length-1){
   				for(var i=0; i<arr1.length;i++){
   					for(var j=0; j<arr1.length; j++){
   						if(arr1[j].index == i){
   							arr2.push(arr1[j]);
   						}
   					}
   				}
   				if(fn){
   					fn();
   				}
   			}
   		}
   	}
   	return arr2;
}

//我的奖品---------------------------------------------
function myAwards(){
    
    var contents = $("#my_awards .content");
    
    var index = 0;
    $("#my_awards .left").on("click",function(){
        index--;
        if(index<0){
            index = contents.length-1;
        }
        $.each(contents, function(index,el) {
            $(this).hide();
        });
        contents.eq(index).show();
    })
    $("#my_awards .right").on("click",function(){
        index++;
        if(index>contents.length-1){
            index = 0;
        }
        $.each(contents, function(index,el) {
            $(this).hide();
        });
        contents.eq(index).show();
    })
    
    var prizeBtn = $("#my_awards .prize_btn");
    $("#my_awards .prize_btn").get(0).addEventListener("touchstart",function(){
        
       if($("#my_awards .content").eq(index).find("img").length >= 2){
            $("#convert_fail").show();
       }else{
       		$("#confirm").show();
       }
        
    },false);   
}
//判断用户有没有分享/关注/提交过信息/兑换的奖品
function ajaxGetUserDetails(){
	var openid = "openid";//这里请填写获取到的openidid
    var id_name = "id_name"//这里是获取到的微信名
    var img_src = "img_src";//获取到用户的头像

    $.ajax({
        type:"get",
        url:"http://www.heminzhi.cn/archie/php/handle.php",
        data:{
            openid:openid,
            id_name:id_name,
            img_src:img_src,
            act:"userinfo"
        },
        dataType:"json",
        success:function(arr){
            if(arr[0].err == "0"){
            	shareBol = true;
            }
            if(arr[1].err == "0"){
            	concernBol = true;
            }
            if(arr[2].err == "0"){
            	fillBol = true;
            }
            var len = arr[3].length;
            if(len == 0){
                alert("您没有兑换过奖品");
            }else{
                
                for(var i=0; i<len; i++){
                    var div = $("<div></div>");
                    var span = $("<span></span>");
                    div.append(span);
                    $(".my_awards_wrap").append(div);
                    div.addClass("content");
                    div.lingBol = arr[3][i].lingBol;
                    
                    
                    if(div.lingBol == "1"){
                        var img = $("<img src='img/used.png'/>");
                        div.append(img);
                        img.css({
                            width:"40%",
                            height:"40%",
                            top:"2%",
                            right:"2%",
                        });
                    }
                    if(arr[3][i].awards_num == 0){
                        var img = $("<img src='img/youhui.png'/>");
                        var p = $("<p></p>");
                        div.append(img);
                        div.append(p);
                        img.css({
                            width: "98%",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%,-55%)",
                        })
                        span.html("50元代金券  1张");
                        p.html("领奖码："+arr[3][i].awards_coding+"单笔订单购满1000元可用")
                        
                    }else if(arr[3][i].awards_num == 1){
                        var img = $("<img src='img/yusan.png'/>");
                        div.append(img);
                        img.css({
                            top: "4%",
                            height: "80%",
                            left: "50%",
                            transform: "translateX(-50%)",
                        })
                        span.html("高端雨伞  1把   编号:"+arr[3][i].awards_coding);
                    }else if(arr[3][i].awards_num == 2){
                        var img = $("<img src='img/beizi.png'/>");
                        div.append(img);
                        img.css({
                            top: "4%",
                            height: "80%",
                            left: "50%",
                            transform: "translateX(-50%)",
                        })
                        span.html("陶瓷水杯  1个   编号:"+arr[3][i].awards_coding);
                    }
                }
                myAwards();//我的奖品
                
            }
        }
    });
}
