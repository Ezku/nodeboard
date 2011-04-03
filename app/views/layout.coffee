doctype 5
html ->
  head ->
    title @title
    meta charset: "utf8"
    link rel: "stylesheet", href: '/stylesheets/style.css'
    script src: '/scripts/modernizr-1.7.min.js'
    script src: '/scripts/browserify.js'
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
            
      div id: "column-wrapper", ->
        section id: "high-level", ->
          h1 @title
          div -> @body
        section id: "detail", ->
          h1 "Detail level goes here"
          div -> "The content is vastly abundant."
          
      footer ->
        "Oh, and this would be the footer."
          
