var Leagueofrecords = function(server, apiKey) {
  this.apiKey = apiKey;
  this.interval = 1.4;
  this.server = server;
  this.endpoints = {
    br: 'br1.api.riotgames.com',
    eune: 'eun1.api.riotgames.com',
    euw: 'euw1.api.riotgames.com',
    jp: 'jp1.api.riotgames.com',
    kr: 'kr.api.riotgames.com',
    lan: 'la1.api.riotgames.com',
    las: 'la2.api.riotgames.com',
    na: 'na1.api.riotgames.com',
    oce: 'oc1.api.riotgames.com',
    tr: 'tr1.api.riotgames.com',
    ru: 'ru.api.riotgames.com',
    pbe: 'pbe1.api.riotgames.com'
  };
}

Leagueofrecords.prototype.request = function(path) {
  var host = 'https://' + this.endpoints[this.server];
  var url = host + path + '?api_key=' + this.apiKey;
  var response = UrlFetchApp.fetch(url);
  return JSON.parse(response.getContentText())
}

Leagueofrecords.prototype.getChallengerList = function() {
  return this.request('/lol/league/v3/challengerleagues/by-queue/RANKED_SOLO_5x5');
}

Leagueofrecords.prototype.getMasterList = function() {
  return this.request('/lol/league/v3/masterleagues/by-queue/RANKED_SOLO_5x5');
}

Leagueofrecords.prototype.sortByLp = function(entries) {
  return entries.sort(function(a, b) {
    if (a.leaguePoints > b.leaguePoints) {
      return -1;
    }
    if (b.leaguePoints > a.leaguePoints) {
      return 1;
    }
    return 0;
  });
}

Leagueofrecords.prototype.createTable = function(league, startRank, type) {
  if (! startRank) { startRank = 1; }
  if (! type) { type = 'Summoner'; }

  var header = [
    '<table class="table table-bordered table-striped table-condensed">',
      '<caption>',
        league.queue + ' ' + league.tier + ' ' +  league.name,
      '</caption>',
      '<thead>',
        '<tr>',
          '<th>RANK</th>',
          '<th>LP</th>',
          '<th>' + type + ' ' + 'Id</th>',
          '<th>' + type + ' ' + 'Name</th>',
        '</tr>',
      '</thead>',
      '<tbody>'
  ].join('');

  var players = this.sortByLp(league.entries);
  var body = [];
  for (var i = 0; i < players.length; i++) {
    body.push([
        '<tr>',
          '<td>' + startRank.toString() + '</td>',
          '<td>' + players[i].leaguePoints + '</td>',
          '<td>' + players[i].playerOrTeamId + '</td>',
          '<td>' + players[i].playerOrTeamName + '</td>',
        '</tr>'
    ].join(''));
    startRank++;
  }

  var footer = '</tbody></table>';

  return [header, body.join(''), footer].join('');
}

Leagueofrecords.prototype.createTitle = function() {
  var createDate = function() {
    var paddingZero = function(num) {
      var res = ('00' + num.toString()).slice(-2);
      if (res === '0' ) { return '00'; }
      return res;
    }
    var d = new Date();
    var year = d.getFullYear().toString();
    var month = paddingZero(d.getMonth() + 1);
    var date = paddingZero(d.getDate());
    return year + '/' + month + '/' + date;
  }

  return this.server.toUpperCase() + ' SOLO QUEUE CHALLENGER MASTER LIST(' + createDate() + ')';
}

Leagueofrecords.prototype.createCategory = function() {
  return this.server.toUpperCase() + ' SOLO QUEUE CHALLENGER MASTER LIST';
}

Leagueofrecords.prototype.createEntryFormat = function(body) {
  return {
    title: this.createTitle(),
    body: body,
    more: '',
    category: this.createCategory()
  };
}

Leagueofrecords.prototype.create = function() {
  var challengerLeague = this.getChallengerList();
  var masterLeague = this.getMasterList();

  var body = [];
  body.push(this.createTable(challengerLeague));
  body.push(this.createTable(masterLeague, 200));

  return this.createEntryFormat(body.join(''));
}
