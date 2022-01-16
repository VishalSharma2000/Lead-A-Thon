const request = require('request-promise');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');

const chessGameCache = new NodeCache({ stdTTL: 180 });
const { CHESS_MOVE_URL } = process.env;

const scrapeDataFromURL = async (url) => {
  const response = await request(url);
  const $ = cheerio.load(response);

  const allSteps = [];
  const allChessMoves = $('tbody tr');

  allChessMoves.each((index, chessMove) => {
    const moveCode = $(chessMove.firstChild).text();
    const moveName = $(chessMove.lastChild.firstChild.firstChild).text();
    let moveSteps = $(chessMove.lastChild.firstChild.lastChild).text();

    if (moveCode !== 'A00') {
      moveSteps = moveSteps.split(' ');
    }

    const chessMoveObj = {
      moveCode,
      moveName,
      moveSteps
    }

    allSteps.push(chessMoveObj);
  })

  // console.log(allSteps);

  return allSteps;
};

const getAllChessGames = async () => {
  let allChessStartingGames;
  
  if(chessGameCache.has('allChessStartingGames')) {
    allChessStartingGames = chessGameCache.get('allChessStartingGames');
  } else {
    allChessStartingGames = await scrapeDataFromURL(CHESS_MOVE_URL);

    chessGameCache.set('allChessStartingGames', allChessStartingGames);
  }

  return allChessStartingGames;
}

const getValidSeqMoves = (completeMoves) => {
  let moves = completeMoves.filter(move => isNaN(move));
};

module.exports = {
  scrapeDataFromURL,
  getValidSeqMoves,
  getAllChessGames
}