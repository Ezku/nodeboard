idPrefix = "" 
if @preview
  idPrefix = "preview-"
article class: 'post', id: 'post-' + idPrefix + @post.board + "-" + @post.id, ->
  
  if !@preview
    div class: 'controls', ->
      a "Reply", class: "reply", id: 'reply-'+@post.id
      a "Delete", class: "delete", id: 'delete-'+@post.id, href: "/" + @post.board + "/" + @post.id + "/"
  
  div class: 'meta', ->
    span "#" + @post.id, class: 'post-id'
    span (h @post.author), class: 'author'
    abbr @post.date.toString(), class: 'timeago', title: @post.date
  
  if @post.image
    if @jQtemplate
      text '{{if image }}{{if image.thumbnail }}'
    div class: 'post-image', ->
      a href: @post.image.fullsize, rel: @post.board+"-"+@post.thread, ->
        img src: @post.image.thumbnail, alt: "post-image"
    if @jQtemplate
      text '{{/if}}{{/if}}'
  
  div class: 'post-content', ->
    p h @post.content