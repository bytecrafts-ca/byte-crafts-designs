let particlesConfig = {
    particles: {
        number: {
            value: window.innerWidth < 768 ? 30 : 50,
            density: {
                enable: true,
                value_area: 1000
            }
        },
        color: {
            value: "#3563E9"
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: 0.12,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.05,
                sync: false
            }
        },
        size: {
            value: 2,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.5,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#3563E9",
            opacity: 0.1,
            width: 1
        },
        move: {
            enable: true,
            speed: 1.5,
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