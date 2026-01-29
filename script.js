// Function to initialize the game
let retryCount = 0;
const maxRetries = 50; // 5 seconds max wait time

function initGame() {
    // Check if Phaser is loaded
    if (typeof Phaser === 'undefined') {
        retryCount++;
        if (retryCount > maxRetries) {
            console.error('Phaser library failed to load after multiple attempts!');
            const container = document.getElementById('game-container');
            if (container) {
                container.innerHTML = '<p style="color: white; padding: 20px; background: #ff0000;">Error: Phaser library failed to load. Please check your internet connection and refresh the page.</p>';
            }
            return;
        }
        console.log('Phaser library not loaded yet, retrying... (' + retryCount + '/' + maxRetries + ')');
        setTimeout(initGame, 100);
        return;
    }
    
    retryCount = 0; // Reset counter

    console.log('Phaser loaded successfully!');

    // Game Scene Class
    class GameScene extends Phaser.Scene {
        constructor() {
            super({ key: 'GameScene' });
        }

        preload() {
            // No assets to load for this simple example
            console.log('Scene preload called');
        }

        create() {
            console.log('Scene create called');
            const { width, height } = this.scale;
            console.log('Game dimensions:', width, height);

            // Set background color (lighter so we can see it)
            this.cameras.main.setBackgroundColor('#1a1a2e');

            // Create paddle (static body) - white rectangle
            this.paddle = this.add.rectangle(50, height / 2, 20, 100, 0xffffff);
            this.physics.add.existing(this.paddle, true); // true = static body (already immovable)

            // Create ball (dynamic body) - red circle
            this.ball = this.add.circle(width / 2, height / 2, 10, 0xff0000);
            this.physics.add.existing(this.ball);

            // Configure ball physics
            this.ball.body.setCollideWorldBounds(true, true, true, true);
            this.ball.body.setBounce(1, 1);
            this.ball.body.setVelocity(200, 150);

            // Enable world bounds for collisions
            this.physics.world.setBounds(0, 0, width, height);

            // Initialize score
            this.score = 0;

            // Create score text with better visibility
            this.scoreText = this.add.text(16, 16, 'Score: 0', {
                fontSize: '32px',
                fill: '#ffffff',
                fontFamily: 'Arial, sans-serif',
                stroke: '#000000',
                strokeThickness: 4
            });

            // Set up keyboard input
            this.cursors = this.input.keyboard.createCursorKeys();

            // Add collision between ball and paddle
            this.physics.add.collider(this.ball, this.paddle, () => {
                this.score += 1;
                this.scoreText.setText('Score: ' + this.score);

                // Slightly increase ball speed on each hit
                const vx = this.ball.body.velocity.x * 1.05;
                const vy = this.ball.body.velocity.y * 1.05;
                this.ball.body.setVelocity(vx, vy);
            });

            // Add a test rectangle to verify rendering works
            this.add.rectangle(width / 2, 50, 200, 30, 0x00ff00);
            this.add.text(width / 2, 50, 'Game Loaded!', {
                fontSize: '20px',
                fill: '#000000',
                fontFamily: 'Arial',
                align: 'center'
            }).setOrigin(0.5);

            console.log('Game objects created successfully');
            console.log('Paddle:', this.paddle);
            console.log('Ball:', this.ball);
        }

        update() {
            const height = this.scale.height;
            const speed = 300;

            // Paddle movement
            let dy = 0;
            if (this.cursors.up.isDown) {
                dy = -speed;
            } else if (this.cursors.down.isDown) {
                dy = speed;
            }

            if (dy !== 0) {
                this.paddle.y += dy * this.game.loop.delta / 1000;

                // Keep paddle within bounds
                const halfHeight = this.paddle.height / 2;
                if (this.paddle.y - halfHeight < 0) {
                    this.paddle.y = halfHeight;
                } else if (this.paddle.y + halfHeight > height) {
                    this.paddle.y = height - halfHeight;
                }

                // Update static body position to match game object
                if (this.paddle.body) {
                    this.paddle.body.updateFromGameObject();
                }
            }
        }
    }

    // Phaser game configuration
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scene: GameScene
    };

    // Create the Phaser game instance
    try {
        const game = new Phaser.Game(config);
        console.log('Phaser game created successfully');
    } catch (error) {
        console.error('Error creating Phaser game:', error);
        const container = document.getElementById('game-container');
        if (container) {
            container.innerHTML = '<p style="color: white; padding: 20px;">Error: ' + error.message + '</p>';
        }
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    // DOM is already ready
    initGame();
}


