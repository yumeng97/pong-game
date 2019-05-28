"use strict";
function pong() {
    const left = 2, right = -2, up = -2, down = 2, svg = document.getElementById("canvas"), score = document.getElementById("scoreline"), endText = document.getElementById("endText"), mousemove = Observable.fromEvent(svg, 'mousemove'), player = new Elem(svg, 'rect')
        .attr('x', 545).attr('y', 300)
        .attr('width', 15).attr('height', 50)
        .attr('fill', '#95B3D7'), bot = new Elem(svg, 'rect')
        .attr('x', 40).attr('y', 300)
        .attr('width', 15).attr('height', 50)
        .attr('fill', '#95B3D7'), ball = new Elem(svg, 'circle')
        .attr('cx', 300).attr('cy', 300)
        .attr('r', 10).attr('fill', 'blue')
        .attr('xDir', 2).attr('yDir', 2)
        .attr('pScore', 0).attr('bScore', 0)
        .attr('highestScore', 0);
    function centreofSVG(bHeight) {
        const svg = document.getElementById("canvas"), rect = new Elem(svg, 'rect')
            .attr('x', 298).attr('y', bHeight)
            .attr('width', 5).attr('height', 10)
            .attr('fill', '#95B3D7');
        if (bHeight + 20 < 580)
            return centreofSVG(bHeight + 20);
    }
    function playerMovement() {
        mousemove
            .filter(() => (Number(ball.attr('highestScore')) < 11))
            .subscribe(({ y }) => player.attr('y', Math.floor(y - svg.getBoundingClientRect().top)));
    }
    function ballMovement() {
        Observable.interval(10)
            .filter(() => (Number(ball.attr('highestScore')) < 11))
            .subscribe(() => {
            ball.attr('cx', Number(ball.attr('xDir')) + Number(ball.attr('cx')))
                .attr('cy', Number(ball.attr('yDir')) + Number(ball.attr('cy')));
        });
    }
    function botMovement() {
        Observable.interval(10)
            .filter(() => ((Number(bot.attr('y')) + Number(bot.attr('height')) < Number(ball.attr('cy')))))
            .subscribe(() => bot.attr('y', Number(bot.attr('y')) + 1.85));
        Observable.interval(10)
            .filter(() => (((Number(bot.attr('y')) > Number(ball.attr('cy'))))))
            .subscribe(() => bot.attr('y', Number(bot.attr('y')) - 1.85));
    }
    function collisionDetection() {
        function collisionBorderDetection() {
            let randomY = Math.floor(Math.random() * 600);
            Observable.interval(1)
                .filter(() => (Number(ball.attr('cy')) + Number(ball.attr('r')) >= 600))
                .subscribe(() => ball.attr('yDir', up));
            Observable.interval(1)
                .filter(() => (Number(ball.attr('cy')) - Number(ball.attr('r')) <= 0))
                .subscribe(() => ball.attr('yDir', down));
            Observable.interval(1)
                .filter(() => (Number(ball.attr('cx')) >= 600))
                .subscribe(() => ball.attr('cx', 300)
                .attr('bScore', Number(ball.attr('bScore')) + 1)
                .attr('cy', randomY));
            Observable.interval(1)
                .filter(() => (Number(ball.attr('cx')) <= 0))
                .subscribe(() => ball.attr('cx', 300)
                .attr('pScore', Number(ball.attr('pScore')) + 1)
                .attr('cy', randomY));
        }
        function collisionPaddleDetection() {
            Observable.interval(1).filter(() => (Number(ball.attr('cx')) + Number(ball.attr('r')) >= Number(player.attr('x'))))
                .filter(() => (Number(ball.attr('cx')) + Number(ball.attr('r')) <= Number(player.attr('x')) + 4))
                .filter(() => (Number(ball.attr('cy')) + Number(ball.attr('r')) >= (Number(player.attr('y')))))
                .filter(() => (Number(ball.attr('cy')) - Number(ball.attr('r')) <= (Number(player.attr('y')) + Number(player.attr('height')))))
                .subscribe(() => ball.attr('xDir', right));
            Observable.interval(1).filter(() => (Number(ball.attr('cy')) + Number(ball.attr('r'))) >= Number(player.attr('y')))
                .filter(() => (Number(ball.attr('cy')) + Number(ball.attr('r'))) <= Number(player.attr('y')) + 4)
                .filter(() => (Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(player.attr('x')))
                .filter(() => (Number(ball.attr('cx')) - Number(ball.attr('r'))) <= Number(player.attr('x')) + Number(player.attr('width')))
                .subscribe(() => ball.attr('yDir', up));
            Observable.interval(1).filter(() => (Number(ball.attr('cy')) - Number(ball.attr('r'))) <= Number(player.attr('y')) + Number(player.attr('height')))
                .filter(() => (Number(ball.attr('cy')) - Number(ball.attr('r'))) >= Number(player.attr('y')) + Number(player.attr('height')) - 4)
                .filter(() => (Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(player.attr('x')))
                .filter(() => (Number(ball.attr('cx')) - Number(ball.attr('r'))) <= Number(player.attr('x')) + Number(player.attr('width')))
                .subscribe(() => ball.attr('yDir', down));
            Observable.interval(1).filter(() => (Number(ball.attr('cx')) - Number(ball.attr('r')) <= Number(bot.attr('x')) + Number(bot.attr('width'))))
                .filter(() => (Number(ball.attr('cx')) - Number(ball.attr('r')) >= Number(bot.attr('x')) + Number(bot.attr('width')) - 4))
                .filter(() => (Number(ball.attr('cy')) + Number(ball.attr('r')) >= (Number(bot.attr('y')))))
                .filter(() => (Number(ball.attr('cy')) - Number(ball.attr('r')) <= (Number(bot.attr('y')) + Number(bot.attr('height')))))
                .subscribe(() => ball.attr('xDir', left));
            Observable.interval(1).filter(() => (Number(ball.attr('cy')) + Number(ball.attr('r'))) >= Number(bot.attr('y')))
                .filter(() => (Number(ball.attr('cy')) + Number(ball.attr('r'))) <= Number(bot.attr('y')) + 4)
                .filter(() => (Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(bot.attr('x')))
                .filter(() => (Number(ball.attr('cx')) - Number(ball.attr('r'))) <= Number(bot.attr('x')) + Number(bot.attr('width')))
                .subscribe(() => ball.attr('yDir', up));
            Observable.interval(1).filter(() => (Number(ball.attr('cy')) - Number(ball.attr('r'))) <= Number(bot.attr('y')) + Number(bot.attr('height')))
                .filter(() => (Number(ball.attr('cy')) - Number(ball.attr('r'))) >= Number(bot.attr('y')) + Number(bot.attr('height')) - 4)
                .filter(() => (Number(ball.attr('cx')) + Number(ball.attr('r'))) >= Number(bot.attr('x')))
                .filter(() => (Number(ball.attr('cx')) - Number(ball.attr('r'))) <= Number(bot.attr('x')) + Number(bot.attr('width')))
                .subscribe(() => ball.attr('yDir', down));
        }
        collisionBorderDetection();
        collisionPaddleDetection();
    }
    function scoreObservable() {
        Observable.interval(1)
            .filter(() => Number(ball.attr('bScore')) < Number(ball.attr('pScore')))
            .subscribe(() => ball.attr('highestScore', Number(ball.attr('pScore'))));
        Observable.interval(1)
            .filter(() => Number(ball.attr('bScore')) > Number(ball.attr('pScore')))
            .subscribe(() => ball.attr('highestScore', Number(ball.attr('bScore'))));
        Observable.interval(1)
            .filter(() => (Number(ball.attr('highestScore')) <= 11))
            .subscribe(() => score.innerHTML = 'Score' + ' ' + ball.attr('bScore') + ':' + ball.attr('pScore'));
    }
    function endGame() {
        Observable
            .interval(10)
            .filter(() => (Number(ball.attr('bScore')) == 11))
            .subscribe(() => {
            endText.innerHTML = "Sorry, you lost.";
        });
        Observable
            .interval(10)
            .filter(() => (Number(ball.attr('pScore')) == 11))
            .subscribe(() => {
            endText.innerHTML = "Congratulations, you won";
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
if (typeof window != 'undefined')
    window.onload = () => {
        pong();
    };
//# sourceMappingURL=pong.js.map