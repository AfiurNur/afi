
const cursor = document.querySelector(".cursor");

let mouse = { x: 0, y: 0 };
let pos = { x: 0, y: 0 };
const speed = 0.1; // smaller = smoother

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function animate() {
    pos.x += (mouse.x - pos.x) * speed;
    pos.y += (mouse.y - pos.y) * speed;

    cursor.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;

    requestAnimationFrame(animate);
}

animate();