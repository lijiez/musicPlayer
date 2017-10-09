$(function(){
	var $player = $(".player");//
	var pauseBtn = $(".pause");
	var rotatePic = $(".pic-bg");
	var cdt = $(".cdt");
	var prevBtn = $(".prev");
	var nextBtn = $(".next");
	var songName = $(".main-right .song");
	var singer = $(".main-right .singer");
	var albums = $(".main-right.albums");	
	var progressBar = $(".progress-bar");
	var progress = $(".progress-bar .cover");
	var tolTime_m = $(".totalTime .minute");
	var tolTime_s = $(".totalTime .second");
	var currTime_m = $(".currentTime .minute");
	var currTime_s = $(".currentTime .second");
	var mute = $(".mute");
	var refreshBtn = $(".main-right .refresh");
	var volumeBtn = $(".main-right .volume");
	var volCover = $(".main-right .volume .volCover");
	var randomBtn = $(".right .random");
	var musiclistUL = $(".main-left .musiclist");
	var musicSrcList = ["music/李玉刚 - 清明上河图.mp3","music/五音Jw - 明月天涯.mp3","music/音频怪物 - 小狐狸.mp3","music/高橋瞳 - ウォーアイニー.mp3","music/Amy Diamond - Heartbeats.mp3","music/Kim Taylor - I Am You.mp3","music/Groove Coverage - She.mp3","music/DJ Okawari - Flower Dance.mp3"];
	
	//添加歌曲列表
	for(var i in musicSrcList){
		musiclistUL.append("<li><span class='song'></span><i class='singer'></i><b class='time'></b><audio src='music/李玉刚 - 清明上河图.mp3'></audio></li>");		
	}
	var musiclist = $(".main-left .musiclist li:not(:first)");
	var songList = $(".main-left .musiclist li .song").slice(1);
	var singerList = $(".main-left .musiclist li .singer").slice(1);
	var timeList = $(".main-left .musiclist li .time").slice(1);
	var audioList = $(".main-left .musiclist li audio");
	//显示歌曲和歌手
	for(var i in musicSrcList){
		var songMsg = musicSrcList[i].slice(6,-4).split(" - ");
		$(songList[i]).text(songMsg[1]);
		$(singerList[i]).text(songMsg[0]);
		$(audioList[i]).attr({src : musicSrcList[i]});
	}
	//显示每首歌的时间
	musiclist.toArray().forEach(function(item,index){
		$(item).find("audio")[0].oncanplay = function(){
			var duration = this.duration;
			var min = parseInt(duration/60);
			var sec = parseInt(duration%60);
			if(min<10){
				min = "0"+min;
			}
			if(sec<10){
				sec = "0"+sec;
			}			
			$(this).parent().find(".time").text(min+":"+sec)
		}
	});
	
	
	//音乐播放器
	function Player(){
		this.isplay = false;
		this.audio = $(".player")[0];
		this.playIndex = 0;
		this.isRandom = false;
	}
	Player.prototype = {
		init : function(){
			musiclist.first().addClass("playing")
			this.getTime();
			return this;
		},		
		playMusic : function(){
			//播放
			this.isplay = true;
			this.audio.src = musicSrcList[this.playIndex];
			$(musiclist[this.playIndex]).addClass("playing").siblings().removeClass("playing");
			songName.text(musicSrcList[this.playIndex].slice(6,-4).split(" - ")[1]);
			singer.text(musicSrcList[this.playIndex].slice(6,-4).split(" - ")[0]);
			this.audio.play();
			this.play();
			
		},
		play : function(){
			//播放
			this.isplay = true;
			rotatePic.css("animation","circle 3s linear infinite");
			cdt.css("transform","rotate(0deg)");
			pauseBtn.html("&#xe606;");
			this.audio.play();
			//时间获取
			this.getTime();
			
			//进度条
			var self = this;
			this.audio.ontimeupdate = function(){
				self.currTime = self.audio.currentTime;
				var currMin = parseInt(self.currTime/60);
				var currSec = parseInt(self.currTime%60);
				if(currMin<10){
					currTime_m.text("0"+currMin);
				}else{				
					currTime_m.text(currMin);
				}
				if(currSec<10){
					currTime_s.text("0"+currSec)
				}else{			
					currTime_s.text(currSec)
				}
				progress.css("width",self.currTime/self.musicTime*340);
				
				//播放完毕
				if(self.currTime == self.musicTime){
					self.pause();
					self.nextMusic();
				}
				
			}
		},
		pause : function(){
			//暂停
			this.isplay = false;
			this.audio.pause();
			rotatePic.css("animation","")
			cdt.css("transform","rotate(-20deg)");
			pauseBtn.html("&#xe60d;");
		},
		getTime : function(){
			//时间获取
			var self = this;
			self.audio.oncanplay = function(){
				self.musicTime = self.audio.duration;
				var min = parseInt(self.musicTime/60);
				var sec = parseInt(self.musicTime%60);
				if(min<10){
					tolTime_m.text("0"+min);
				}else{				
					tolTime_m.text(min);
				}
				if(sec<10){
					tolTime_s.text("0"+sec)
				}else{			
					tolTime_s.text(sec)
				}
			}
			return this;
		},
		nextMusic : function(){
			if(this.isRandom){			
				this.playIndex = parseInt( Math.random()*musicSrcList.length );
			}else{
				if(this.playIndex<musicSrcList.length-1){				
					this.playIndex += 1;
				}else{
					this.playIndex = 0;
				}
			}
			this.playMusic();
		},
		prevMusic : function(){
			if(this.isRandom){
				this.playIndex = parseInt( Math.random()*musicSrcList.length );
			}else{				
				if(this.playIndex>0){
					this.playIndex -= 1;				
				}else{
					this.playIndex = musicSrcList.length-1;
				}
			}
			this.playMusic();
		},
		randomplay : function(){
			//随机播放
			this.isRandom = true;
			this.playIndex = parseInt( Math.random()*musicSrcList.length );
			this.playMusic();
		},
		orderPlay : function(){
			this.isRandom = false;
			this.playMusic();
		}
		
	}
	var player = new Player().init();

	//播放暂停
	pauseBtn.click(function(){
		if(player.isplay){
			//暂停
			player.pause();
			
		}else{
			//播放
			player.play();
		}
	});
	
	//下一首
	nextBtn.click(function(){
		player.nextMusic()
	})
	//上一首
	prevBtn.click(function(){
		player.prevMusic();
	})
	//刷新
	refreshBtn.click(function(){
		player.audio.currentTime = 0;
	});
	
	//歌曲列表双击播放
	musiclist.on("dblclick",function(e){
		$player.attr("src",$(this).find("audio")[0].src)
		player.play();
		player.playIndex = $(this).index()-1;
		songName.text($(this).find(".song").text());
		singer.text($(this).find(".singer").text());
		$(this).addClass("playing").siblings().removeClass("playing");
	});
	//进度条拖动
	progressBar.click(function(e){
		var _width = e.offsetX;
		progress.css("width",_width);
		player.audio.currentTime = progress.width()/340*player.audio.duration;
	});
	
	//静音
	mute.find("i").click(function(){
		if(player.audio.muted){
			//关闭静音
			$(this).html("&#xe60a;")
			player.audio.muted = false;
		}else{
			//开启静音
			$(this).html("&#xe609;")
			player.audio.muted = true;
		}
		
	});
	mute.hover(
		function(){
			$(this).parent().find(".volume").show()
		},
		function(){
			$(this).parent().find(".volume").hide()
		}
	);
	volumeBtn.hover(
		function(){
			$(this).parent().find(".volume").show()
		},
		function(){
			$(this).parent().find(".volume").hide()
		}
	);
	//音量控制
	volumeBtn.click(function(e){
		e = e || event;
		var _height = $(this).offset().top+100-e.clientY;
		volCover.css("height",_height);
		player.audio.volume = _height/$(this).height();
	});
	
	//播放顺序
	randomBtn.click(function(){
		if(player.isRandom){
			//顺序播放
			player.orderPlay();
			$(this).html("&#xe607;");
			$(this).css("font-family","iconfont1");
		}else{
			//随机播放
			player.randomplay();
			$(this).html("&#xe60c;");
			$(this).css("font-family","iconfont");
		}
	});
});