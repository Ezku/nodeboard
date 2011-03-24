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
              a href: "ak/", -> "AK"
            li ->
              a href: "as/", -> "AS"
            li ->
              a href: "bio/", -> "BIO"
            li ->
              a href: "fk/", -> "FK"
            li ->
              a href: "ik/", -> "IK"
            li ->
              a href: "inf/", -> "INF"
            li ->
              a href: "kik/", -> "KIK"
            li ->
              a href: "kk/", -> "KK"
            li ->
              a href: "pjk/", -> "PJK"  
            li ->
              a href: "tik/", -> "TIK"
            li ->
              a href: "vk/", -> "VK"
      div id: "column-wrapper", ->
        section id: "high-level", ->
          @body
        section id: "detail", ->
          ""
