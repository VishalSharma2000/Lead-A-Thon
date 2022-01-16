const gameStore = require('../store/game');
const response = require('../utils/response');

const {
  CHESS_MOVE_URL
} = process.env;

const getAllGameStartingMoves = async (req, res) => {
  const allChessStartingGames = await gameStore.getAllChessGames();

  return response.success(res, allChessStartingGames);
};

const getChessMoveDetails = async (req, res) => {
  const { code } = req.params;
  const allChessStartingGames = await gameStore.getAllChessGames();

  let details = allChessStartingGames.find((chessMove) => chessMove.moveCode === code);
  details.moveSteps = details.moveSteps.join(' ');

  response.success(res, details);
};

const getNextChessMoveByCode = async (req, res) => {
  const { code } = req.params;
  const allChessStartingGames = await gameStore.getAllChessGames();

  let details = allChessStartingGames.find((chessMove) => chessMove.moveCode === code);
  if(!details) {
    response.clientError(res, "Invalid Chess Code");
  }

  const userMoves = req.url.split('/');
  userMoves.shift();
  userMoves.shift();
  
  const validSeqMoves = details.moveSteps.filter(move => isNaN(move));

  // console.log(userMoves);
  // console.log(validSeqMoves);

  const isValidMoves = userMoves.every((move, index) => {
    move = String(move);
    return move === validSeqMoves[index];
  });

  if(!isValidMoves) {
    return response.clientError(res, "Invalid Moves as per the Code");
  }

  if(userMoves.length === validSeqMoves.length) {
    response.success(res, "Game Over, No further moves");
  } else {
    response.success(res, validSeqMoves[userMoves.length]);
  }
}

module.exports = {
  getAllGameStartingMoves,
  getChessMoveDetails,
  getNextChessMoveByCode
}