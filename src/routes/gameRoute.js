const router = require('express').Router();
const gameController = require('../controller/game.controller');

router.get('/', gameController.getAllGameStartingMoves);
router.get('/:code', gameController.getChessMoveDetails);
router.get('/:code/*', gameController.getNextChessMoveByCode);

module.exports = router;