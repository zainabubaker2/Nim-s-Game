function initState(piles) {
    return { piles: [1, 3, 5, 7] };
}

function isTerminal(piles) {
    return piles.every(pile => pile === 0);
}

function evaluate(piles) {
    let nimSum = piles.reduce((xor, pile) => xor ^ pile, 0);
    return nimSum === 0 ? 0 : 1;
}

function generateChildNodes(piles) {
    const childNodes = [];
    for (let pileIndex = 0; pileIndex < piles.length; pileIndex++) {
        for (let stones = 1; stones <= piles[pileIndex]; stones++) {
            const newPiles = piles.slice();
            newPiles[pileIndex] -= stones;
            childNodes.push(newPiles);
        }
    }
    return childNodes;
}

function alphaBeta(node, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0 || isTerminal(node)) {
        return evaluate(node);
    }

    if (maximizingPlayer) {
        let value = -Infinity;
        for (let childNode of generateChildNodes(node)) {
            value = Math.max(value, alphaBeta(childNode, depth - 1, alpha, beta, false));
            alpha = Math.max(alpha, value);
            if (alpha >= beta) {
                break;
            }
        }
        return value;
        
    } else {
        let value = Infinity;
        for (let childNode of generateChildNodes(node)) {
            value = Math.min(value, alphaBeta(childNode, depth - 1, alpha, beta, true));
            beta = Math.min(beta, value);
            if (alpha >= beta) {
                break;
            }
        }
        return value;
    }
}

function findOptimalMove(piles, depth) {
    let bestValue = -Infinity;
    let bestMove = piles;
    for (let childNode of generateChildNodes(piles)) {
        let value = alphaBeta(childNode, depth - 1, -Infinity, Infinity, false);
        if (value > bestValue) {
            bestValue = value;
            bestMove = childNode;
        }
    }
    return bestMove;
}

function applyPlayerMove(currentState, move) {
    const { pileIndex, stones } = move;
    if (pileIndex >= 0 && pileIndex < currentState.length && currentState[pileIndex] >= stones) {
        currentState[pileIndex] -= stones;
        return currentState;
    } else {
        throw new Error("Invalid move. Please enter a valid move.");
    }
}

export { initState, findOptimalMove, applyPlayerMove };
