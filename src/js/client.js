window.onload = function() {
  //start connection
  let socket = io();

  //canvasApp
  let backend = document.getElementById('backend');
  let color = document.getElementById('color');
  let handle = document.getElementsByClassName('handle')[0];
  let sidechat = document.getElementsByClassName('sidechat')[0];
  let lineWidth = document.getElementById('lineWidth');
  let canvasContainer = document.getElementsByClassName('canvas-container')[0]
  let canvas = document.getElementById('c');

  let chat_msg = document.getElementById('chat_msg');
  let msg_panel = document.getElementById('msg-panel');
  let send = document.getElementById('send');

  send.addEventListener('click', function() {
    if (chat_msg.value !== '') {
      socket.emit('msg', chat_msg.value);
      msg_panel.innerHTML += '<p>'+chat_msg.value+'</p>';
    }
  })
  
  handle.onclick = function() {
    sidechat.classList.toggle('show-panel');
  }

  let ctx = canvas.getContext('2d');

  let randR = Math.floor(100+Math.random()*155); 
  let randG = Math.floor(100+Math.random()*155); 
  let randB = Math.floor(100+Math.random()*155); 
  
  // 'rgb(' + rand + ', ' + rand + ', ' + rand +')';
  color.value = '#' + randR.toString(16) + randG.toString(16) + randB.toString(16);
  console.log(color.value);

  let width = canvas.width = window.innerWidth-30;
  let height = canvas.height = window.innerHeight-210;
  canvasContainer.style.width = width + 'px';
  canvasContainer.style.height = height + 'px';


  function draw(coords) {
    ctx.beginPath();
    ctx.strokeStyle = coords.color;
    ctx.lineWidth = coords.lineWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.moveTo(coords.x,coords.y);
    ctx.lineTo(coords.lastX,coords.lastY);
    ctx.stroke();    
    ctx.closePath();
  }

  let coords = {};
  let isDown = false;
  canvas.addEventListener('mousedown', function(e) {
    isDown = true;
    coords.lastX = e.offsetX;
    coords.lastY = e.offsetY;
  })
  canvas.addEventListener('mouseup', function(e) {
    isDown = false;
  });


  let cBounds = canvas.getBoundingClientRect();
  function moveAndDraw(e, isMobile) {
    if (!isDown) return;

    coords.x = e.offsetX || (e.touches[0].clientX - cBounds.x);
    coords.y = e.offsetY || (e.touches[0].clientY - cBounds.y);

    coords.color = color.value;
    coords.lineWidth = parseInt(lineWidth.value);
    
    draw(coords);
    
    socket.emit('mouse', coords );
    socket.on('backend_mouse', function(data) {
      draw(data);
    });

    if(isMobile) {
      coords.lastX = coords.x;
      coords.lastY = coords.y;
    }
    coords.lastX = coords.x;
    coords.lastY = coords.y;
    
  }

  canvas.addEventListener('mousemove', moveAndDraw);
  canvas.addEventListener('touchstart', function(e) {
    coords.lastX = e.offsetX;
    coords.lastY = e.offsetY;
  });
  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    isDown = true;
    moveAndDraw(e, true);
  });

  socket.on('stats', function(data) {
    backend.innerText = 'Users Active : ' + data.active;
  })
  
  socket.on('backend_msg', function(data) {
    msg_panel.innerHTML += '<p>'+data+'</p>';
  })


  //UPDATE CACHE // NO_CACHE
  let randCache = Math.floor(100*Math.random()*9999999999);
  let stylesheet = document.getElementsByTagName('link')[0];
  let scripts1 = document.getElementsByTagName('script')[1];
  let scripts2 = document.getElementsByTagName('script')[0];

  scripts1.src = scripts1.getAttribute('src') + '?' + randCache;
  scripts2.src = scripts2.getAttribute('src') + '?' + randCache;
  stylesheet.setAttribute('href',stylesheet.getAttribute('href') + '?' + randCache); 
  console.log(stylesheet)
}


