(function() {
	let totalMovesCounter, currentPlayer, state, isNew;

	const board = document.getElementById('board');
	const resultContainer = document.getElementById('text');
	const startGameButton = document.getElementById('start-game');
	const winCombos = [
		[1, 2, 3],
		[4, 5, 6],
		[7, 8, 9],
		[1, 4, 7],
		[2, 5, 8],
		[3, 6, 9],
		[1, 5, 9],
		[3, 5, 7]
	];

	function startGame() {		
		resultContainer.style.display = 'none';
		
		board.classList.add('board');
		for (let i = 1; i <= 9; i++) {
			let newCell = board.appendChild(document.createElement('div'))
			newCell.classList.add('cell');
			newCell.dataset.position = i;
			newCell.addEventListener('click', move);
		}

		setDefaultOptions();
	}

	function endGame(win) {
		resultContainer.style.display = 'block';

		let winnerInformation = document.getElementById('winner');
		if (win) {
			winnerInformation.innerText = `Player ${currentPlayer} win by ${state[currentPlayer].totalMoves} moves \n Total moves ${totalMovesCounter}`;
		} else {
			winnerInformation.innerText = 'No turns left';
		}

		board.innerText = '';
		board.classList.remove('board');
		isNew = true;

		startGameButton.innerText = 'Start new game';
	}
	
	function move() {
		if (this.classList.value.indexOf('disable') > 0) {
			return false;
		}

		setStateForCell(this, currentPlayer);

		state[currentPlayer].doneMoves.push(+this.dataset.position);
		state[currentPlayer].totalMoves++;
		totalMovesCounter++;
		
		if (totalMovesCounter >= 5) {
   			checkWinner();
   		}
   		
   		updateHistory();
	}

	function checkWinner() {
		if (totalMovesCounter > 9) {
			endGame(false);
		}
		Array.from(winCombos).forEach(winCombo => {
			if (compareSets(winCombo, state[currentPlayer].doneMoves)) {
				endGame(true);
			}
   		});
	}

	function updateHistory() {
		currentPlayer = ((currentPlayer === 'X') ? 'O' : 'X');

		var getParameters = `?totalMovesCounter=${totalMovesCounter}&currentPlayer=${currentPlayer}&state=${JSON.stringify(state)}`;
		window.history.pushState(null, null, `${window.location.pathname}${getParameters}`);
	}


	function setDefaultOptions() {
		if (isNew) {
			window.history.pushState(null, null, `${window.location.pathname}`);
			totalMovesCounter = 1;
			currentPlayer = 'X';
		
			state = {
				X: {
					totalMoves: 0,
					doneMoves: []
				},
				O: {
					totalMoves: 0,
					doneMoves: []
				}
			};
			return true;
		}

		totalMovesCounter = findGet('totalMovesCounter');
		currentPlayer = findGet('currentPlayer');
		state = JSON.parse(findGet('state'));

		Array.from(state.X.doneMoves).forEach(movesX => {
			let cell = document.querySelectorAll(`[data-position="${movesX}"]`);
			setStateForCell(cell[0], 'X');
		});

		Array.from(state.O.doneMoves).forEach(movesO => {
			let cell = document.querySelectorAll(`[data-position="${movesO}"]`);
			setStateForCell(cell[0], 'O');
		});
	}

	function findGet(parameter) {
		parameter =  parameter.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + parameter + "(=([^&#]*)|&|#|$)");
		
		var results = regex.exec(window.location.href);
		if (!results) {
			return null;
		}
		if (!results[2]) {
			return '';
		}

		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	function compareSets(combos, moves) {
		let isContaint = true;
		Array.from(combos).forEach(combo => {
			if (moves.indexOf(combo) === -1){
				isContaint = false;
			}
		});
		return isContaint;
	}

	function setStateForCell(cell, text) {
		if (!cell) {
			return false;
		}

		cell.classList.add('disable');
		cell.innerText = text;
	}

	isNew = (window.location.search.toString().length <= 0);
	startGameButton.innerText = (isNew ? 'Start new game' : 'Continue game');
	startGameButton.addEventListener('click', startGame);

})();