(function () {
  //preliminary setup
  const canvas = document.querySelector('#canvas');
  canvas.height = (window.innerHeight);
  canvas.width = document.body.offsetWidth;
  const ctx = canvas.getContext('2d');
  function random (max) {
    return Math.floor(Math.random() * max)
  }
  setInterval(() => {
    document.querySelector('canvas').style.transition = 'background 5000ms ease-in'
    document.querySelector('canvas').style.background = `rgba(${random(255)},${random(255)},${random(255)},${Math.random()})`
  }, 10000)


  class Mouse {
    constructor() {
      this.x = undefined;
      this.y = undefined;
    }
    moved () {
      window.addEventListener('mousemove', e => {
        this.x = e.x;
        this.y = e.y;
      });
      window.addEventListener('mouseleave', e => {
        return;
      })
    }
  }

  const mouse = new Mouse();

  class Circle {
    constructor() {
      this.coordX = Math.max(60, random(canvas.width - 10));
      this.coordY = Math.max(60, random(canvas.height - 10));
      this.radius = Math.max(10, random(25));
      this.start = 0;
      this.end = Math.PI * 2;
      this.dx = random(Math.max(2, random(3)));
      this.dy = random(Math.max(2, random(3)));
      this.color = `rgba(${random(255)},${random(255)},${random(255)},${Math.max(0.7, Math.random())})`;
      mouse.moved()

    }
    draw () {
      ctx.fillStyle = this.color;
      ctx.beginPath()
      ctx.arc(this.coordX, this.coordY, this.radius, this.start, this.end);
      ctx.fill();
    }
    update () {
      this.draw();
      if (this.coordX + this.radius > canvas.width || this.coordX - this.radius < 0) {
        this.dx = -this.dx
      }
      if (this.coordY + this.radius > canvas.height || this.coordY - this.radius < 0) {
        this.dy = -this.dy
      }
      this.coordX += this.dx
      this.coordY += this.dy


      if (mouse.x - this.coordX < 50 && mouse.x - this.coordX > -50
        && mouse.y - this.coordY < 50 && mouse.y - this.coordY > -50) {
        if (this.radius < 150) this.radius += 5
      } else if (this.radius >= 25) {
        this.radius -= 1;
      }

    }
  }


  let circles = []
  for (var i = 0; i < 1500; i++) {
    circles.push(new Circle())
  }


  animate()
  function animate () {

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    requestAnimationFrame(animate);
    circles.forEach(circle => {
      circle.update();

    })
  }

  window.addEventListener('resize', function () {
    canvas.height = (window.innerHeight);
    canvas.width = document.body.offsetWidth;
  })
}());


(function () {
  window.addEventListener('resize', getWeather)
  getWeather()

  function getWeather () {
    fetch('http://ip-api.com/json')
      .then(blob => blob.json())
      .then(data => {
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=a9ccbff347e72cd2c8fd7d61d5eabc27&units=metric`)
          .then(blob => blob.json())
          .then(data => {
            const weather = new handleWeather(data);
            weather.getGif()
          });
      })


  }



  class handleWeather {
    constructor(response) {
      this.description = response.weather[0].description
      this.temparature = response.main.temp
      this.icon = `http://openweathermap.org/img/w/${response.weather[0].icon}.png`
      console.log(response)
    }

    getGif () {
      fetch(`http://api.giphy.com/v1/gifs/search?tag=sky&q=${this.description.split(' ')[1]}&api_key=dc6zaTOxFJmzC`)
        .then(blob => blob.json())
        .then(response => {
          const index = Math.floor(Math.random() * 25)
          this.makeMeme(response.data[index].images.original)
        })
    }

    makeMeme ({ url, height, width }) {
      const content = document.querySelector('.content');
      const top = content.querySelector('.top');
      const center = content.querySelector('.center');
      const bottom = content.querySelector('.bottom')
      content.style.background = `url(${url})`;
      content.style.backgroundSize = `cover`;
      content.style.width = width + 'px';
      content.style.height = height + 'px';
      content.style.maxWidth = '100vw';
      content.style.maxHeight = '100vh';
      content.style.fontSize = width / 10 + 'px'
      content.style.left = ((document.body.offsetWidth / 2) - (width / 2)) + 'px';
      content.style.top = ((document.body.offsetHeight / 2) - (height / 2)) + 'px'
      top.innerHTML = this.temparature + '°C';
      bottom.innerHTML = this.description;
      center.innerHTML = `<img src='${this.icon}' width='100px'></img>`
      console.log(content.style.left)
    }
  }


}())
