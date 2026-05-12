<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIABLO TENNIS CLUB</title>
  <link rel="stylesheet" href="style.css">
</head>

<body>

<h1>DIABLO TENNIS CLUB</h1>

<h2>PLAYER (<span id="count">0</span>)</h2>
<div id="playerList"></div>

<h2>FIXED PAIR</h2>

<div class="pairBox">
  <select id="p1"></select>
  <select id="p2"></select>
  <div id="addPair" class="player guest">+</div>
</div>

<div id="pairList"></div>

<h2>GAME</h2>
<div class="btnRow">
  <button class="genBtn" data-set="1">1</button>
  <button class="genBtn" data-set="2">2</button>
  <button class="genBtn" data-set="3">3</button>
  <button class="genBtn" data-set="4">4</button>
  <button class="genBtn" data-set="5">5</button>
</div>

<h2>RESULT</h2>
<div id="result"></div>

<script src="script.js"></script>
</body>
</html>