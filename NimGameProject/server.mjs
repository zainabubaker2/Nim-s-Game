import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initState, findOptimalMove, applyPlayerMove } from './NimMain.mjs';

const app = express();
const port = 4000;

app.use(cors())
app.use(bodyParser.json());
app.use(express.static('Public'));

app.post('/start', (req, res) => {
    try {
        console.log("Received /start request");
        const state = initState();
        console.log("Sending state:", state.piles);
        res.json({ state: state.piles });
    } catch (error) {
        console.error("Error in /start endpoint:", error); 
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
app.post('/move', (req, res) => {
    try {
        const { state: currentPiles, move, difficulty } = req.body;
        let depth = 5; //medium

        if (difficulty === 'easy') {
            depth = 1;
          

        } else if (difficulty === 'hard') {
            depth = 10;
           
        }

        let { pileIndex, stones } = move;
        pileIndex = parseInt(pileIndex);
        stones = parseInt(stones);

        if (isNaN(pileIndex) || isNaN(stones) || pileIndex < 0 || pileIndex >= currentPiles.length || stones <= 0) {
            return res.status(400).json({ error: 'Invalid move parameters.' });
        }

        if (stones > currentPiles[pileIndex] || stones > 4) {
            return res.status(400).json({ error: 'Invalid move: Too many stones or not enough stones in the pile.' });
        }

        currentPiles[pileIndex] -= stones;

        if (currentPiles.every(pile => pile === 0)) {
            return res.json({ state: currentPiles, message: 'Game over! Ai has won.' });
        }

        const aiMoveState = findOptimalMove(currentPiles, depth);

        if (aiMoveState.every(pile => pile === 0)) {
            return res.json({ state: aiMoveState, message: 'Game over! You have won!' });
        } else {
            return res.json({ state: aiMoveState, message: 'AI has made its move.' });
        }
    } catch (error) {
        console.error('Error in /move endpoint:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});