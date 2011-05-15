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
    #script src: '/scripts/browserify.js'
    script src: '/scripts/aaltoboard.js'
  body class: @class, id: @id, ->
    div id: "page-wrapper", ->
      header ->
        nav ->
          ul ->
            li class: "home", ->
              a href: "/", -> "Aaltoboard"
            
            for group, boards of @config.boards
              ul class: "board-group", ->
                li class: 'separator', -> '['
                for label, properties of boards
                  li ->
                    a href: "/#{label}/", title: properties.name, -> label
                li class: 'separator', -> ']'
          div style: "clear: both;"
      
      div id: "column-wrapper", -> @body

    script type: 'text/x-jquery-tmpl', id: 'threadTemplate', ->
      text @partial "thread", title: '/${board}/${id}', object: {id:'${id}'}
    
    script type: 'text/x-jquery-tmpl', id: 'postTemplate', ->
      text @partial "partials/post", jQtemplate: true, object: {id:'${id}',author:'${author}',date:'${date}', content:'${content}', image:{fullsize:'${image.fullsize}',thumbnail:'${image.thumbnail}'}}
