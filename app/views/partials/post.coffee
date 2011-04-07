article class: 'post', id: 'post-' + @post.id, ->
  div class: 'meta', ->
    span @post.id, class: 'post-id'
    span @post.author, class: 'author'
    time @post.time, datetime: @post.time
  if @post.image
    div class: 'post-image', ->
      img src: @post.image.src, alt: ''
  div class: 'post-content', ->
    p @post.content