(function() {
  console.log(this.overview);
  div({
    id: "high-level"
  }, function() {
    if (this.overview) {
      return h1(this.overview.title);
      /*
      div ->
        text @partial @overview.view, object: @overview
        */
    }
  });
  /*
  div id: "detail", ->
    if @detail
      h1 @detail.title if @detail.title
      div ->
        text @partial @detail.view, object: @detail
  */
}).call(this);
