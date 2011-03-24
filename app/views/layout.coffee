doctype 5
html ->
  head ->
    title @title
    link rel: "stylesheet", href: '/stylesheets/style.css'
    script src: '/scripts/modernizr-1.7.min.js'
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
          div -> @body
        section id: "detail", ->
          div -> h1 "Detail level goes here"
          
      footer ->
        "Oh, and this would be the footer."
          
