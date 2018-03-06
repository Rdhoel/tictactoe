(function() {
	var board = document.getElementById('board');
	var resultContainer = document.getElementById('text');
	var totalMovesCounter, currentPlayer, state;

	const winCombos = [
		[1, 2, 3],
		[4, 5, 6],
		[7, 8, 9],
		[1, 4, 7],
		[2, 5, 7],
		[3, 6, 9],
		[1, 5, 9],
		[3, 5, 7]
	];

	function startGame() {
		setDefaultOptions();		
		
		resultContainer.style.display = 'none';
		
		board.classList.add('board');
		for (let i = 1; i <= 9; i++) {
			let newCell = board.appendChild(document.createElement('div'))
			newCell.classList.add('cell');
			newCell.dataset.position = i;
			newCell.addEventListener('click', move);
		}
	}

	function endGame(win) {
		resultContainer.style.display = 'block';

		let winnerInformation = document.getElementById('winner');
		if (win) {
			winnerInformation.innerText = `Player ${currentPlayer} win by ${state[currentPlayer].totalMoves} moves`;
		} else {
			winnerInformation.innerText = 'No turns left';
		}

		board.innerHTML = '';
		board.classList.remove('board');

	}
	
	function move() {
		if (this.classList.value.indexOf('disable') > 0) {
			return false;
		}

		this.innerText = currentPlayer;
		this.classList.add('disable');
		
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
			console.log(winCombo, state[currentPlayer].doneMoves);
			if (state[currentPlayer].doneMoves.constaintCombination(winCombo)) {
				console.log(1);
				endGame(true);
			}
   		});
	}

	function updateHistory() {
		currentPlayer = ((currentPlayer === 'X') ? 'O' : 'X');
	}

	Array.prototype.constaintCombination = function(combosArray) {
    	return combosArray.every(function(element) {
        	return this.indexOf(element) !== -1;
    	}, this);
	}

	document.getElementById('start-game').addEventListener('click', startGame);

	function setDefaultOptions() {
		totalMovesCounter = 1;
		
		currentPlayer = 'X';
		
		state = {
			'X': {
				'totalMoves': 0,
				'doneMoves': []
			},
			'O': {
				'totalMoves': 0,
				'doneMoves': []
			}
		};
	}

})();