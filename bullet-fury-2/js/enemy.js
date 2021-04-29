function enemy(enemyBox,tips,delayOffset) {

if (tips == 1) {
	var delay = 0 - Math.floor(Math.random() * Math.floor(10));
} else {
	delay = 45 - Math.floor(Math.random() * Math.floor(40));
}

var attackDelay = -10;
var shootDelay = 0;
var hideTimer = 0;
var attacking = false;
var damage = 10;

var rayStart = new BABYLON.Vector3(enemyBox._absolutePosition.x,enemyBox._absolutePosition.y + 6,enemyBox._absolutePosition.z);

totalEnemies ++;

enemyBox.visibility = 0;	

enemyBox.billboardMode = 2;
	
var enemySprite = new BABYLON.Sprite("enemySprite", spriteManagerEnemy);
enemySprite.position.x = enemyBox._absolutePosition.x;

if (tips == 1) {
enemySprite.position.y = enemyBox._absolutePosition.y + 3;	
} else {
enemySprite.position.y = enemyBox._absolutePosition.y + 2.9;	
}


enemySprite.position.z = enemyBox._absolutePosition.z;
enemySprite.size = 8.7;//8.3
if(tips == 2) {enemySprite.cellIndex = 26;enemyBox._scaling.z = 0.56;}
	update();
	
	function update() {
	requestAnimationFrame(update);
	if(!pause && isPlaying) {
	//delay++;
	
	if(enemySprite.isVisible != enemyBox._isParentEnabled && !enemyBox.beigts) enemySprite.isVisible = enemyBox._isParentEnabled;
	
	if(enemyBox._isParentEnabled && !pause) {
		delay++;
		if(enemyBox.restart) restartEnemy();
		
	if(enemyBox.beigts) {
		
	} else if (enemyBox.mirst > 0) {

	if(enemyBox.mirst == 1) {enemySprite.playAnimation(7, 25, false, 73);enemyBox.mirst = 2;enemyBox.setEnabled(false);enemyBox.isPickable = false;}
	if(enemySprite.cellIndex == 25) enemySprite.color.a -= 0.03;	
	if(enemySprite.color.a <= 0) {enemyBox.beigts = true;enemySprite.isVisible = false;enemyBox.mirst = 0;enemies --;exportRoot.onScreen.center.enemyText.text = "Enemies: " + enemies;if(enemies <= 0) {levelComplete();}}
	
	} else {
		if(tips == 2 && enemySprite.cellIndex == 6 && delay == 2) enemySprite.cellIndex = 4;//
		if(attacking) {
		if((tips == 1 && delay >= 2) || (tips == 2 && delay >= 4)) {
		
		delay = 0;
		attack();
				}
		} else {		
			if((tips == 2 && delay >= 30) || (tips == 1 && delay >= 4)) {
		delay = 0;
			var hit = scene.pickWithRay(new BABYLON.Ray(rayStart, camera.globalPosition.subtract(rayStart).normalize(), 100));
			if (hit.pickedMesh){			
			if(hit.pickedMesh.name == "player") {
				attacking = true;
				if (tips == 1 && enemySprite.cellIndex == 6) {
					enemySprite.cellIndex = 4;
					attackDelay = -10;
					}
				
				shootDelay = 0;
			} else {
				if(tips == 1) {
				enemySprite.cellIndex = 0;
				enemyBox._scaling.z = 1;
				} else {
				enemySprite.cellIndex = 26;
				enemyBox._scaling.z = 0.56;
				}
			} 
	    }
			}
		}		
	}
}
	}
}
function restartEnemy() {
	enemySprite.stopAnimation();
	enemyBox.setEnabled(true);
	enemyBox.isPickable = true;
	enemyBox.restart = false;
	enemyBox.mirst = 0;
	enemyBox.beigts = false;
	enemySprite.color.a = 1;
	attacking = false;
	if(tips == 1) {
		enemySprite.cellIndex = 0;
		enemyBox._scaling.z = 1;
		attackDelay = -10;
		shootDelay = 0;
		delay = 0 - Math.floor(Math.random() * Math.floor(10));
	} else {
		enemySprite.cellIndex = 26;
		enemyBox._scaling.z = 0.56;
		attackDelay = 0;
		shootDelay = 0;
		hideTimer = 1;
		delay = 20 - Math.floor(Math.random() * Math.floor(40));
	}
	
}

function attack() {

if(tips == 1) {
	attackDelay ++;
	if ( attackDelay >= 5) {
	if (enemySprite.cellIndex < 4) enemySprite.cellIndex ++;
	if (enemySprite.cellIndex >= 4) {
	if(enemySprite.cellIndex == 4) enemyBox._scaling.z = 0.95;
	shootDelay ++;
	if (shootDelay >= 18 - (difficulty * 3)) {
	if (enemySprite.cellIndex < 7) {
	enemySprite.cellIndex ++;
	if (enemySprite.cellIndex == 6) shoot();
	} else {}
	}
	}
	}
		
} else {
				if (hideTimer > 0) {
					
				hideTimer ++;
				if (hideTimer > 20) {
				if (enemySprite.cellIndex == 4) {
					enemySprite.cellIndex = 30;
				} else {
					if (enemySprite.cellIndex > 26) {
						enemySprite.cellIndex --;
						enemyBox._scaling.z -= 0.1;
					}
					if (enemySprite.cellIndex == 26) hideTimer = 0; attackDelay = -20; 
				}	
				}
			} else {
			
			attackDelay ++;
			if ( attackDelay >= 16) {
				if (enemySprite.cellIndex == 30) enemySprite.cellIndex = 4;
			if (enemySprite.cellIndex < 30 && enemySprite.cellIndex > 4) {
				enemySprite.cellIndex ++; 
				if (enemySprite.cellIndex !=6) {
				enemyBox._scaling.z += 0.1; 
				
				}
			}
			if (enemySprite.cellIndex >= 4 && enemySprite.cellIndex < 8) {
				shootDelay ++;
				if (shootDelay >= 11 - (difficulty * 3)) {
					if (enemySprite.cellIndex < 7) {
					if (enemySprite.cellIndex == 6) {
						shoot();
					} else {						
					enemySprite.cellIndex ++;
					}
					} else {}
					}
				}
			}
		}	
	//console.log(enemySprite.cellIndex);	
}
		
		
}

function shoot() {
	
	createjs.Sound.play("gun1");
	
	if(tips == 1) {
	
	attackDelay = -11;//-10
	shootDelay = 0;
	attacking = false;
	} else {
		attackDelay = 0;
		shootDelay = 0;
		//enemySprite.cellIndex = 4;
		attacking = false;
		hideTimer = 1;
	}
	
	var hit = scene.pickWithRay(new BABYLON.Ray(rayStart, camera.globalPosition.subtract(rayStart).normalize(), 120));
			if (hit.pickedMesh){		 				
			if(hit.pickedMesh.name == "player") {
				trapija(damage);
			} else {
				if(tips == 2) {
					
				hideTimer = 0;
				attackDelay = (-1 * (Math.floor(Math.random() * (0 + 30 - 0) + 1)) + 20);

				}
			}
	}	
}

}

