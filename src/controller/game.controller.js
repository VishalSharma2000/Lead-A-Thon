const gameStore = require('../store/game');
const response = require('../utils/response');

const getAllGameStartingMoves = async (req, res) => {
  try {
    const allChessStartingGames = await gameStore.getAllChessGames();

    return response.success(res, allChessStartingGames);
  } catch (err) {
    response.serverError(res, "Something went wrong");
  }
};

const getChessMoveDetails = async (req, res) => {
  const { code } = req.params;
  try {
    let details = await gameStore.getChessMoveDetailsByCode(code);
    if (!details) {
      response.clientError(res, "Invalid Chess Code");
    }

    details.moveSteps = details.moveSteps.join(' ');

    response.success(res, details);
  } catch (err) {
    console.log(err);
    response.serverError(res, "Something went wrong");
  }
};

const getNextChessMoveByCode = async (req, res) => {
  const { code } = req.params;

  if (code === 'A00') {
    return response.success(res, { 'nextMove': "Unexpected, because it's uncommon opening"});
  }

  try {
    let details = await gameStore.getChessMoveDetailsByCode(code);
    if (!details) {
      response.clientError(res, "Invalid Chess Code");
    }

    const userMoves = req.url.split('/');
    userMoves.shift();
    userMoves.shift();

    const validSeqMoves = details.moveSteps.filter(move => isNaN(move));

    const isValidMoves = userMoves.every((move, index) => {
      move = String(move);
      return move === validSeqMoves[index];
    });

    if (!isValidMoves) {
      return response.clientError(res, "Invalid Moves as per the Code");
    }

    if (userMoves.length === validSeqMoves.length) {
      response.success(res, { 'nextMove': "Game Over, No further moves" });
    } else {
      response.success(res, { 'nextMove': validSeqMoves[userMoves.length] });
    }
  } catch (err) {
    response.serverError(res, "Something went wrong");
  }
}

module.exports = {
  getAllGameStartingMoves,
  getChessMoveDetails,
  getNextChessMoveByCode
}