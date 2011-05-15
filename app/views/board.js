(function() {
  div({
    id: 'boardHeader'
  }, function() {
    h1(this.title);
    a({
      id: "newThreadButton",
      href: "#newThread"
    }, function() {
      return "New Thread";
    });
    return text(this.partial("partials/post-form", {
      as: 'form',
      object: {
        action: "/" + this.board + "/",
        submit: 'Create thread',
        id: 'newThread'
      }
    }));
  });
  div({
    id: 'threads'
  }, function() {
    var thread, _i, _len, _ref;
    _ref = this.threads;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      thread = _ref[_i];
      text(this.partial("partials/thread", {
        object: thread
      }));
    }
    if (this.total > this.threads.length) {
      return a({
        id: "loadMore",
        href: ("/" + this.board + "/?pages=") + (this.pages + 1) + "#thread-" + thread.id
      }, function() {
        return "Load more";
      });
    }
  });
}).call(this);
