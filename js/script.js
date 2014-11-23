	$(function(){					

		//ion.sound js library initialization
		ion.sound({
			sounds: [
			    {
			        name: "wrong_answer"
			    },
			    {
			    	name:"right_answer",
			    	volume:0.9		
			    },
			    {
			        name: "sound3",
			        
			    },
			    {
			        name: "got_item",
			        
			    },
			    {
			    	name:"bubble",
			    	volume: 0.4,
			    },
			    {
			    	name:"tap",
			    	volume: 0.03,
			    	preload: false
			    },
			    {
			    	name:"final_attack",
			    },
			    {
			    	name:"game_over",
			    	volume:0.9
			    },
			    {
			    	name:"beep",
			    	volume:0.3
			    },
			    {
			    	name:"bg_music",
			    	volume: 0.3,
			    	loop: 900000,
			    },
			 	{
			    	name:"what_button",
			    },
			    {
			    	name:"new_game",
			    },
			],
			volume: 0.5,
			path: "sounds/",
			preload: true
		});


		ion.sound.play("bg_music");

		//disable text selection from web page
		$("body").css("-webkit-user-select","none");
		$("body").css("-moz-user-select","none");
		$("body").css("-ms-user-select","none");
		$("body").css("-o-user-select","none");
		$("body").css("user-select","none");


		//click button at welcome page to start game
		$("#play").click(function(){
			$("#cover").hide();
			$(this).hide();
			countdownTimer();
			generateResult();
			bubbles();
			ion.sound.play("new_game");//new game sound starts
		});


		//click on logo button to display help div
		$("#logo").click(function(){
			ion.sound.play("what_button");
			$("#intro").animate({
					 height:'toggle'
			});
		});



		function bubbles(){
			setTimeout(function(){
				ion.sound.play("bubble");
				$("#bubbles").css("display","block");
				bubbles();
			},10000);
		}	



		$(".drag-digit").draggable({
			revert: function(event,ui){
				//for jQuery 1.9 version 'uiDraggable' 
				//for older jQuery 'draggable'
			    $(this).data("uiDraggable").originalPosition={
			       	top:0,
			       	left:0
			    }; return !event;	
			}
		});


		/* droppable function */
		$(".drop-digit").droppable({
				tolerance:'intersect',
			drop: function(event,ui){  
				$(this).droppable('option','accept',ui.draggable);
				var drop_p = $(this).offset();
				var drag_p = ui.draggable.offset();
				var left_end = drop_p.left - drag_p.left + 1;
				var top_end = drop_p.top - drag_p.top + 1;
				ui.draggable.animate({
					top: '+=' + top_end,
					left: '+=' + left_end,
				});

				//play sound after placing leaf number 
				ion.sound.play("got_item");	

				x =ui.draggable.text();
				$(this).attr("value",x);
			},
			out:function(event,ui){
			$(this).droppable('option','accept','.drag-digit');
			}
		});


		// countdown timer function
		function countdownTimer(){
				$("#timer").html(30);
				Timer();

			function Timer(){
				var sec = $("#timer").html();
		 		timer = setInterval(function(){
					$("#timer").html(--sec);

					if(sec>"0" && sec<="5"){
						ion.sound.play("beep");
					}
					if(sec=="0"){
						clearInterval(timer);
						wrongAnswer();
					}	
		  		},1000);
			}
		}


		/* randomaly generate digits on result leaf*/
		function generateResult(){
			var total=Math.random();	
			//random numbers between 10 - 60
			total=(total*51)+10;
			final_total=Math.floor(total);
			$("#result-digit").html(final_total);
		}


		/* reset draggables to enable in droppable area */
		function resetDraggables(){
			$(".drag-digit").animate({
				top: "0px",
				left: "0px"
			});
			$(".drop-digit").droppable("option","accept",".drag-digit");
		}



		score=0;//intiliaze score variable to null as global
		//submit function
		$("#submit").click(function(){

			ion.sound.play("tap"); //play sound on	click submit button 

			//set variables to droppable's attribute 'value'
			var num1 = parseInt($("#drop1").attr("value"));
			var num2 = parseInt($("#drop2").attr("value"));
			var num3 = parseInt($("#drop3").attr("value"));
			var num4 = parseInt($("#drop4").attr("value"));

			result = (num1-num2)*num3-num4;

		if(final_total == result)
		{					
			score = score + 500;
			clearInterval(timer);// clear the countdown timer
			
			$("#confirm-dialog span").html(score);
			$(".ui-widget-overlay").attr("background-color",'green');

			//confirm-dialog for right answer
			$("#confirm-dialog").dialog({
				resizable:false,
				height:250,
				widht:500,
				modal:true,
				title:'RIGHT ANSWER!',
				buttons:{
					"CONTINUE":function(){
						$(this).dialog("close");
							resetDraggables();
							countdownTimer();
							generateResult();
							ion.sound.play("new_game");//new game sound starts
					}
				},
				open:function (event, ui) {
					$("#score_points").css({"display":"block"});	
					ion.sound.play("right_answer");
				$('.ui-widget-overlay').css('background', 'green');
				}
			});	
		}
		else
		{
			wrongAnswer();//if answer is wrong all this function

		}
		});


		//confirm-dialog for wrong answer
		function wrongAnswer()
		{
			penalty_height=36;
			total_height=parseInt($("#spider").css("top").replace("px",""));
			temp=(total_height+penalty_height);
			total_height=temp+"px";
			clearInterval(timer);

			$("#confirm-dialog").dialog({
				resizable:false,
				height:250,
				widht:500,
				modal:true,
				title:'WRONG ANSWER!',
				buttons:{
					"CONTINUE":function(){
						$(this).dialog("close");
							resetDraggables();
							countdownTimer();
							generateResult();
							ion.sound.play("new_game");//new game sound starts 
					}
				},
				open:function (event, ui) {
					ion.sound.play("wrong_answer");
				$("#score_points").css({"display":"block"});	
				$('.ui-widget-overlay').css('background', 'red');
				}
			});	


		//moving spider with animation on wrong answer
		setTimeout(function(){
			$("#spider").animate({
				top:total_height,
			},1000);

		//checking weather spider reach the end	
		var game_over_check = parseInt($("#spider").css("top").replace('px',''));
			if(game_over_check >= 0){
				ion.sound.play("final_attack");
				finishGame();
			}
		},500);

			
		//call this function when game ends
		function finishGame(){
				ion.sound.play("game_over");
				$("#score_points").css({"display":"block"});	
				//ion.sound.stop("bubble");
				$('.ui-widget-overlay').addClass("animate");	
				$("#confirm-dialog span").html(score);
				$("#bubbles").animate({
						width:0,
						height:0,
				},100);

				clearInterval(timer);//clear timer to default state

			$("#confirm-dialog").dialog({
				resizable:false,
				height:250,
				modal:true,
				title:'GAME OVER!',
				buttons:{
					"PLAY AGAIN":function(){
						$(this).dialog("close");
							window.location.reload(true);
					}
				},
					
			});	
		}
			
	}			

});		