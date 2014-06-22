/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



// ↓ 定数定義 ↓
var KEY_COUNT		= 7;		// 鍵盤の総数

var KEY_BASE_X		= 10.0;		// 鍵盤の左上の点
var KEY_BASE_Y		= 10.0;		// 鍵盤の左上の点
var KEY_W_WIDTH		= 70.0;		// 白鍵一つの横幅
var KEY_W_HEIGHT	= 250.0;	// 白鍵一つの縦幅
var KEY_B_WIDTH		= 25.0;		// 黒鍵一つの横幅
var KEY_B_HEIGHT	= 150.0;	// 黒鍵一つの縦幅

var KEY_LINE_WIDTH	= 0.5;		// 鍵盤の線の太さ
var KEY_LINE_COLOR	= "#000000";	// 鍵盤の線の色

// ↑ 定数定義 ↑

var oto = new Array("do.wav", "re.wav", "mi.wav", "fa.wav", "so.wav", "ra.wav", "si.wav", "dodo.wav");
var audio = new Array();

var isMetronome = false;
var bpm = 60;
var tempo = 4;

var clickflag = false;


// 初期化メソッド
function initonload(){
	drawKeys();
	
	
	// イベント登録
	var canvas = document.getElementById("cvs");
	// canvas.ontouchstart = function(e){ touchPiano(e, 1);};
	// canvas.ontouchmove = function(e){ touchPiano(e, 2);};
	// canvas.ontouchend = function(e){ touchPiano(e, 3);};
	
	canvas.addEventListener("touchstart", t_start, false);
	canvas.addEventListener("touchmove", t_move, false);
	canvas.addEventListener("touchend", t_end, false);
	
	canvas.onmousedown = function(e){ clickPiano(e, 1);};
	canvas.onmousemove = function(e){ clickPiano(e, 2);};
	canvas.onmouseup = function(e){ clickPiano(e, 3);};
	
	// canvas以外のtouchstartを抑止
	document.body.ontouchstart = function(e){ e.preventDefault(); };
	
	// 音源を登録
	for(var i = 0; i < oto.length; i++){
		audio.push(new Audio("ongen/" + oto[i]));
		audio[i].loop = true;
	}
}

function t_start(e){
	touchPiano(e, 1);
}
function t_move(e){
	touchPiano(e, 2);
}
function t_end(e){
	touchPiano(e, 3);
}


function myPlay(i){
  var audiof = new Audio("ongen/" + oto[i]);
  audiof.play();
}

function indicateBPM(str){
	document.getElementById("nowbpm").innerHTML = "現在のテンポ:" + str;
}
function indisMetroOn(aug){
	var str = "メトロノーム:";
	if(aug)
		str += "ON";
	else
		str += "OFF";
	document.getElementById("indisMetroOn").innerHTML = str;
}

function playMetronome(nowcount){
	if(!isMetronome){
		return;
	}
	bpm = document.inputform.bpm.value;		// テキストボックスのBPM取得
	indicateBPM(bpm.toString());			// BPMを表示
	var tem = nowcount - 1;
	var audio;
	if(tem === 0){
		audio = new Audio("ongen/metro_sp.mp3");
		tem = tempo;
	}
	else{
		audio = new Audio("ongen/metro_st.mp3");
	}
	audio.play();
	// 繰り返し処理
	setTimeout(function(){ playMetronome(tem); }, Math.ceil(1000 * 60 / bpm));
}

function clickMetronome(){		// メトロノームボタンがクリックされたか
	if(isMetronome){
		isMetronome = false;
	}
	else{
		isMetronome = true;
		tempo = document.inputform.tempo.value;
		document.getElementById("nowtempo").innerHTML = "現在の拍子:" + tempo.toString() + "/ 4";
		playMetronome(tempo);
	}
	indisMetroOn(isMetronome);
}

function drawKeys(){
	
	
	for(var i = 0; i < oto.length; i++){
		drawKey(i, 1);
	}
}
function drawKey(i, mode){
	var cancon = document.getElementById("cvs").getContext("2d");
	cancon.beginPath();
	cancon.lineWidth = KEY_LINE_WIDTH;
	cancon.strokeStyle = KEY_LINE_COLOR;
	
	cancon.moveTo(KEY_BASE_X + KEY_W_WIDTH * i, KEY_BASE_Y);
	cancon.lineTo(KEY_BASE_X + KEY_W_WIDTH * i, KEY_BASE_Y + KEY_W_HEIGHT);
	cancon.lineTo(KEY_BASE_X + KEY_W_WIDTH * (i + 1), KEY_BASE_Y + KEY_W_HEIGHT);
	cancon.lineTo(KEY_BASE_X + KEY_W_WIDTH * (i + 1), KEY_BASE_Y);
	cancon.closePath();
	cancon.stroke();
	
	if(mode === 2){
		cancon.fillStyle = "#999999";
	}else{
		cancon.fillStyle = "#ffffff";
	}
	cancon.fill();
}

// タッチ処理
function touchPiano(event, flag){
	// 全ての指に対して処理
	for(var i = 0; i < event.touches.length; i++){
		var e = event.touches[i];
		
		var etrans = { X : e.pageX, Y : e.pageY };
		
		playPiano(etrans, flag);
	}
}

// クリック処理
function clickPiano(event, type){
	//var rect = event.target.getBoundingClientRect();
	var canvas = document.getElementById("cvs");
	var etrans = {
		X : event.clientX - canvas.offsetLeft,
		Y : event.clientY - canvas.offsetTop
	};
	playPiano(etrans, type);
}
function playPiano(e, type){
	
	// 全ての鍵盤に対して判定を行う
	//document.getElementById("debugmemo").innerHTML = e.X.toString() + " " + e.Y.toString();
	for(var j = 0; j < oto.length; j++){
		// X軸方向のon条件
		var onflagX = (e.X > KEY_BASE_X + KEY_W_WIDTH * j)&&(e.X <= KEY_BASE_X + KEY_W_WIDTH * (j + 1));
		// Y軸方向のon条件
		var onflagY = (e.Y >= KEY_BASE_Y)&&(e.Y <= KEY_BASE_Y + KEY_W_HEIGHT);
		var onflags = onflagX && onflagY;
		
		if(onflags)
			document.getElementById("debugmemo").innerHTML = j.toString() + type.toString();
		
		if(type === 1){
			clickflag = true;
			if(onflags){
				audio[j].load();
				audio[j].play();
			}
		}else if(type === 2){
			if(clickflag){
				if(onflags){
					if(audio[j].paused){
						audio[j].load();
						audio[j].play();
					}
				}else{
					if(!audio[j].paused){
						audio[j].pause();
						audio[j].currentTime = 0;
					}
				}
			}
		}else{
			clickflag = false;
			if(onflags && !audio[j].paused){
				audio[j].pause();
				audio[j].currentTime = 0;
			}
		}
		
		if(onflags && clickflag){
			drawKey(j, 2);
		}else{
			drawKey(j, 1);
		}
	}	
}