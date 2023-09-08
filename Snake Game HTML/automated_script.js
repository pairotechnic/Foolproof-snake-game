$(function(){

    var canvas = $('canvas')[0];
    var ctx = canvas.getContext('2d');

    var blockSize = 50;
    var snake = [
        { x: 150, y: 0, oldX: 0, oldY : 0}
    ];
    var food = { x:0, y:0, eaten:false};
    var snakeWidth = snakeHeight = blockSize;
    
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    var keyPressed = RIGHT;
    var score = 0;
    var game = setInterval(gameLoop, 1);

    function gameLoop(){
        console.log('loop running');
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
    }

    
    function moveSnake(){
        $.each(snake, function(index,value){
            snake[index].oldX = value.x;
            snake[index].oldY = value.y;
            if(index == 0) {
                //Defining the effects of pressing each arrow key
                if(keyPressed == DOWN) {
                    snake[index].y = value.y + blockSize;
                }
                else if(keyPressed == UP) {
                    snake[index].y = value.y - blockSize;
                }
                else if(keyPressed == RIGHT) {
                    snake[index].x = value.x + blockSize;
                }
                else if(keyPressed == LEFT) {
                    snake[index].x = value.x - blockSize;
                }
                //Automating pressing of keys to follow the Hamiltonian path
                if (snake[index].x == 0 && snake[index].y == canvas.height - blockSize)
                {
                    keyPressed = UP;
                }
                else if (snake[index].x == 0 && snake[index].y == 0 )
                {
                    keyPressed = RIGHT;
                }
                else if (snake[index].x == canvas.width - blockSize && keyPressed == RIGHT)
                {
                    keyPressed = DOWN;
                }
                else if (snake[index].x == canvas.width - blockSize && keyPressed == DOWN)
                {
                    keyPressed = LEFT;
                }
                else if (snake[index].x == blockSize && snake[index].y != canvas.height - blockSize && keyPressed == LEFT)
                {
                    keyPressed = DOWN;
                }
                else if (snake[index].x == blockSize && keyPressed == DOWN)
                {
                    keyPressed = RIGHT;
                }
            }
            else{
                snake[index].x = snake[index - 1].oldX;
                snake[index].y = snake[index - 1].oldY;
            }

        });
    }
    function drawSnake(){
        $.each(snake, function(index,value){
            ctx.fillStyle = 'red'
            ctx.fillRect(value.x, value.y, snakeWidth, snakeHeight);
            ctx.strokeStyle = 'white';
            ctx.strokeRect(value.x, value.y, snakeWidth, snakeHeight);
            if(index == 0){
                if(collided(value.x, value.y)) {
                    gameOver();
                }
                if(didEatFood(value.x, value.y)){
                    score++;
                    $('#score').text(score);
                    makeSnakeBigger();
                    food.eaten = true;
                }
            }

        });
    }

    function makeSnakeBigger(){
        snake.push({
            x: snake[snake.length - 1].oldX,
            y: snake[snake.length - 1].oldY
        });
    }

    function collided(x, y){
        return snake.filter(function(value, index){
            return index != 0 && value.x == x && value.y == y;
        }).length > 0 || x < 0 || x > canvas.width || y < 0 || y > canvas.height;
    }

    function drawFood(){
        ctx.fillStyle = 'yellow';
        if(food.eaten == true) {
            food = getNewLocationForFood();
        }
        ctx.fillRect(food.x, food.y, snakeWidth, snakeHeight);
    }

    function didEatFood(x,y){
        return  food.x == x && food.y ==y;
    }

    function clearCanvas(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    $(document).keydown(function(e){
        if($.inArray(e.which, [DOWN, UP, LEFT, RIGHT]) != -1) {
            keyPressed = CheckKeyIsAllowed(e.which);
        }
    });

    function CheckKeyIsAllowed(tempKey){
        let key;
        if(tempKey == DOWN){
            key = (keyPressed != UP) ? tempKey : keyPressed;
        }
        else if(tempKey == UP){
            key = (keyPressed != DOWN) ? tempKey : keyPressed;
        }
        else if(tempKey == LEFT){
            key = (keyPressed != RIGHT) ? tempKey : keyPressed;
        }
        else if(tempKey == RIGHT){
            key = (keyPressed != LEFT) ? tempKey : keyPressed;
        }
        return key;
    }

    function gameOver(){
         clearInterval(game);
         alert('Game Over');
    }
    
    function getNewLocationForFood(){
        let newX, newY;
        newX = Math.floor(Math.random() * ((canvas.width - blockSize)/blockSize))*blockSize;
        newY = Math.floor(Math.random() * ((canvas.height - blockSize)/blockSize))*blockSize;
        return{
            x : newX,
            y: newY,
        };
    }
});