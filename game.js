document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const gameContainer = document.getElementById('game-container');
    const gameOverScreen = document.getElementById('game-over-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const player1NameInput = document.getElementById('player1-name');
    const player2NameInput = document.getElementById('player2-name');
    const player1Display = document.getElementById('player1-display');
    const player2Display = document.getElementById('player2-display');
    const player1ClanBadge = document.getElementById('player1-clan');
    const player2ClanBadge = document.getElementById('player2-clan');
    const currentPlayerDisplay = document.getElementById('current-player');
    const gamePhaseDisplay = document.getElementById('game-phase');
    const gameBoard = document.getElementById('game-board');
    const unitImage = document.getElementById('unit-image');
    const unitName = document.getElementById('unit-name');
    const hpFill = document.getElementById('hp-fill');
    const hpText = document.getElementById('hp-text');
    const unitAttack = document.getElementById('unit-attack');
    const unitDefense = document.getElementById('unit-defense');
    const unitRange = document.getElementById('unit-range');
    const unitSpecial = document.getElementById('unit-special');
    const unitSuperPower = document.getElementById('unit-sp');
    const unitActions = document.getElementById('unit-actions');
    const unitImage2 = document.getElementById('unit-image2');
    const unitName2 = document.getElementById('unit-name2');
    const hpFill2 = document.getElementById('hp-fill2');
    const hpText2 = document.getElementById('hp-text2');
    const unitAttack2 = document.getElementById('unit-attack2');
    const unitDefense2 = document.getElementById('unit-defense2');
    const unitRange2 = document.getElementById('unit-range2');
    const unitSpecial2 = document.getElementById('unit-special2');
    const unitSuperPower2 = document.getElementById('unit-sp2');
    const unitActions2 = document.getElementById('unit-actions2');
    const endTurnBtn = document.getElementById('end-turn-btn');
    const restartBtn = document.getElementById('restart-btn');
    const diceElement = document.getElementById('dice');
    const rollDiceBtn = document.getElementById('roll-dice-btn');
    const victoryMessage = document.getElementById('victory-message');
    const winnerDisplay = document.getElementById('winner-display');
    const playAgainBtn = document.getElementById('play-again-btn');

    const gameState = {
        currentPlayer: 1,
        initialPlayer: 1,
        gamePhase: 'clanSelection', 
        players: {
            1: { name: '', clan: null, units: [], avatar: '' },
            2: { name: '', clan: null, units: [], avatar: '' }
        },
        selectedUnit: null,
        boardSize: 10,
        clans: {
            montagnes: { 
                name: 'Montagnes',
                units: { guerrier: 3, archer: 2, mage: 1 },
                advantage: 'Défense renforcée',
                avatar: 'assets/clans/montagnes.png'
            },
            plaines: { 
                name: 'Plaines',
                units: { guerrier: 2, archer: 3, mage: 1 },
                advantage: 'Attaques à distance précises',
                avatar: 'assets/clans/plaines.png'
            },
            sages: { 
                name: 'Sages',
                units: { guerrier: 1, archer: 2, mage: 3 },
                advantage: 'Sorts puissants, mais faible défense',
                avatar: 'assets/clans/sages.png'
            }
        },
        unitTypes: {
            guerrier: { 
                name: 'Guerrier',
                hp: 100,
                attack: 120,
                defense: 20,
                range: 1,
                special: 'Haute défense, bon en duel',
                superPower: '⚔️ Défense impénétrable, Annule tous les dégâts si l’adversaire obtient moins de 5 au dé.',
                image: 'assets/units/guerrier.png',
                image2: 'assets/units/guerrier2.png'
            },
            archer: { 
                name: 'Archer',
                hp: 80,
                attack: 90,
                defense: 10,
                range: 3,
                special: 'Peut tirer sans s\'exposer directement',
                superPower: '🏹 Précision mortelle, Inflige le double de dégâts si l’archer obtient 5 ou 6 au dé.',
                image: 'assets/units/archer.png',
                image2: 'assets/units/archer2.png'
            },
            mage: { 
                name: 'Mage',
                hp: 60,
                attack: 65,
                defense: 5,
                range: 2,
                special: 'Sorts de zone ou puissants, faible défense',
                superPower: '🔥 Feu de zone, Attaque toute une colonne ennemie avec un sort de feu.',
                image: 'assets/units/mage.png',
                image2: 'assets/units/mage2.png'
            }
        },
        diceResult: null,
        combatLog: [],
        pendingCombat: null,
        turnCounter: {
            1: 0,
            2: 0
        },
        wallCollapseLevel: 0 
    };

    function initGame() {
        createGameBoard();
        
        setupEventListeners();
        
        welcomeScreen.style.display = 'block';
        gameContainer.style.display = 'none';
        gameOverScreen.style.display = 'none';
    }

    function createGameBoard() {
        gameBoard.innerHTML = '';
        
        for (let row = 1; row <= gameState.boardSize; row++) {
            for (let col = 1; col <= gameState.boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                if (row <= 3) {
                    cell.classList.add('player1-zone');
                } else if (row >= 8) {
                    cell.classList.add('player2-zone');
                }
                
                cell.addEventListener('click', () => handleCellClick(row, col));
                gameBoard.appendChild(cell);
            }
        }
    }

    function setupEventListeners() {
        document.querySelectorAll('#player1-form .clan-option').forEach(option => {
            option.addEventListener('click', () => {
                const clan = option.dataset.clan;
                gameState.players[1].clan = clan;
                gameState.players[1].avatar = gameState.clans[clan].avatar;
                document.querySelectorAll('#player1-form .clan-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        document.querySelectorAll('#player2-form .clan-option').forEach(option => {
            option.addEventListener('click', () => {
                const clan = option.dataset.clan;
                gameState.players[2].clan = clan;
                gameState.players[2].avatar = gameState.clans[clan].avatar;
                document.querySelectorAll('#player2-form .clan-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        startGameBtn.addEventListener('click', () => {
            if (!gameState.players[1].clan || !gameState.players[2].clan || 
                !player1NameInput.value || !player2NameInput.value) {
                alert('Veuillez remplir tous les champs et sélectionner un clan pour chaque joueur.');
                return;
            }

            gameState.players[1].name = player1NameInput.value;
            gameState.players[2].name = player2NameInput.value;

            startGame();
        });

        endTurnBtn.addEventListener('click', () => {
            endTurn();
        });

        restartBtn.addEventListener('click', () => {
            resetGame();
        });

        playAgainBtn.addEventListener('click', () => {
            playAgain();
        });

       rollDiceBtn.addEventListener('click', async () => {
            const result = await rollDice();

            if (gamePhaseDisplay.textContent === "Déterminer qui commence...") {
                return;
            }

            if (gamePhaseDisplay.textContent === "Phase d'action") {
                gameState.diceResult = result;
                resolveCombat();
            }
        });


    }
    async function askForStartingDice() {
        gamePhaseDisplay.textContent = "Déterminer qui commence...";

        let p1Roll, p2Roll;
        do {
            addToCombatLog(`🎲${gameState.players[1].name}, lancez le dé pour commencer.`);
            await waitForPlayerRoll(1);

            addToCombatLog(`🎲${gameState.players[2].name}, lancez le dé pour commencer.`);
            await waitForPlayerRoll(2);

            p1Roll = gameState.players[1].startRoll;
            p2Roll = gameState.players[2].startRoll;

            if (p1Roll === p2Roll) {
                addToCombatLog("🎲 Égalité ! On relance...");
            }

        } while (p1Roll === p2Roll);

        gameState.currentPlayer = p1Roll > p2Roll ? 1 : 2;
        gameState.initialPlayer = gameState.currentPlayer;

        updatePlayerDisplay();
        gameState.gamePhase = 'placement';
        gamePhaseDisplay.textContent = 'Phase de placement';
        addToCombatLog(`🏁${gameState.players[gameState.currentPlayer].name} commence la phase de placement.`);
        const nextunitType = getNextUnitToPlace(gameState.players[gameState.currentPlayer]);
            if (!nextunitType) {
                //addToCombatLog('🧩Toutes vos unités ont été placées.');
                return;
            }
            const unitLabel = gameState.unitTypes[nextunitType].name;
            addToCombatLog(`♟️${gameState.players[gameState.currentPlayer].name} prépare à placer un(e) ${unitLabel}.`);
    }

function waitForPlayerRoll(playerNumber) {
    return new Promise((resolve) => {
        rollDiceBtn.disabled = false;
        showDiceRoller();

        const onClick = async () => {
            rollDiceBtn.removeEventListener('click', onClick);
            const result = await rollDice();
            gameState.players[playerNumber].startRoll = result;
            addToCombatLog(`🎲${gameState.players[playerNumber].name} a obtenu un ${result}.`);
            hideDiceRoller();
            resolve();
        };

        rollDiceBtn.addEventListener('click', onClick);
    });
}
    function rollDice() {
        return new Promise((resolve) => {
            rollDiceBtn.disabled = true;
            diceElement.classList.add('dice-rolling');

            let rolls = 0;
            const rollInterval = setInterval(() => {
                const randomValue = Math.floor(Math.random() * 6) + 1;
                diceElement.textContent = randomValue;
                rolls++;

                if (rolls >= 10) {
                    clearInterval(rollInterval);
                    diceElement.classList.remove('dice-rolling');
                    const finalValue = parseInt(diceElement.textContent);
                    gameState.diceResult = finalValue;
                    rollDiceBtn.disabled = false;
                    resolve(finalValue); 
                }
            }, 100);
        });
    }



    function startGame() {
        welcomeScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        
        player1Display.textContent = gameState.players[1].name;
        player2Display.textContent = gameState.players[2].name;
        player1ClanBadge.style.backgroundImage = `url(${gameState.players[1].avatar})`;
        player2ClanBadge.style.backgroundImage = `url(${gameState.players[2].avatar})`;
        
       gameState.gamePhase = 'diceToStart';

    askForStartingDice();
}
    function handleCellClick(row, col) {        
        switch (gameState.gamePhase) {
            case 'placement':
                handlePlacementPhase(row, col);
                break;
            case 'movement':
                handleMovementPhase(row, col);
                break;
            case 'action':
                handleActionPhase(row, col);
                break;
        }
    }
     
    function handlePlacementPhase(row, col) {
        const player = gameState.players[gameState.currentPlayer];
        
        if ((gameState.currentPlayer === 1 && row > 3) || 
            (gameState.currentPlayer === 2 && row < 8)) {
            addToCombatLog(`🚫Placement invalide : vous ne pouvez placer des unités que dans votre zone.`);
            return;
        }
        
        const unitType = getNextUnitToPlace(player);
        if (!unitType) {
            addToCombatLog('🧩Toutes vos unités ont été placées.');
            return;
        }

        const allUnits = getAllUnits();
        const unitsInCell = allUnits.filter(u => u.row === row && u.col === col);

        if (unitsInCell.length >= 2) {
            addToCombatLog("❌ Maximum 2 unités par case !");
            return;
        }
        
        const unitId = `player${gameState.currentPlayer}-${unitType}-${Date.now()}`;
        const unit = {
            id: unitId,
            type: unitType,
            player: gameState.currentPlayer,
            row: row,
            col: col,
            hp: gameState.unitTypes[unitType].hp,
            maxHp: gameState.unitTypes[unitType].hp,
            hasMoved: false,
            hasActed: false
        };
        
        player.units.push(unit);
        renderUnit(unit);
        addToCombatLog(`♟️${player.name} a placé un ${unitType} en (${row}, ${col}).`);
        
        if (areAllUnitsPlaced(player)) {
            const otherPlayerId = gameState.currentPlayer === 1 ? 2 : 1;

            if (!areAllUnitsPlaced(gameState.players[otherPlayerId])) {
                gameState.currentPlayer = otherPlayerId;
                updatePlayerDisplay();
                addToCombatLog(`♟️${gameState.players[gameState.currentPlayer].name}, placez maintenant vos unités.`);
                const nextunitType = getNextUnitToPlace(gameState.players[gameState.currentPlayer]);
                if (!nextunitType) {
                    //addToCombatLog('🧩Toutes vos unités ont été placées.');
                    return;
                }
                const unitLabel = gameState.unitTypes[nextunitType].name;
                addToCombatLog(`♟️${gameState.players[gameState.currentPlayer].name}, placez maintenant vos unités, prépare à placer un(e) ${unitLabel}.`);
            } else {
                gameState.currentPlayer = gameState.initialPlayer;
                updatePlayerDisplay();
                gameState.gamePhase = 'movement';
                gamePhaseDisplay.textContent = 'Phase de mouvement';
                document.getElementById("end-movement-btn").style.display = "inline-block";
                document.getElementById("end-movement-btn").disabled = false;
                endTurnBtn.disabled = false;
                addToCombatLog(`✅Toutes les unités sont en place. 🏁${gameState.players[gameState.currentPlayer].name} commence !`);
            }
    }
            const nextunitType = getNextUnitToPlace(player);
                if (!nextunitType) {
                    //addToCombatLog('🧩Toutes vos unités ont été placées.');
                    return;
                }
                const unitLabel = gameState.unitTypes[unitType].name;
                addToCombatLog(`♟️${player.name} prépare à placer un(e) ${unitLabel}.`);
            }

    function getAllUnits() {
    return [...gameState.players[1].units, ...gameState.players[2].units];
}

    function handleMovementPhase(row, col) {
        const player = gameState.players[gameState.currentPlayer];

        if (!gameState.selectedUnit) {
            const unitsAtPos = player.units.filter(u => u.row === row && u.col === col && u.hp > 0 && !u.hasMoved);
            const selectableUnit = unitsAtPos[0];

            if (selectableUnit) {
                gameState.selectedUnit = selectableUnit;
                document.querySelectorAll('.unit-selected').forEach(el => {
                    el.classList.remove('unit-selected');
                });

                const selectedEl = document.querySelector(`[data-unit-id="${selectableUnit.id}"]`);
                if (selectedEl) {
                    const img = selectedEl.querySelector('img');
                    if (img) {
                        img.classList.add('unit-selected');
                    }
                }
                highlightMovementOptions(selectableUnit);
                showUnitInfo(selectableUnit);
                addToCombatLog(`🧭${selectableUnit.type} sélectionné pour le mouvement.`);
            }
            return;
        }

        const selectedUnit = gameState.selectedUnit;
        const distance = Math.abs(selectedUnit.row - row) + Math.abs(selectedUnit.col - col);
        const isSameCell = selectedUnit.row === row && selectedUnit.col === col;

        const unitsInTargetCell = getAllUnits().filter(u => u.row === row && u.col === col);

        if (distance === 0 || distance === 1) {
            const enemyInTargetCell = unitsInTargetCell.some(u => u.player !== selectedUnit.player);
            if (enemyInTargetCell && !isSameCell) {
                addToCombatLog("❌Déplacement interdit : la case est occupée par une unité ennemie.");
                return;
            }
            if (unitsInTargetCell.length < 2 || isSameCell) {
                const fromRow = selectedUnit.row;
                const fromCol = selectedUnit.col;
                removeUnitFromBoard(selectedUnit);
                selectedUnit.row = row;
                selectedUnit.col = col;
                selectedUnit.hasMoved = true;

                renderUnit(selectedUnit);               
                
                const unitLeftBehind = getAllUnits().find(u =>
                    u.row === fromRow && u.col === fromCol
                );
                if (unitLeftBehind) {
                    const leftEl = document.querySelector(`[data-unit-id="${unitLeftBehind.id}"]`);
                    if (leftEl) {
                        leftEl.classList.remove("unit-case1", "unit-case2");
                    }
                }

                const otherUnit = unitsInTargetCell.find(u => u.id !== selectedUnit.id);
                if (otherUnit) {
                    removeUnitFromBoard(otherUnit);
                    renderUnit(otherUnit);

                    const existingEl = document.querySelector(`[data-unit-id="${otherUnit.id}"]`);
                    const movedEl = document.querySelector(`[data-unit-id="${selectedUnit.id}"]`);

                    if (existingEl) {
                        existingEl.classList.remove("unit-case1", "unit-case2");
                        existingEl.classList.add("unit-case1");
                    }
                    if (movedEl) {
                        movedEl.classList.remove("unit-case1", "unit-case2");
                        movedEl.classList.add("unit-case2");
                    }
                }

                addToCombatLog(`♟️${selectedUnit.type} ${isSameCell ? "reste sur place" : `déplacé vers (${row}, ${col})`}.`);
                clearHighlights();
                gameState.selectedUnit = null;

                if (player.units.every(u => u.hasMoved || u.hp <= 0)) {
                    gameState.gamePhase = 'action';
                    document.getElementById("end-movement-btn").style.display = "none";
                    gamePhaseDisplay.textContent = 'Phase d\'action';
                    addToCombatLog('🏁Phase d\'action commencée.');
                }
            } else {
                addToCombatLog('❌Mouvement invalide : la case cible est pleine.');
            }
        } else {
            addToCombatLog('❌Mouvement invalide : vous ne pouvez vous déplacer que d\'une case.');
        }
    }

    function handleActionPhase(row, col) {
        const player = gameState.players[gameState.currentPlayer];
        const enemyPlayer = gameState.players[gameState.currentPlayer === 1 ? 2 : 1];

        const friendlyUnitsInCell = player.units.filter(u => u.row === row && u.col === col && u.hp > 0 && !u.hasActed);

        if (friendlyUnitsInCell.length === 1) {
            const clickedUnit = friendlyUnitsInCell[0];
            gameState.selectedUnit = clickedUnit;
            gameState.selectedGroup = null;
            clearHighlights();
            highlightAttackOptions(clickedUnit);
            document.getElementById('unit-panel2').style.display = 'none';
            showUnitInfo(clickedUnit);
            addToCombatLog(`♟️${clickedUnit.type} sélectionné pour l'action.`);
            return;
        }

        if (friendlyUnitsInCell.length === 2) {
            gameState.selectedUnit = friendlyUnitsInCell[0]; 
            gameState.selectedGroup = friendlyUnitsInCell;
            console.log(friendlyUnitsInCell[0])
            console.log(friendlyUnitsInCell[1])
            clearHighlights();
            highlightAttackOptions(friendlyUnitsInCell[0]); 
            highlightAttackOptions(friendlyUnitsInCell[1]); 
            showUnitInfo(friendlyUnitsInCell[0]);
            showUnitInfo2(friendlyUnitsInCell[1]);
            addToCombatLog(`♟️♟️Deux unités sélectionnées pour une attaque groupée.`);
            return;
        }

        if (!gameState.selectedUnit) {
            const unit = findUnitAtPosition(row, col, player.units);
            if (unit && !unit.hasActed && unit.hp > 0) {
                gameState.selectedUnit = unit;
                console.log("here")
                highlightAttackOptions(unit);
                showUnitInfo(unit);
                addToCombatLog(`♟️${unit.type} sélectionné pour l'action.`);
            }
            return;
        }
        document.querySelectorAll('.unit-selected').forEach(el => {
            el.classList.remove('unit-selected');
        });

        
        const selectedUnit = gameState.selectedUnit;
        const selectedGroup = gameState.selectedGroup || [selectedUnit];
        const targetUnit = findUnitAtPosition(row, col, enemyPlayer.units);

        if (targetUnit && targetUnit.hp > 0) {
            const attackersInRange = selectedGroup.filter(unit => {
                const range = gameState.unitTypes[unit.type].range;
                const dist = Math.abs(unit.row - row) + Math.abs(unit.col - col);
                return dist <= range;
            });

            if (attackersInRange.length === 0) {
                addToCombatLog('❌Aucune de vos unités sélectionnées ne peut atteindre cette cible.');
                return;
            }
            attackersInRange.forEach(attacker => {
                const attackerEl = document.querySelector(`[data-unit-id="${attacker.id}"]`);
                if (attackerEl) {
                    const img = attackerEl.querySelector('img');
                                if (img) {
                                    img.classList.add('unit-selected');
                                } 
                }
            });

            showDiceRoller();
            gameState.diceResult = null;
            diceElement.textContent = '?';

            gameState.pendingCombat = {
                attacker: attackersInRange.length === 1 ? attackersInRange[0] : null,
                groupAttackers: attackersInRange.length > 1 ? attackersInRange : null,
                defender: targetUnit,
                targetRow: row,
                targetCol: col
            };


            const logMsg = attackersInRange.length > 1
                ? `💥 Attaque groupée de ${attackersInRange.length} unités contre ${targetUnit.type} en (${row}, ${col}). 🎲 Lancez le dé !`
                : `⚔️ ${attackersInRange[0].type} attaque ${targetUnit.type} en (${row}, ${col}). 🎲 Lancez le dé !`;


            addToCombatLog(logMsg);
        } else {
            addToCombatLog('❌Aucune cible valide sélectionnée.');
        }
    }


    function resolveCombat() {
        const result = gameState.diceResult;
        const { attacker, groupAttackers, defender, targetRow, targetCol } = gameState.pendingCombat;
        const logPrefix = `${defender.type} (${targetRow},${targetCol})`;

        if (result >= 2) {

            if (groupAttackers && groupAttackers.length >= 2) {
                const enemyUnits = gameState.players[defender.player].units;
                const defendersInCell = enemyUnits.filter(u => u.row === targetRow && u.col === targetCol && u.hp > 0);

                const totalAttack = groupAttackers.reduce((sum, u) => sum + gameState.unitTypes[u.type].attack, 0);
                const totalDefense = defendersInCell.reduce((sum, u) => sum + gameState.unitTypes[u.type].defense, 0);

                let damage = totalAttack - totalDefense;
                damage = Math.max(0, damage);

                addToCombatLog(`⚔️ Attaque groupée : ${groupAttackers.map(u => u.type).join(' + ')} contre ${defendersInCell.map(u => u.type).join(' + ')} → ${damage} dégâts.`);

                defendersInCell.forEach(def => {
                    def.hp -= damage;
                    if (def.hp <= 0) {
                        addToCombatLog(`💀${def.type} est éliminé !`);
                        removeUnitFromBoard(def);
                    } else {
                        //renderUnit(def);
                        addToCombatLog(`🩸${def.type} en (${def.row}, ${def.col}) subit ${damage} dégâts.`);
                    }
                });
                const remainingDefs = gameState.players[defender.player].units.filter(u =>
                    u.row === targetRow && u.col === targetCol && u.hp > 0
                );
                console.log(remainingDefs);
                if (remainingDefs.length === 1) {
                    const remainingEl = document.querySelector(`[data-unit-id="${remainingDefs[0].id}"]`);
                    if (remainingEl) {
                        remainingEl.classList.remove("unit-case1", "unit-case2");
                    }
                }

                gameState.players[defender.player].units = enemyUnits.filter(u => u.hp > 0);
                groupAttackers.forEach(u => u.hasActed = true);
                checkVictory();
            }

            else if (attacker && attacker.type !== "mage") {
                const enemyUnits = gameState.players[defender.player].units;
                const defendersInCell = enemyUnits.filter(u => u.row === targetRow && u.col === targetCol && u.hp > 0);

                const totalDefense = defendersInCell.reduce((sum, u) => sum + gameState.unitTypes[u.type].defense, 0);
                let baseAttack = gameState.unitTypes[attacker.type].attack;

                if (attacker.type === 'archer' && result >= 5) {
                    baseAttack *= 2;
                    addToCombatLog(`🎯 Précision mortelle ! Les dégâts de ${attacker.type} sont doublés.`);
                }

                const hasGuerrier = defendersInCell.some(def => def.type === 'guerrier');
                let damage = baseAttack - totalDefense;

                if (hasGuerrier && result < 5) {
                    damage = 0;
                    addToCombatLog(`🛡 Défense impénétrable ! Le(s) guerrier(s) bloquent complètement l'attaque.`);
                }

                damage = Math.max(0, damage);

                addToCombatLog(`💣${attacker.type} attaque ${defendersInCell.map(d => d.type).join(' + ')} → dégâts : ${damage}.`);

                defendersInCell.forEach(def => {
                    def.hp -= damage;
                    if (def.hp <= 0) {
                        addToCombatLog(`💀${def.type} est éliminé !`);
                        removeUnitFromBoard(def);
                    } else {
                        addToCombatLog(`🩸${def.type} en (${def.row}, ${def.col}) subit ${damage} dégâts.`);
                    }
                });

                const remainingDefs = gameState.players[defender.player].units.filter(u =>
                    u.row === targetRow && u.col === targetCol && u.hp > 0
                );

                if (remainingDefs.length === 1) {
                    const remainingEl = document.querySelector(`[data-unit-id="${remainingDefs[0].id}"]`);
                    if (remainingEl) {
                        remainingEl.classList.remove("unit-case1", "unit-case2");
                    }
                }

                gameState.players[defender.player].units = enemyUnits.filter(u => u.hp > 0);
                attacker.hasActed = true;
                checkVictory();
            }


            else if (attacker && attacker.type === "mage") {
                const targetCol = defender.col;
                const enemyUnits = gameState.players[defender.player].units;

                const affectedCells = new Set(
                    enemyUnits
                        .filter(u => u.col === targetCol && u.hp > 0)
                        .map(u => `${u.row},${u.col}`)
                );

                addToCombatLog(`🔥${attacker.type} déclenche une attaque de feu sur toute la colonne ${targetCol} !`);

                affectedCells.forEach(cell => {
                    const [row, col] = cell.split(',').map(Number);
                    const targetsInCell = enemyUnits.filter(u => u.row === row && u.col === col && u.hp > 0);

                    const totalDefense = targetsInCell.reduce((sum, u) => sum + gameState.unitTypes[u.type].defense, 0);
                    let damage = gameState.unitTypes.mage.attack - totalDefense;
                    damage = Math.max(0, damage);

                    addToCombatLog(`🔥 Case (${row}, ${col}) : défense = ${totalDefense}, dégâts = ${damage}`);

                    targetsInCell.forEach(target => {
                        target.hp -= damage;
                        addToCombatLog(`🔥 ${target.type} en (${target.row}, ${target.col}) subit ${damage} dégâts.`);

                        if (target.hp <= 0) {
                            addToCombatLog(`💀${target.type} est éliminé !`);
                            removeUnitFromBoard(target);
                        }
                    });
                });
                const remainingDefs = gameState.players[defender.player].units.filter(u =>
                    u.row === targetRow && u.col === targetCol && u.hp > 0
                );
                console.log(remainingDefs);
                if (remainingDefs.length === 1) {
                    const remainingEl = document.querySelector(`[data-unit-id="${remainingDefs[0].id}"]`);
                    if (remainingEl) {
                        remainingEl.classList.remove("unit-case1", "unit-case2");
                    }
                }

                gameState.players[defender.player].units = enemyUnits.filter(u => u.hp > 0);
                attacker.hasActed = true;
                checkVictory();
            }
        } else {
            addToCombatLog(`💨${logPrefix} : Attaque échouée.`);
        }

        gameState.selectedUnit = null;
        gameState.selectedGroup = null;
        document.querySelectorAll('.unit-selected').forEach(el => {
            el.classList.remove('unit-selected');
        });
        clearHighlights();
        gameState.pendingCombat = null;
        gameState.diceResult = null;
        diceElement.textContent = '?';
        hideDiceRoller();

        const allActed = gameState.players[gameState.currentPlayer].units.every(u => u.hasActed || u.hp <= 0);
        if (allActed) {
            addToCombatLog("⌛Fin de la phase d'action. Cliquez sur 'Terminer le tour'.");
        }
    }


    function endTurn() {
        const player = gameState.players[gameState.currentPlayer];
        player.units.forEach(unit => {
            unit.hasMoved = false;
            unit.hasActed = false;
        });
        document.getElementById('unit-panel').style.display = 'none';
        document.getElementById('unit-panel2').style.display = 'none';
        gameState.selectedUnit = null;
        document.querySelectorAll('.unit-selected').forEach(el => {
                    el.classList.remove('unit-selected');
        });
        clearHighlights();
        gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
        updatePlayerDisplay();
        gameState.gamePhase = 'movement';
        gamePhaseDisplay.textContent = 'Phase de mouvement';
        document.getElementById("end-movement-btn").style.display = "inline-block";
        document.getElementById("end-movement-btn").disabled = false;
        gameState.turnCounter[gameState.currentPlayer] += 1;
        console.log(gameState.turnCounter[1]);
        console.log(gameState.turnCounter[2]);
        console.log(gameState.wallCollapseLevel);

        if (gameState.wallCollapseLevel === 0 && gameState.turnCounter[1] >= 5 && gameState.turnCounter[2] >= 5) {
            gameState.wallCollapseLevel = 1;
            activateWallCollapse(1);
        } else if (gameState.wallCollapseLevel === 1 && gameState.turnCounter[1] >= 10 && gameState.turnCounter[2] >= 10) {
            gameState.wallCollapseLevel = 2;
            activateWallCollapse(2);
        } else if (gameState.wallCollapseLevel === 2 && gameState.turnCounter[1] >= 15 && gameState.turnCounter[2] >= 15) {
            gameState.wallCollapseLevel = 3;
            activateWallCollapse(3);
        }
        updateWallTimer(); 

        addToCombatLog(`🔄Tour de ${gameState.players[gameState.currentPlayer].name}`);

    }

    function checkVictory() {
        const p1Alive = gameState.players[1].units.some(u => u.hp > 0);
        const p2Alive = gameState.players[2].units.some(u => u.hp > 0);

        if (!p1Alive || !p2Alive) {
            const winner = p1Alive ? 1 : 2;
            gameContainer.style.display = 'none';
            gameOverScreen.style.display = 'block';
            victoryMessage.textContent = 'Victoire !';
            winnerDisplay.textContent = `Félicitations ${gameState.players[winner].name} !`;
            const winnerImage = document.getElementById('winner-image');
            winnerImage.src = winner === 1 
                ? 'assets/victory/winners.png'  
                : 'assets/victory/winners2.png'; 
        }
    }

    function updatePlayerDisplay() {
        currentPlayerDisplay.textContent = gameState.players[gameState.currentPlayer].name;
    }

    const logContent = document.getElementById('combat-log');

    function addToCombatLog(msg) {
        const logContainer = document.getElementById('log-content');

        logContainer.querySelectorAll('.latest-entry').forEach(el => {
            el.classList.remove('latest-entry');
        });

        const entry = document.createElement('div');
        entry.textContent = msg;
        entry.classList.add('combat-entry', 'latest-entry');
        logContainer.appendChild(entry);

        logContent.scrollTop = logContent.scrollHeight;
    }


    function showDiceRoller() {
        document.getElementById('dice-roller').style.display = 'flex';
    }

    function hideDiceRoller() {
        document.getElementById('dice-roller').style.display = 'none';
    }
    function getNextUnitToPlace(player) {
        const placed = {
            guerrier: 0,
            archer: 0,
            mage: 0
        };
    
        for (const unit of player.units) {
            placed[unit.type]++;
        }
    
        const required = gameState.clans[player.clan].units;
    
        for (const type in required) {
            if (placed[type] < required[type]) {
                return type;
            }
        }
    
        return null; 
    }
    function renderUnit(unit) {
    const cell = document.querySelector(`.cell[data-row="${unit.row}"][data-col="${unit.col}"]`);
    if (!cell) return;

    const existingUnit = cell.querySelector(`[data-unit-id="${unit.id}"]`);
    if (existingUnit) cell.removeChild(existingUnit);

    const otherUnitsInCell = getAllUnits().filter(
        u => u.id !== unit.id && u.row === unit.row && u.col === unit.col
    );

    const unitElement = document.createElement('div');
    unitElement.className = `unit player${unit.player}`;
    unitElement.dataset.unitId = unit.id;

    const unitImage = gameState.unitTypes[unit.type][unit.player === 1 ? 'image' : 'image2'];

    if (otherUnitsInCell.length === 0) {
        unitElement.innerHTML = `
        <img src="${unitImage}" alt="${unit.type}">
        <div class="hp-bar1">
            <div class="hp-fill1" style="width: ${(unit.hp / gameState.unitTypes[unit.type].hp) * 100}%"></div>
        </div>
    `;
    } else if (otherUnitsInCell.length === 1) {
        const existingUnitData = otherUnitsInCell[0];
        document.querySelector(`[data-unit-id="${existingUnitData.id}"]`)?.classList.add("unit-case1");
        unitElement.innerHTML = `
        <img src="${unitImage}" alt="${unit.type}">
        <div class="hp-bar1">
            <div class="hp-fill1" style="width: ${(unit.hp / gameState.unitTypes[unit.type].hp) * 100}%"></div>
        </div>
    `;
    unitElement.classList.add("unit-case2");

    }

    cell.appendChild(unitElement);
}

    function areAllUnitsPlaced(player) {
        const requiredUnits = gameState.clans[player.clan].units;
    
        let totalRequired = 0;
        for (const type in requiredUnits) {
            totalRequired += requiredUnits[type];
        }
    
        return player.units.length >= totalRequired;
    }
    function findUnitAtPosition(row, col, units) {
        return units.find(unit => unit.row === row && unit.col === col);
    }
    function findUnitsAtPosition(row, col, units) {
    return units.filter(unit => unit.row === row && unit.col === col && unit.hp > 0);
    }
    
    function highlightMovementOptions(unit) {
    clearHighlights(); 

    const cell = document.querySelector(`.cell[data-row="${unit.row}"][data-col="${unit.col}"]`);
    if (cell) {
        cell.classList.add('highlight-move'); 
    }

    const directions = [
        [0, 1], 
        [1, 0],  
        [0, -1], 
        [-1, 0] 
    ];

    directions.forEach(([dx, dy]) => {
        const newRow = unit.row + dx;
        const newCol = unit.col + dy;

        if (newRow >= 1 && newRow <= gameState.boardSize && newCol >= 1 && newCol <= gameState.boardSize) {
            const targetCell = document.querySelector(`.cell[data-row="${newRow}"][data-col="${newCol}"]`);
            
            const unitsInCell = getAllUnits().filter(u => u.row === newRow && u.col === newCol);

            if (
                targetCell &&
                unitsInCell.length < 2 &&
                !unitsInCell.some(u => u.player !== unit.player)
            ) {
                targetCell.classList.add('highlight-move');
            }
        }
    });
}


    function clearHighlights() {
    const allCells = document.querySelectorAll('.cell');
    allCells.forEach(cell => {
        cell.classList.remove('highlight-move');
        cell.classList.remove('highlight-attack');
    });
}
function removeUnitFromBoard(unit) {
    const cell = document.querySelector(`.cell[data-row="${unit.row}"][data-col="${unit.col}"]`);
    if (!cell) return;

    const unitElement = cell.querySelector(`[data-unit-id="${unit.id}"]`);
    if (unitElement) {
        cell.removeChild(unitElement);
    }
}

function showUnitInfo(unit) {
    const unitData = gameState.unitTypes[unit.type];

    unitImage.src = unitData[unit.player === 1 ? 'image' : 'image2'];
    unitName.textContent = unitData.name;
    console.log(unitData.unitActions);

    unitAttack.textContent = unitData.attack;
    unitDefense.textContent = unitData.defense;
    unitRange.textContent = unitData.range;
    unitActions.textContent = unitData.unitActions;
    unitSpecial.textContent = unitData.special;
    unitSuperPower.textContent = unitData.superPower;
    document.getElementById('unit-panel').style.display = 'block';

    const hpPercent = (unit.hp / unit.maxHp) * 100;
    hpFill.style.width = `${hpPercent}%`;
    hpText.textContent = `${unit.hp} / ${unit.maxHp}`;
}
function showUnitInfo2(unit) {
    const unitData = gameState.unitTypes[unit.type];

    unitImage2.src = unitData[unit.player === 1 ? 'image' : 'image2'];
    unitName2.textContent = unitData.name;

    unitAttack2.textContent = unitData.attack;
    unitDefense2.textContent = unitData.defense;
    unitRange2.textContent = unitData.range;
    unitActions2.textContent = unitData.unitActions;
    unitSpecial2.textContent = unitData.special;
    unitSuperPower2.textContent = unitData.superPower;
    document.getElementById('unit-panel2').style.display = 'block';

    const hpPercent = (unit.hp / unit.maxHp) * 100;
    hpFill2.style.width = `${hpPercent}%`;
    hpText2.textContent = `${unit.hp} / ${unit.maxHp}`;
}
function highlightAttackOptions(unit) {
    document.querySelectorAll('.unit-selected').forEach(el => {
            el.classList.remove('unit-selected');
    });
    //clearHighlights();
    const range = gameState.unitTypes[unit.type].range;
    const enemyPlayerId = unit.player === 1 ? 2 : 1;
    const enemyUnits = gameState.players[enemyPlayerId].units;

    if (unit.type === "mage") {
        console.log("Mage selected at:", unit.row, unit.col, "range =", range);

        const primaryTarget = enemyUnits.find(enemy => {
            const verticalDistance = Math.abs(enemy.row - unit.row);
            const match = enemy.col === unit.col && verticalDistance <= range && enemy.hp > 0;
            console.log(`Checking enemy at (${enemy.row}, ${enemy.col}) → match?`, match);
            return match;
        });

        if (primaryTarget) {
            console.log("Primary target found at:", primaryTarget.row, primaryTarget.col);

            enemyUnits.forEach(enemy => {
                const verticalDistance = Math.abs(enemy.row - unit.row);
                const isInSameColumn = enemy.col === primaryTarget.col;
                const isInRange = verticalDistance <= range;
                const isAlive = enemy.hp > 0;

                console.log(`→ Enemy at (${enemy.row}, ${enemy.col}) | columnMatch: ${isInSameColumn}, inRange: ${isInRange}, alive: ${isAlive}`);

                if (isInSameColumn && isAlive) {
                    const cell = document.querySelector(`.cell[data-row="${enemy.row}"][data-col="${enemy.col}"]`);
                    if (cell) {
                        console.log("Highlighting cell:", enemy.row, enemy.col);
                        cell.classList.add("highlight-attack");
                    } else {
                        console.warn("Cell not found for:", enemy.row, enemy.col);
                    }
                }
            });
        } else {
            console.log("❌ No enemy found in column within range — no highlight.");
        }
    }  else {
        console.log('jina lena')
        for (let r = unit.row - range; r <= unit.row + range; r++) {
            for (let c = unit.col - range; c <= unit.col + range; c++) {
                const distance = Math.abs(unit.row - r) + Math.abs(unit.col - c);
                if (distance <= range && r >= 1 && r <= gameState.boardSize && c >= 1 && c <= gameState.boardSize) {
                    const target = findUnitAtPosition(r, c, enemyUnits);
                    if (target && target.hp > 0) {
                        const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
                        console.log(target);
                        console.log(cell);
                        if (cell) cell.classList.add("highlight-attack");
                    }
                }
            }
        }
    }
}
const endMovementBtn = document.getElementById("end-movement-btn");

endMovementBtn.addEventListener('click', () => {
    if (gameState.gamePhase === 'movement') {
        document.getElementById('unit-panel').style.display = 'none';
        document.getElementById('unit-panel2').style.display = 'none';
        gameState.gamePhase = 'action';
        gamePhaseDisplay.textContent = 'Phase d\'action';
        addToCombatLog('🛑Phase de mouvement terminée manuellement.');
        document.getElementById("end-movement-btn").style.display = "none";
        endMovementBtn.disabled = true;
        endTurnBtn.disabled = false;
        document.querySelectorAll('.unit-selected').forEach(el => {
                    el.classList.remove('unit-selected');
        });
        clearHighlights();
        gameState.selectedUnit = null;
    }
});
function resetGame() {
    const player1 = gameState.players[1];
    const player2 = gameState.players[2];

    gameState.currentPlayer = 1;
    gameState.gamePhase = null;
    gameState.players = {
        1: {
            name: player1.name,
            clan: player1.clan,
            avatar: player1.avatar,
            units: []
        },
        2: {
            name: player2.name,
            clan: player2.clan,
            avatar: player2.avatar,
            units: []
        }
    };
    gameState.selectedUnit = null;
    gameState.diceResult = null;
    gameState.combatLog = [];
    gameState.pendingCombat = null;
    gameState.players[1].startRoll=null;
    gameState.players[2].startRoll=null;

    document.getElementById('game-board').innerHTML = '';
    document.getElementById('log-content').innerHTML = '';
    document.getElementById('unit-panel').style.display = 'none';
    document.getElementById('unit-panel2').style.display = 'none';

    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('game-over-screen').style.display = 'none';

    document.getElementById('end-turn-btn').disabled = true;
    document.getElementById('end-movement-btn').style.display = 'none';
    document.getElementById('dice').textContent = '?';
    hideDiceRoller();

    document.getElementById('player1-display').textContent = player1.name;
    document.getElementById('player2-display').textContent = player2.name;
    document.getElementById('player1-clan').style.backgroundImage = `url(${player1.avatar})`;
    document.getElementById('player2-clan').style.backgroundImage = `url(${player2.avatar})`;
    gameState.wallCollapseLevel = 0;
    gameState.turnCounter = { 1: 0, 2: 0 };

    document.querySelectorAll('.cell.wall-zone').forEach(cell => {
        cell.classList.remove('wall-zone');
    });
  
    createGameBoard();
    const wallTimerDiv = document.getElementById("wall-timer");

    if (wallTimerDiv) {
        wallTimerDiv.innerHTML = `
            🧱 Prochaine réduction du terrain dans : <span id="wall-turns-left">5</span> tours
        `;
    }


    updateWallTimer();

    addToCombatLog('🔁 Le jeu a été réinitialisé.');

    startGame();
      
}
function playAgain() {
    location.reload(); 
}
function activateWallCollapse(level) {
    const affectedRows = {
        1: [1, 10],
        2: [2, 9],
        3: [3, 8]
    }[level];

    if (!affectedRows) return;

    addToCombatLog(`⚠️ Étape ${level} : Les lignes ${affectedRows[0]} et ${affectedRows[1]} deviennent mortelles !`);

    const allUnits = getAllUnits();

    allUnits.forEach(unit => {
        if (unit.row === affectedRows[0]) {
            removeUnitFromBoard(unit); 
            let newRow = affectedRows[0] + 1;
            while (newRow <= gameState.boardSize) {
                const unitsInTargetCell = getAllUnits().filter(u => u.row === newRow && u.col === unit.col);
                if (unitsInTargetCell.length < 2) break;
                newRow++;
            }

            unit.row = newRow;
            unit.hp -= 20;
            addToCombatLog(`💥 ${unit.type} en ligne ${affectedRows[0]} : -20 PV, déplacé en ligne ${unit.row}.`);
            if (unit.hp <= 0) {
                addToCombatLog(`💀${unit.type} est éliminé par le mur.`);
                removeUnitFromBoard(unit);
            } else {
                renderUnit(unit);
            }
        }

        if (unit.row === affectedRows[1]) {
            removeUnitFromBoard(unit);
            let newRow = affectedRows[1] - 1;
            while (newRow >= 1) {
                const unitsInTargetCell = getAllUnits().filter(u => u.row === newRow && u.col === unit.col);
                if (unitsInTargetCell.length < 2) break;
                newRow--;
            }

            unit.row = newRow;
            unit.hp -= 20;
            addToCombatLog(`💥 ${unit.type} en ligne ${affectedRows[1]} : -20 PV, déplacé en ligne ${unit.row}.`);
            if (unit.hp <= 0) {
                addToCombatLog(`💀${unit.type} est éliminé par le mur.`);
                removeUnitFromBoard(unit);
            } else {
                renderUnit(unit);
            }
        }
    });

    affectedRows.forEach(row => {
        document.querySelectorAll(`.cell[data-row="${row}"]`).forEach(cell => {
            cell.classList.add('wall-zone');
        });
    });

    gameState.players[1].units = gameState.players[1].units.filter(u => u.hp > 0);
    gameState.players[2].units = gameState.players[2].units.filter(u => u.hp > 0);

    checkVictory();
}
function updateWallTimer() {
    const level = gameState.wallCollapseLevel;
    const minTurn = Math.min(gameState.turnCounter[1], gameState.turnCounter[2]);

    const nextLevelThresholds = { 0: 5, 1: 10, 2: 15 };
    const nextThreshold = nextLevelThresholds[level];

    const turnsLeft = nextThreshold ? Math.max(0, nextThreshold - minTurn) : 0;

    const wallText = document.getElementById("wall-turns-left");
    const wallTimerDiv = document.getElementById("wall-timer");

    if (nextThreshold) {
        wallText.textContent = turnsLeft;
    } else {
        wallTimerDiv.innerHTML = "🧱 Toutes les zones sont désormais fermées.";
    }
}

    initGame();
});
