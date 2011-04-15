doctype 5
html ->
  head ->
    title @title
    meta charset: "utf8"
    link rel: "stylesheet", href: '/stylesheets/style.css'
    script src: '/scripts/modernizr-1.7.min.js'
    script src: '/scripts/jquery-1.5.2.min.js'
    script src: '/scripts/aaltoboard.js'
  body ->
    div id: "page-wrapper", ->
      header ->
        nav ->
          ul ->
            li ->
              a href: "/", -> "Aaltoboard"
            
            for label, properties of @config.boards.guilds
              li ->
                a href: "/#{label}/", title: properties.name, -> label
      
      div id: "column-wrapper", -> @body
          
      footer ->
        "Oh, and this would be the footer."
          
