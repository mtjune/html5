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


// 初期化メソッド
function initonload(){
	drawKey();
	
	// イベント登録
	var canvas = document.getElementById("cvs");
	canvas.ontouchstart = function(e){ playPiano(e, true);};
	canvas.ontouchmove = function(e){ playPiano(e, true);};
	canvas.ontouchend = function(e){ playPiano(e, false);};
	
	// 音源を登録
	for(var i = 0; i < oto.length; i++){
		audio.push(new Audio("ongen/" + oto[i]));
	}
}


function myPlay(i){
  //var audio = new Audio("ongen/" + oto[i]);
  //audio.play();
  audio[i].play();
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

function drawKey(){
	
	
	for(var i = 0; i < oto.length; i++){
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
		
		cancon.fillStyle = "#ffffff";
		cancon.fill();
		
	}
}

// タッチ処理
function playPiano(event, flag){
	
	// 全ての指に対して処理
	for(var i = 0; i < event.touches.length; i++){
		var e = event.touches[i];
		
		// 全ての鍵盤に対して判定を行う
		for(var j = 0; j < oto.length; j++){
			// X軸方向のon条件
			var onflagX = (e.pageX >= KEY_BASE_X + KEY_BASE_X * j)&&(e.pageX <= KEY_BASE_X + KEY_W_WIDTH * (j + 1));
			// Y軸方向のon条件
			var onflagY = (e.pageY >= KEY_BASE_Y)&&(e.pageY <= KEY_BASE_Y + KEY_W_HEIGHT);
			
			// X,Yの条件を満たしなおかつその音が鳴ってなければ鳴らす.
			if(onflagX && onflagY && audio[j].ended){
				audio[j].play();
			}
			
		}
	}
}