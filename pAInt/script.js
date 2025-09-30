gsap.set("#car", {opacity:1, xPercent:-100})

//on load figure out how far the car has to move
//and how many times the wheels need to spin


const speed = 350 //pixels per second
const carWidth = 520
const circumference = document.querySelector("#wheel1").getBBox().width * Math.PI

let carTl = gsap.timeline()
let mainTl = gsap.timeline()

function init() {
	
	carTl.kill()
	mainTl.kill()
	console.log("repeat", window.innerWidth)
	let width = window.innerWidth
	let distance = width + carWidth
	let rotation = (distance / circumference) * 360
	let duration = distance / speed
	
	carTl = gsap.timeline({defaults:{ease:"none"}})

	.fromTo("#car", {x:0}, {x:distance, duration:duration})
	.fromTo("#wheel1, #wheel2",{rotation:0}, {rotation:rotation, duration:duration, transformOrigin:"50% 50%"}, 0)
	.pause(0)
	

	
	
	//tween the car timeline's progress ;)
	mainTl = gsap.timeline({repeat:20 })
	.to(carTl, {progress:0.5, duration:duration/2})
	.call(newColor)
	.to(carTl, {progress:1, ease:"power1.in", duration:duration/2}, "+=0.7")

}

init()

let timeout
let delay = 200

// window.resize event listener
window.addEventListener('resize', function() {
  // clear the timeout
  clearTimeout(timeout);
  // start timing for event "completion"
  timeout = setTimeout(init, delay);
});


const randomHex = () => `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, "0")}`;


let color = 0;
const colors = [randomHex(),randomHex(),randomHex(),randomHex(),randomHex(),randomHex(),randomHex(),randomHex(),randomHex(),randomHex()]



function newColor() {
	gsap.to("#bgFill", {duration:0.5,  fill:gsap.utils.wrap(colors, color++)})
}

car.addEventListener("click", ()=> mainTl.paused(!mainTl.paused()))