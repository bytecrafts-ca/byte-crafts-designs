let particlesConfig = {
    particles: {
        number: {
            value: window.innerWidth < 768 ? 50 : 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: "#FFFFFF"
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: 0.25,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#FFFFFF",
            opacity: 0.2,
            width: 1.5
        },
        move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "bounce",
            bounce: true,
            attract: {
                enable: true,
                rotateX: 800,
                rotateY: 1500
            }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "bubble"
            },
            onclick: {
                enable: true,
                mode: "repulse"
            },
            resize: true
        },
        modes: {
            bubble: {
                distance: 200,
                size: 4,
                duration: 2,
                opacity: 0.25,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            }
        }
    },
    retina_detect: true,
    fps_limit: 60
};