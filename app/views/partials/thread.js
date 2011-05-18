(function() {
  section({
    "class": 'thread-preview',
    id: "thread-preview-" + this.thread.id
  }, function() {
    if (this.thread.firstPost) {
      this.thread.firstPost.board = this.thread.board;
      this.thread.firstPost.thread = this.thread.id;
      text(this.partial("partials/post", {
        object: this.thread.firstPost,
        preview: true
      }));
    }
    if (this.jQtemplate) {
      text('{{tmpl(firstPost) "#postTemplate"}}');
    }
    if (this.thread.replyCount > 1 || this.jQtemplate) {
      if (this.jQtemplate) {
        text('{{if replyCount > 1 }}');
      }
      p({
        "class": "omitted"
      }, function() {
        if (this.jQtemplate) {
          text(this.thread.replyCount);
        } else {
          text(this.thread.replyCount - 1);
        }
        return text(" messages omitted.");
      });
      if (this.jQtemplate) {
        text('{{/if}}');
      }
    }
    if (this.thread.lastPost) {
      this.thread.lastPost.board = this.thread.board;
      this.thread.lastPost.thread = this.thread.id;
      text(this.partial("partials/post", {
        object: this.thread.lastPost
      }));
    }
    if (this.jQtemplate) {
      text('{{if lastPost }}{{tmpl(lastPost) "#postTemplate"}}{{/if}}');
    }
    return a({
      href: "/" + this.thread.board + "/" + this.thread.id + "/",
      "class": "threadLink"
    }, function() {
      return "Open thread";
    });
  });
}).call(this);
