article class: 'post', id: 'post-' + @post.id, ->
  div class: 'meta', ->
    span @post.id, class: 'post-id'
    span @post.author, class: 'author'
    time @post.date.toString(), datetime: @post.date
  if @post.image
    div class: 'post-image', ->
      a href: "/" + @board + "/" + @post.image.fullsize, ->
        img src: "/" + @board + "/" + @post.image.thumbnail, alt: ''
  div class: 'post-content', ->
    p @post.content