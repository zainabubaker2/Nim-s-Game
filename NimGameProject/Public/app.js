document.addEventListener('DOMContentLoaded', () => {
    const gameStateElement = document.getElementById('game-state');
    const pilesContainer = document.getElementById('piles-container');
    const moveForm = document.getElementById('move-form');
    const messageElement = document.getElementById('message');
    const difficulty = sessionStorage.getItem('difficulty');
    let currentState = [];

    const updateGameState = (state) => {
        currentState = state;
        gameStateElement.textContent = `Game State: ${state.join(', ')}`;
        renderPiles(state);
    };

    const renderPiles = (state) => {
        pilesContainer.innerHTML = '';
        state.forEach((stones, index) => {
            const pileDiv = document.createElement('div');
            pileDiv.className = 'pile mb-5 text-center';
    
            const rowDiv = document.createElement('div');
            rowDiv.className = 'd-flex justify-content-center mb-2 pile-row';
            for (let i = 0; i < stones; i++) {
                const stoneImg = document.createElement('img');
                stoneImg.src = 'nim.png'; 
                stoneImg.alt = 'Stone';
                stoneImg.className = 'stone-icon mx-1';
                stoneImg.style.width = '8px'; 
                stoneImg.style.height = '36px'; 
                rowDiv.appendChild(stoneImg);
            }
            pileDiv.appendChild(rowDiv);
            pilesContainer.appendChild(pileDiv);
        });
    };

    const postData = async (url = '', data = {}) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    };

    moveForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        let pileIndex = parseInt(document.getElementById('pileIndex').value, 10) - 1;
        let stones = parseInt(document.getElementById('stones').value, 10);
    
        const isValidMove = pileIndex >= 0 && pileIndex < currentState.length && stones > 0 && stones <= currentState[pileIndex];
    
        if (isValidMove) {
            const data = await postData('/move', { state: currentState, move: { pileIndex, stones }, difficulty });
    
            if (data.state) {
                updateGameState(data.state);
                messageElement.textContent = data.message || '';
            } else {
                messageElement.textContent = data.error || 'An error occurred.';
            }
        } else {
            messageElement.textContent = 'Invalid input. Please enter valid numbers.';
        }
    });
    

    (async () => {
        const data = await postData('/start');
        if (data.state) {
            updateGameState(data.state);
        } else {
            console.error('Error initializing game state:', data);
        }
    })();    
});
