let socket = io.connect(); 
socket.on('products', function(data) { 
  console.log(data);
  render(data);
});

socket.on('messages', function(data) { 
  console.log(data);
  renderMessages(data);
});

function render(data) { 
    let html = `<tr>
          <th>Name</th>
          <th>Price</th>
          <th>Thumbnails</th>
      </tr>`
    
      html += data.map(function(elem, index){ 
      return(`
      <tr>
          <td>${elem.title}</td>
          <td>$ ${elem.price}</td>
          <td><img  src=${elem.thumbnail} alt="not found"></td>
      </tr>`) 
    }).join(" "); 
    document.getElementById('products').innerHTML = html; 
}

function addProduct() { 
    let product = { 
      title: document.getElementById('title').value, 
      price: document.getElementById('price').value,
      thumbnails: document.getElementById('thumbnails').value
    }; 
    socket.emit('new-product', product); 

    document.getElementById('title').value = '';
    document.getElementById('price').value = '';
    document.getElementById('thumbnail').value = '';
    document.getElementById('title').focus();

    return;
}


function renderMessages(data) { 
    // let html = data.map(function(elem, index){
    //   return(`<div>
    //         <span class="text-primary"><strong>${elem.text}</strong></span>:
    //         <span class="text-muted">${elem.author.id}</span>
    //         <span class="text-success"><em>${elem.author.name}</em></span>
    //         <span class="text-success"><em>${elem.author.lastname}</em></span>
    //         <span class="text-success"><em>${elem.author.age}</em></span>
    //         <span class="text-success"><em>${elem.author.alias}</em></span>
    //         <span class="text-success"><em>${elem.author.avatar}</em></span>
    //         </div>`)
    // }).join(" ");
    // document.getElementById('messages').innerHTML = html;
}

function addMessage() { 
    let message = {
      text: document.getElementById('message').value,
        author: {
            email: document.getElementById('email').value,
            name: 'test',
            lastname: 'test',
            age: 22,
            alias: 'testing',
            avatar: 'avatar'
        }
    }; 
    console.log(message);
    socket.emit('new-message', message); 

    document.getElementById('message').value = '';

    return;
}

function getDateStamp() {
    let current_datetime = new Date()
    return current_datetime.getDate() + "/" + (current_datetime.getMonth() + 1) + "/" +  current_datetime.getFullYear() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds()
}