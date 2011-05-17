div class: 'form', id: @form.id, ->
  
  if @form.title
    h4 @form.title
  
  form method: 'post', id: @form.id+'Form', action: "#{@form.action}", enctype: 'multipart/form-data', ->
    dl ->
      dt -> label for: 'content', -> 
        text 'Content'
        span " *", title: "Mandatory field"
      dd -> textarea name: 'content', id: 'content'
      
      dt -> label for: 'image', -> 
        text 'Image'
        if @form.id == "newThread"
          span " *", title: "Mandatory field"
      dd -> input name: 'image', type: 'file', id: 'image', accept: 'image/gif,image/jpeg,image/png'
    
      dt -> label for: "password", -> "Password"
      dd -> input name: 'password', id: 'password', type: 'password'
    
      dt ->
      dd -> input name: 'submit', type: 'submit', value: @form.submit
  
  div style: 'clear:both'