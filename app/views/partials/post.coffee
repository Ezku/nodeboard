article class: 'post', id: 'post-' + @post.id, ->
  
  div class: 'controls', ->
    a "Reply", class: "reply", id: 'reply-'+@post.id
    a "Delete", class: "delete", id: 'delete-'+@post.id, href: "/" + @post.board + "/" + @post.id + "/"
  
  div class: 'meta', ->
    span "#" + @post.id, class: 'post-id'
    span (h @post.author), class: 'author'
    time @post.date.toString(), datetime: @post.date
  
  if @post.image
    if @jQtemplate
      text '{{if image }}{{if image.thumbnail }}'
    div class: 'post-image', ->
      a href: "/" + @post.board + "/" + @post.image.fullsize, rel: @post.board+"-"+@post.thread, title: @post.content, ->
        img src: "/" + @post.board + "/" + @post.image.thumbnail, alt: "post-image"
    if @jQtemplate
      text '{{/if}}{{/if}}'
  
  div class: 'post-content', ->
    p h @post.content