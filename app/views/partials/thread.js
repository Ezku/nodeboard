(function() {
  section({
    "class": 'thread thread-#{@thread.id}'
  }, function() {
    return a({
      href: "/" + this.board + "/" + this.thread.id + "/",
      "class": "threadLink"
    }, function() {
      text(this.partial("partials/post", {
        object: this.thread.firstPost
      }));
      if (this.thread.replyCount > 1) {
        p({
          "class": "omitted"
        }, function() {
          return this.thread.replyCount - 1 + " messages omitted.";
        });
      }
      if (this.thread.lastPost) {
        return text(this.partial("partials/post", {
          object: this.thread.lastPost
        }));
      }
    });
  });
}).call(this);
