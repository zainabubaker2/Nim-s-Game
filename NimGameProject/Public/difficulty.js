document.getElementById('easy').addEventListener('click', () => selectDifficulty('easy'));
document.getElementById('medium').addEventListener('click', () => selectDifficulty('medium'));
document.getElementById('hard').addEventListener('click', () => selectDifficulty('hard'));

function selectDifficulty(level) {
    sessionStorage.setItem('difficulty', level);
    window.location.href = 'game.html';
}
