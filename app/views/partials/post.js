(function() {
  article({
    "class": 'post',
    id: 'post-' + this.post.id
  }, function() {
    div({
      "class": 'meta'
    }, function() {
      span("#" + this.post.id, {
        "class": 'post-id'
      });
      span(h(this.post.author), {
        "class": 'author'
      });
      return time(this.post.date.toString(), {
        datetime: this.post.date
      });
    });
    if (this.post.image) {
      if (this.jQtemplate) {
        text('{{if image && image.thumbnail }}');
      }
      div({
        "class": 'post-image'
      }, function() {
        return a({
          href: "/" + this.board + "/" + this.post.image.fullsize
        }, function() {
          return img({
            src: "/" + this.board + "/" + this.post.image.thumbnail,
            alt: ''
          });
        });
      });
      if (this.jQtemplate) {
        text('{{/if}}');
      }
    }
    return div({
      "class": 'post-content'
    }, function() {
      return p(h(this.post.content));
    });
  });
}).call(this);
