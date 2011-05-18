doctype 5
html ->
  head ->
    title @title
    meta charset: "utf-8"
    link rel: "stylesheet", href: '/stylesheets/style.css'
    script src: '/scripts/modernizr-1.7.min.js'
    script src: '/scripts/jquery-1.5.2.min.js'
    script src: '/scripts/jquery.tmpl.min.js'
    script src: '/scripts/jquery.timeago.js'
    script src: '/socket.io/socket.io.js'
    script src: '/scripts/socket.io-channels-client.js'
    script src: '/scripts/aaltoboard.js'
    script src: '/scripts/fancybox/jquery.fancybox-1.3.4.pack.js'
    link rel: "stylesheet", href: '/scripts/fancybox/jquery.fancybox-1.3.4.css'
  body class: @class, id: @id, ->
    div id: "page-wrapper", ->
      header ->
        nav ->
          ul ->
            li class: "home", ->
              a href: "/", -> "Aaltoboard"
            
            for group, boards of @config.boards
              li ->
                ul class: "board-group", ->
                  li class: 'separator', -> '['
                  for label, properties of boards
                    li ->
                      a href: "/#{label}/", title: properties.name, -> label
                  li class: 'separator', -> ']'
          div style: "clear: both;"
      
      div id: "column-wrapper", -> @body

    script type: 'text/x-jquery-tmpl', id: 'threadTemplate', ->
      text @partial "thread", jQtemplate: true, title: '/${board}/${id}/', object: {id:'${id}'}
    
    script type: 'text/x-jquery-tmpl', id: 'postTemplate', ->
      text @partial "partials/post", jQtemplate: true, object: {id:'${id}',author:'${author}',date:'${date}', board: '${board}', thread: '${thread}', content:'${content}', image:{fullsize:'${image.fullsize}',thumbnail:'${image.thumbnail}'}}

    script type: 'text/x-jquery-tmpl', id: 'boardThreadTemplate', ->
      text @partial "partials/thread", jQtemplate: true, object: {id:'${id}', board: '${board}', replyCount:'${replyCount-1}'}
