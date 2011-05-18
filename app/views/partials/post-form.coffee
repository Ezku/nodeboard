div class: 'form', id: @form.id, ->
  
  if @form.title
    h4 @form.title
  
  form method: 'post', id: @form.id+'Form', action: "#{@form.action}", enctype: 'multipart/form-data', ->
    dl ->
      dt -> label for: @form.id+'Content', -> 
        text 'Content'
        span " *", title: "Mandatory field"
      dd -> textarea name: 'content', id: @form.id+'Content'
      
      dt -> label for: @form.id+'Image', -> 
        text 'Image'
        if @form.id == "newThread"
          span " *", title: "Mandatory field"
      dd -> input name: 'image', type: 'file', id: @form.id+'Image', accept: 'image/gif,image/jpeg,image/png'
    
      dt -> label for: @form.id+"Password", -> "Password"
      dd -> input name: 'password', id: @form.id+'Password', type: 'password'
    
      dt ->
      dd -> input name: 'submit', type: 'submit', value: @form.submit
  
  div style: 'clear:both'