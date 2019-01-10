var snake = (function()
{
	var areaSize = 200;
	var cellSize = 5;
	var sideLength = areaSize/cellSize;
	var tailLength = 4;
	var levelDifficulty =
	{
		easy : 150,
		medium : 250,
		hard : 150
	}
	var directions =
	{
		37 : "left",
		38 : "top",
		39 : "right",
		40 : "bottom",
	}
	var tailDirection, isStartedMoving, currentDirection;
	var isKeyFired = false;
	var isGamePaused = false;

	function drawGameArea()
	{
		$("#area").css({width : areaSize, height: areaSize});

		for(var i = 1; i <= sideLength; i++)
		{
			for(var j = 1; j <= sideLength; j++)
				$("#area").append("<div i='r"+i+"' j='c"+j+"' style='width: "+cellSize+"px; height: "+cellSize+"px;'></div>");
		}
	}

	function drawSnake()
	{
		var headPosition = descideAndDrawHead();
		drawTail(headPosition);
	}

	function descideAndDrawHead()
	{
		var iIndex = sideLength;
		var jIndex = sideLength;
		var random_iIndex = Math.floor(Math.random() * iIndex + 1);
		var random_jIndex = Math.floor(Math.random() * jIndex + 1);
		$("#area > div[i=r"+ random_iIndex +"][j=c"+ random_jIndex +"]").addClass("head");
		var headPosition =
		{
			i : random_iIndex,
			j : random_jIndex
		}
		return headPosition;
	}

	function drawTail(headPosition)
	{
		var isPositionsFound = false;
		var directionsWent = [];

		while(!isPositionsFound)
		{
			var direction = descideTailDirection();
			if(directionsWent.indexOf(directions[direction]) < 0)
			{
				directionsWent.push(directions[direction]);
				if(directions[direction] == "top")
				{
					if(headPosition.i - tailLength > 0)
					{
						isPositionsFound = true;
						var prevIndex = headPosition.i + "," + headPosition.j;
						var tailStart_iIndex = headPosition.i - 1;
						for(var i = 1; i <= tailLength; i++)
						{
							$("#area > div[i=r"+ tailStart_iIndex +"][j=c"+ headPosition.j +"]").addClass("tail" + ((i == tailLength) ? " tailTip" : "")).attr("prev", prevIndex);
							prevIndex = tailStart_iIndex + "," + headPosition.j;
							tailStart_iIndex--;
						}
					}
				}
				else if(directions[direction] == "bottom")
				{
					if(headPosition.i + tailLength <= sideLength)
					{
						isPositionsFound = true;
						var prevIndex = headPosition.i + "," + headPosition.j;
						var tailStart_iIndex = headPosition.i + 1;
						for(var i = 1; i <= tailLength; i++)
						{
							$("#area > div[i=r"+ tailStart_iIndex +"][j=c"+ headPosition.j +"]").addClass("tail" + ((i == tailLength) ? " tailTip" : "")).attr("prev", prevIndex);
							prevIndex = tailStart_iIndex + "," + headPosition.j;
							tailStart_iIndex++;
						}
					}
				}
				else if(directions[direction] == "left")
				{
					if(headPosition.j - tailLength > 0)
					{
						isPositionsFound = true;
						var prevIndex = headPosition.i + "," + headPosition.j;
						var tailStart_jIndex = headPosition.j - 1;
						for(var i = 1; i <= tailLength; i++)
						{
							$("#area > div[i=r"+ headPosition.i +"][j=c"+ tailStart_jIndex +"]").addClass("tail" + ((i == tailLength) ? " tailTip" : "")).attr("prev", prevIndex);
							prevIndex = headPosition.i + "," + tailStart_jIndex;
							tailStart_jIndex--;
						}
					}
				}
				else if(directions[direction] == "right")
				{
					if(headPosition.j + tailLength <= sideLength)
					{
						isPositionsFound = true;
						var prevIndex = headPosition.i + "," + headPosition.j;
						var tailStart_jIndex = headPosition.j + 1;
						for(var i = 1; i <= tailLength; i++)
						{
							$("#area > div[i=r"+ headPosition.i +"][j=c"+ tailStart_jIndex +"]").addClass("tail" + ((i == tailLength) ? " tailTip" : "")).attr("prev", prevIndex);
							prevIndex = headPosition.i + "," + tailStart_jIndex;
							tailStart_jIndex++;
						}
					}
				}
				if(isPositionsFound)
					tailDirection = directions[direction];
			}
		}
	}

	function descideTailDirection()
	{
		return Math.floor(Math.random() * (40 - 37 + 1) + 37);
	}

	function assignLocomotion(levelDifficulty)
	{
		$(document).keyup(function(event)
		{
			controlEvent(event);
		});

		$("#controls > div > div").on("click", function(event)
		{
            		var eve = {which : 0};
            		eve.which = event.target.id;
			controlEvent(eve);
		});
	}

	function controlEvent(event)
	{
		if(directions[event.which] != undefined && directions[event.which] != tailDirection && !isKeyFired && !isGamePaused)
		{
			isKeyFired = true;
			moveDirection(directions[event.which]);
		}
		else if(event.which == 32)
		{
			if(isGamePaused)
			{
				isGamePaused = false;
				moveDirection(currentDirection);
			}
			else
			{
				clearInterval(isStartedMoving);
				isStartedMoving = undefined;
				isGamePaused = true;
			}
		}
	}

	function moveDirection(direction)
	{
		currentDirection = direction;
		if(currentDirection == "left")
		{
			tailDirection = "right";
		}
		else if(currentDirection == "right")
		{
			tailDirection = "left";
		}
		else if(currentDirection == "top")
		{
			tailDirection = "bottom";
		}
		else if(currentDirection == "bottom")
		{
			tailDirection = "top";
		}
		if(isStartedMoving == undefined)
		{
			isStartedMoving = setInterval(function()
			{
				isKeyFired = true;
				var headRow = parseInt($("#area > div.head").attr("i").split("r")[1]);
				var headColumn = parseInt($("#area > div.head").attr("j").split("c")[1]);
				var isGameOver = false;
				var newHeadSelector = "";
				if(currentDirection == "left")
				{
					var newHeadColumnPosition = headColumn - 1;
					newHeadSelector = "#area > div[i=r"+ headRow +"][j=c"+ newHeadColumnPosition +"]";
					if(newHeadColumnPosition > 0 && !$(newHeadSelector).hasClass("tail"))
					{
						$("#area > div.head").removeAttr("class");
						$(newHeadSelector).addClass("head");
					}
					else
					{
						isGameOver = true;
						gameOver();
					}
				}
				else if(currentDirection == "right")
				{
					var newHeadColumnPosition = headColumn + 1;
					newHeadSelector = "#area > div[i=r"+ headRow +"][j=c"+ newHeadColumnPosition +"]";
					if(newHeadColumnPosition <= sideLength && !$(newHeadSelector).hasClass("tail"))
					{
						$("#area > div.head").removeAttr("class");
						$(newHeadSelector).addClass("head");
					}
					else
					{
						isGameOver = true;
						gameOver();
					}
				}
				else if(currentDirection == "top")
				{
					var newHeadRowPosition = headRow - 1;
					newHeadSelector = "#area > div[i=r"+ newHeadRowPosition +"][j=c"+ headColumn +"]";
					if(newHeadRowPosition > 0 && !$(newHeadSelector).hasClass("tail"))
					{
						$("#area > div.head").removeAttr("class");
						$(newHeadSelector).addClass("head");
					}
					else
					{
						isGameOver = true;
						gameOver();
					}
				}
				else if(currentDirection == "bottom")
				{
					var newHeadRowPosition = headRow + 1;
					newHeadSelector = "#area > div[i=r"+ newHeadRowPosition +"][j=c"+ headColumn +"]";
					if(newHeadRowPosition <= sideLength && !$(newHeadSelector).hasClass("tail"))
					{
						$("#area > div.head").removeAttr("class");
						$(newHeadSelector).addClass("head");
					}
					else
					{
						isGameOver = true;
						gameOver();
					}
				}
				if(!isGameOver)
				{
					if($(newHeadSelector).hasClass("food"))
					{
						$(newHeadSelector).removeClass("food");
						growSnake(headRow, headColumn);
					}
					else
						moveTail(headRow, headColumn);
				}
				isKeyFired = false;
			}, levelDifficulty.easy);
		}
	}

	function moveTail(prevHeadRow, prevHeadColumn)
	{
		var tailTip = $("#area > div.tailTip");
		var prev_iIndex = parseInt($(tailTip).attr("prev").split(",")[0]);
		var prev_jIndex = parseInt($(tailTip).attr("prev").split(",")[1]);
		$(tailTip).removeAttr("class prev");

		$("#area > div[i=r"+ prev_iIndex +"][j=c"+ prev_jIndex +"]").addClass("tailTip");
		$("#area > div[i=r"+ prevHeadRow +"][j=c"+ prevHeadColumn +"]").addClass("tail").attr("prev", parseInt($("#area > div.head").attr("i").split("r")[1]) + "," + parseInt($("#area > div.head").attr("j").split("c")[1]));
	}

	function feedSnake()
	{
		var availArea = $("#area > div:not(.head):not(.tail)");
		var index = Math.floor(Math.random() * availArea.length + 1);
		$(availArea[index]).addClass("food");
	}

	function growSnake(prevHeadRow, prevHeadColumn)
	{
		$("#area > div[i=r"+ prevHeadRow +"][j=c"+ prevHeadColumn +"]").addClass("tail").attr("prev", parseInt($("#area > div.head").attr("i").split("r")[1]) + "," + parseInt($("#area > div.head").attr("j").split("c")[1]));
		feedSnake();
	}

	function gameOver()
	{
		clearInterval(isStartedMoving);
		$("#area > div.head").addClass("gameOverHead");
		$("#area > div.tail").addClass("gameOverTail");
		$(document).unbind("keyup");
	}

	function init()
	{
		drawGameArea();
		drawSnake();
		assignLocomotion();
		feedSnake();
	}

	var scope =
	{
		init : init
	}

	return scope;
})();

$(document).ready(function()
{
	snake.init();
});
