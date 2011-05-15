(function() {
  h1("Statistics");
  section({
    "class": 'statistics'
  }, function() {
    return dl(function() {
      var statistic, value, _ref, _results;
      _ref = this.stats;
      _results = [];
      for (statistic in _ref) {
        value = _ref[statistic];
        dt(statistic);
        _results.push(dd(value));
      }
      return _results;
    });
  });
}).call(this);
