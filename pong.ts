// FIT2102 2018 Assignment 1
// https://docs.google.com/document/d/1woMAgJVf1oL3M49Q8N3E1ykTuTu5_r28_MQPVS5QIVo/edit?usp=sharing

function pong() {
  // Inside this function you will use the classes and functions 
  // defined in svgelement.ts and observable.ts
  // to add visuals to the svg element in pong.html, animate them, and make them interactive.
  // Study and complete the tasks in basicexamples.ts first to get ideas.

  // You will be marked on your functional programming style
  // as well as the functionality that you implement.
  // Document your code!  
  // Explain which ideas you have used ideas from the lectures to 
  // create reusable, generic functions.

  /*Changes made to pong.html to include the scoreline and end game text

  Game can be played by just moving the mouse, the program will capture the movement of the y-axis
  of mouse and translate it to the movement of the paddle

  I tried to keep each function as pure as possible by doing what the description and the
  function name shows. There should be minimal side effect aside from changing the attr of Elem
  and the usage of centreofSVG function

  centreofSVG is not that pure in my opinion, it accepts an input, but it won't return anything,
  it is also mutating the state of the svg. i think that using a recursive function will also fit 
  better than a for loop to create the line in the middle, and also to apply what the lecture taught

  I initially tried multiplying the speed of ball which is a variable
  by multiplying them by -1 each time it collides but it won't be very pure as i will be mutating the variable,
  so i settled on using left right up down constant as direction and replacing the speed of ball with them 
  */
  const
    left = 2, right = -2, up = -2, down = 2,
    svg = document.getElementById("canvas")!,
    score = document.getElementById("scoreline")!,
    endText = document.getElementById("endText")!,
    mousemove = Observable.fromEvent<MouseEvent>(svg, 'mousemove'),
    player = new Elem(svg, 'rect')
      .attr('x', 545)    .attr('y', 300)
      .attr('width', 15).attr('height', 50)
      .attr('fill', '#95B3D7'),
    bot = new Elem(svg, 'rect')
      .attr('x', 40)    .attr('y', 300)
      .attr('width', 15).attr('height', 50)
      .attr('fill', '#95B3D7'),
    ball = new Elem(svg, 'circle')
      .attr('cx', 300)     .attr('cy', 300)
      .attr('r', 10)       .attr('fill', 'blue')
      .attr('xDir', 2)     .attr('yDir', 2)
      .attr('pScore', 0)   .attr('bScore', 0)
      .attr('highestScore', 0);





  //A recursive function to part the SVG
  function centreofSVG(bHeight : number) : void {
    const 
      svg = document.getElementById("canvas")!,
      rect = new Elem(svg, 'rect')
            .attr('x', 298)    .attr('y', bHeight)
            .attr('width', 5).attr('height', 10)
            .attr('fill', '#95B3D7');
    if (bHeight + 20 < 580)  return centreofSVG(bHeight + 20); 
  }
    
  //Move the player paddle by observing the movement of the y-axis of the mouse
  function playerMovement() {
    mousemove
      .filter(()=> (Number(ball.attr('highestScore')) < 11))
      .subscribe(({y}) => player.attr('y', Math.floor(y - svg.getBoundingClientRect().top)))
  }

  //Move the ball using its attribute xDir and yDir
  function ballMovement() {
    Observable.interval(10)
      .filter(()=> (Number(ball.attr('highestScore')) < 11))
      .subscribe(()=>{
                      ball.attr('cx', Number(ball.attr('xDir'))+Number(ball.attr('cx')))
                        .attr('cy', Number(ball.attr('yDir'))+Number(ball.attr('cy')));
                      })
  }

  //The bot will move towards the ball only in y-axis.
  function botMovement() {

    Observable.interval(10)
      .filter(()=>((Number(bot.attr('y')) + Number(bot.attr('height')) < Number(ball.attr('cy')))))
      .subscribe(()=>bot.attr('y', Number(bot.attr('y')) + 1.85))

    Observable.interval(10)
      .filter(()=>(((Number(bot.attr('y')) > Number(ball.attr('cy'))))))
      .subscribe(()=>bot.attr('y', Number(bot.attr('y')) - 1.85))
  }
  
  //Collision detection including paddles and borders.
  function collisionDetection() {
    

    //Collision with Border detection, colliding will change the yDir attribute of the ball or resetting the position updating the score
    function collisionBorderDetection() {
      let randomY = Math.floor(Math.random() * 600);
      Observable.interval(1)
                .filter(()=>(Number(ball.attr('cy')) + Number(ball.attr('r')) >= 600))
                .subscribe(()=>ball.attr('yDir', up));
      Observable.interval(1)
                .filter(()=>(Number(ball.attr('cy')) - Number(ball.attr('r')) <= 0))
                .subscribe(()=>ball.attr('yDir', down));

      Observable.interval(1)
                .filter(()=>(Number(ball.attr('cx')) >= 600))
                .subscribe(()=>ball.attr('cx', 300)
                .attr('bScore', Number(ball.attr('bScore'))+1)
                .attr('cy', randomY));
      Observable.interval(1)
                .filter(()=>(Number(ball.attr('cx')) <= 0))
                .subscribe(()=>ball.attr('cx', 300)
                .attr('pScore', Number(ball.attr('pScore'))+1)
                .attr('cy', randomY));
    }
    //Collision with player's paddle and bot's paddle, including changing the direction
    function collisionPaddleDetection() {
      Observable.interval(1).filter(()=>(Number(ball.attr('cx')) + Number(ball.attr('r')) >= Number(player.attr('x'))))
                            .filter(()=>(Number(ball.attr('cx')) + Number(ball.attr('r')) <= Number(player.attr('x'))+4 ))
                            .filter(()=>(Number(ball.attr('cy')) + Number(ball.attr('r')) >= (Number(player.attr('y')))))
                            .filter(()=>(Number(ball.attr('cy')) - Number(ball.attr('r')) <= (Number(player.attr('y')) + Number(player.attr('height')))))
                            .subscribe(()=>ball.attr('xDir', right))
      Observable.interval(1).filter(()=>(Number(ball.attr('cy')) + Number(ball.attr('r'))) >= Number(player.attr('y')))
                            .filter(()=>(Number(ball.attr('cy')) + Number(ball.attr('r'))) <= Number(player.attr('y'))+4 )
                            .filter(()=>(Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(player.attr('x')))
                            .filter(()=>(Number(ball.attr('cx')) - Number(ball.attr('r'))) <= Number(player.attr('x')) + Number(player.attr('width')))
                            .subscribe(()=>ball.attr('yDir', up))
      Observable.interval(1).filter(()=>(Number(ball.attr('cy')) - Number(ball.attr('r'))) <= Number(player.attr('y')) + Number(player.attr('height')))
                            .filter(()=>(Number(ball.attr('cy')) - Number(ball.attr('r'))) >= Number(player.attr('y')) + Number(player.attr('height'))-4 )
                            .filter(()=>(Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(player.attr('x')))
                            .filter(()=>(Number(ball.attr('cx')) - Number(ball.attr('r'))) <= Number(player.attr('x')) + Number(player.attr('width')))
                            .subscribe(()=>ball.attr('yDir', down))


      Observable.interval(1).filter(()=>(Number(ball.attr('cx')) - Number(ball.attr('r')) <= Number(bot.attr('x')) + Number(bot.attr('width'))))
                            .filter(()=>(Number(ball.attr('cx')) - Number(ball.attr('r')) >= Number(bot.attr('x')) + Number(bot.attr('width'))-4))
                            .filter(()=>(Number(ball.attr('cy')) + Number(ball.attr('r')) >= (Number(bot.attr('y')))))
                            .filter(()=>(Number(ball.attr('cy')) - Number(ball.attr('r')) <= (Number(bot.attr('y')) + Number(bot.attr('height')))))
                            .subscribe(()=>ball.attr('xDir', left))
      Observable.interval(1).filter(()=>(Number(ball.attr('cy')) + Number(ball.attr('r'))) >= Number(bot.attr('y')))
                            .filter(()=>(Number(ball.attr('cy')) + Number(ball.attr('r'))) <= Number(bot.attr('y'))+4 )
                            .filter(()=>(Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(bot.attr('x')))
                            .filter(()=>(Number(ball.attr('cx')) - Number(ball.attr('r'))) <= Number(bot.attr('x')) + Number(bot.attr('width')))
                            .subscribe(()=>ball.attr('yDir', up))
      Observable.interval(1).filter(()=>(Number(ball.attr('cy')) - Number(ball.attr('r'))) <= Number(bot.attr('y')) + Number(bot.attr('height')))
                            .filter(()=>(Number(ball.attr('cy')) - Number(ball.attr('r'))) >= Number(bot.attr('y')) + Number(bot.attr('height'))-4 )
                            .filter(()=>(Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(bot.attr('x')))
                            .filter(()=>(Number(ball.attr('cx')) - Number(ball.attr('r'))) <= Number(bot.attr('x')) + Number(bot.attr('width')))
                            .subscribe(()=>ball.attr('yDir', down))
      
    }

    collisionBorderDetection();
    collisionPaddleDetection();
  }

  //Updating the highest score and HTML element score
  function scoreObservable() {
    Observable.interval(1)
              .filter(()=>Number(ball.attr('bScore')) < Number(ball.attr('pScore')))
              .subscribe(()=>ball.attr('highestScore', Number(ball.attr('pScore'))))
    Observable.interval(1)
              .filter(()=>Number(ball.attr('bScore')) > Number(ball.attr('pScore')))
              .subscribe(()=>ball.attr('highestScore', Number(ball.attr('bScore'))))

    Observable.interval(1)
              .filter(()=> (Number(ball.attr('highestScore')) <= 11))
              .subscribe(()=>score.innerHTML = 'Score' + ' ' + ball.attr('bScore') + ':' + ball.attr('pScore'));
  }

  //Showing the end game text
  function endGame() {
    Observable
      .interval(10)
      .filter(()=> (Number(ball.attr('bScore')) == 11))
      .subscribe(() =>{ 
        endText.innerHTML = "Sorry, you lost."
      });
    Observable
      .interval(10)
      .filter(()=> (Number(ball.attr('pScore')) == 11))
      .subscribe(() =>{ 
        endText.innerHTML = "Congratulations, you won"
      });
  }

  centreofSVG(20);
  playerMovement();
  botMovement();
  ballMovement();
  collisionDetection();
  scoreObservable();
  endGame();
}

// the following simply runs your pong function on window load.  Make sure to leave it in place.
if (typeof window != 'undefined')
  window.onload = ()=>{
    pong();
  }

 

 