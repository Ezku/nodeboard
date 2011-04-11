section class: 'form', ->
  form method: 'post', action: "#{@form.action}", enctype: 'multipart/form-data', ->
    dl ->
      dt -> label for: 'content', -> 'Content'
      dd -> textarea name: 'content', id: 'content'
      
      dt -> label for: 'image', -> 'Image'
      dd -> input name: 'image', type: 'file', id: 'image', accept: 'image/gif,image/jpeg,image/png'
    
      dt -> label for: "password", -> "Password"
      dd -> input name: 'password', id: 'password', type: 'password'
    
      dt ->
      dd -> input name: 'submit', type: 'submit', value: @form.submit