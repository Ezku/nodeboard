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
              a href: ".", -> "Aaltoboard"
            li ->
              a href: "ak/", -> "/ak/"
            li ->
              a href: "as/", -> "/as/"
            li ->
              a href: "bio/", -> "/bio/"
            li ->
              a href: "fk/", -> "/fk/"
            li ->
              a href: "ik/", -> "/ik/"
            li ->
              a href: "inf/", -> "/inf/"
            li ->
              a href: "kik/", -> "/kik/"
            li ->
              a href: "kk/", -> "/kk/"
            li ->
              a href: "pjk/", -> "/pjk/"  
            li ->
              a href: "tik/", -> "/tik/"
            li ->
              a href: "vk/", -> "/vk/"
      div id: "column-wrapper", ->
        section id: "high-level", ->
          div -> @body
        section id: "detail", ->
          div -> h1 "Detail level goes here"
          
      footer ->
        "Oh, and this would be the footer."
          
