div class: 'index', ->

  div class: 'columnHeader', ->
    h1 @title

  div class: 'columnContent', ->
    for category, boards of @config.boards
      h2 category
  
      for label, properties of boards
        article class: "board #{category}", ->
          a href: "/#{label}/", title: properties.name, -> 
            h3 label.toUpperCase() 
            p properties.name
