// QUnit: MxL38OxqIK-B73jyDTvCe-OBao7QLBR4j

function testRiotAPI() {
  module('RiotAPI', {
    setup: function () {
      records = new Leagueofrecords('kr', '');
    }
  });

  test('getChallengerList', function() {
    var result = records.getChallengerList();
    strictEqual(typeof result, 'object');
    strictEqual(result.entries.length, 200);
  });

  test('getMasterList', function() {
    var result = records.getChallengerList();
    strictEqual(typeof result, 'object');
    ok(result.entries.length > 0);
  });

  test('sortByLp', function() {
    var entries = [
      { leaguePoints: 200 },
      { leaguePoints: 100 },
      { leaguePoints: 300 }
    ];
    var result = records.sortByLp(entries);
    Logger.log(result);

    strictEqual(result[0].leaguePoints, 300 );
    strictEqual(result[1].leaguePoints, 200 );
    strictEqual(result[2].leaguePoints, 100 );
  });
}

function testCreateEntry() {
  module('CreateEntry', {
    setup: function () {
      records = new Leagueofrecords('kr', '');
    }
  });

  test('createTable', function() {
    ok(true);
  });

  test('createTitle', function() {
    ok(records.createTitle().match(
      new RegExp(".. SOLO QUEUE CHALLENGER MASTER LIST\\([0-9]{4}\\/[0-9]{2}\\/[0-9]{2}\\)")
    ), records.createTitle());
  });

  test('createCategory', function() {
    ok(records.createCategory().match(/.. SOLO QUEUE CHALLENGER MASTER LIST/));
  });

  test('createEntyFormat', function() {
    var entry = records.createEntryFormat('test');
    strictEqual(typeof entry.title, 'string');
    strictEqual(typeof entry.body, 'string');
    strictEqual(typeof entry.more, 'string');
    strictEqual(typeof entry.category, 'string');
  });

  test('create', function() {
    var entry = records.create();
    strictEqual(typeof entry.title, 'string');
    strictEqual(typeof entry.body, 'string');
    strictEqual(typeof entry.more, 'string');
    strictEqual(typeof entry.category, 'string');
  });
}

function loadTests() {
  testRiotAPI();
  testCreateEntry();
}

function doGet(e) {
  QUnit.urlParams(e.parameter);
  QUnit.config({ title: 'Unit tests: League of Records' });
  QUnit.load(loadTests);
  return QUnit.getHtml();
};

QUnit.helpers(this);
