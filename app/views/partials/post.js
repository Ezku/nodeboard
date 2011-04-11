(function() {
  article({
    "class": 'post',
    id: 'post-' + this.post.id
  }, function() {
    div({
      "class": 'meta'
    }, function() {
      span(this.post.id, {
        "class": 'post-id'
      });
      span(this.post.author, {
        "class": 'author'
      });
      return time(this.post.date.toString(), {
        datetime: this.post.date
      });
    });
    if (this.post.image) {
      div({
        "class": 'post-image'
      }, function() {
        return img({
          src: this.post.image.src,
          alt: ''
        });
      });
    }
    return div({
      "class": 'post-content'
    }, function() {
      return p(this.post.content);
    });
  });
}).call(this);