// ------------------------------------------------------------------------------------------------------------------------

function aptiecina(aptiekaBox) {
	
	if(mobile) {
	var bonus = 50 - (difficulty * 10);	
	} else {	
	var bonus = 40 - (difficulty * 10);
	}
	var panemta = false;
	
	updateAptieka();
	
	function updateAptieka() {
		requestAnimationFrame(updateAptieka);
		if(aptiekaBox._isParentEnabled && !pause) {
		if(aptiekaBox.restart) {aptiekaBox.setEnabled(true);panemta = false;aptiekaBox.restart = false;}
		
		if(!panemta) {			
			aptiekaBox.rotate(new BABYLON.Vector3(0, 1, 0), 0.02, BABYLON.Space.WORLD);
			if (aptiekaBox.intersectsPoint(new BABYLON.Vector3(camera.position.x, camera.position.y - 3, camera.position.z))) {
				createjs.Sound.play("pick");
				panemta = true;
				aptiekaBox.setEnabled(false);
				health += bonus;
				scoreBonus -= bonus;
				usedMedkit = 1;
				if(health > startHealth) health = startHealth;
				exportRoot.onScreen.healthScreen.healthline.scaleX = health / startHealth;
				exportRoot.onScreen.healthScreen.healthttxt.text = health;
				camera.fov = 0.78;	
				setTimeout(function(){ camera.fov = 0.8; }, 35);
				exportRoot.onScreen.asinisScreen.gotoAndPlay(8);
			}
		}
		
		}
	}
}
