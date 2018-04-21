window.onload = function() {
  //start connection
  let socket = io();

  //canvasApp
  let backend = document.getElementById('backend');
  let color = document.getElementById('color');
  let cur = document.getElementById('cur');
  let lineWidth = document.getElementById('lineWidth');
  let canvas = document.getElementById('c');
  let ctx = canvas.getContext('2d');

  let randR = Math.floor(100+Math.random()*155); 
  let randG = Math.floor(100+Math.random()*155); 
  let randB = Math.floor(100+Math.random()*155); 
  
  // 'rgb(' + rand + ', ' + rand + ', ' + rand +')';
  color.value = '#' + randR.toString(16) + randG.toString(16) + randB.toString(16);
  console.log(color.value);

  let width = canvas.width = window.innerWidth-30;
  let height = canvas.height = window.innerHeight-210;

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
    backend.innerText = 'Users Active : ' + data.active + ' | Users : ' + JSON.stringify(data.users);
  })


  //UPDATE CACHE // NO_CACHE
  let stylesheet = document.getElementsByTagName('link')[0];
  let scripts1 = document.getElementsByTagName('script')[1];
  let scripts2 = document.getElementsByTagName('script')[0];
  scripts1.src =  scripts1.getAttribute('src') + '?' + Math.floor(100*Math.random()*9999999999);
  scripts2.src =  scripts2.getAttribute('src') + '?' + Math.floor(100*Math.random()*9999999999);
  stylesheet.href = stylesheet.getAttribute('href') + '?' + Math.floor(100*Math.random()*9999999999);

}


