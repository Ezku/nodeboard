article class: 'post', id: 'post-' + @post.id, ->
  div class: 'meta', ->
    span "#" + @post.id, class: 'post-id'
    span (h @post.author), class: 'author'
    time @post.date.toString(), datetime: @post.date
  
  if @post.image
    if @jQtemplate
      text '{{if image.thumbnail}}'
    div class: 'post-image', ->
      a href: "/" + @board + "/" + @post.image.fullsize, ->
        img src: "/" + @board + "/" + @post.image.thumbnail, alt: ''
    if @jQtemplate
      text '{{/if}}'
  
  div class: 'post-content', ->
    p h @post.content