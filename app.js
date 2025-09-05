document.addEventListener("DOMContentLoaded", () => {
    const landingPage = document.getElementById("landingPage");
    const mainContainer = document.getElementById("mainContainer");
    const bgVideo = document.getElementById("bgVideo");
    const muteBtn = document.getElementById("muteBtn");

    // Set initial volume and state
    let isMuted = true; // Start muted for autoplay compatibility
    let userInteracted = false;
    bgVideo.volume = 0;

    // Preload video to prevent playback issues
    bgVideo.load();

    // Handle landing page click
    const handleLandingClick = () => {
        if (!userInteracted) {
            userInteracted = true;

            // Try to play video with sound (requires user interaction)
            bgVideo.muted = false;
            bgVideo.volume = 0.3;

            const playPromise = bgVideo.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Video played successfully
                        animateTransition();
                    })
                    .catch(error => {
                        // If playing with sound fails, fall back to muted
                        console.log("Video with sound failed, falling back to muted:", error);
                        bgVideo.muted = true;
                        bgVideo.play()
                            .then(() => animateTransition())
                            .catch(err => {
                                console.error("Video play failed entirely:", err);
                                // Even if video fails, still animate transition
                                animateTransition();
                            });
                    });
            }
        }
    };

    // Animation function
    const animateTransition = () => {
        const tl = gsap.timeline();
        tl.to(landingPage, {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                landingPage.style.display = 'none';
            }
        });
        tl.to(mainContainer, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, "-=0.5");
    };

    // Add event listeners
    landingPage.addEventListener("click", handleLandingClick);

    // Support keyboard interaction for accessibility
    landingPage.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleLandingClick();
        }
    });

    // Mute/unmute functionality
    muteBtn.addEventListener("click", () => {
        isMuted = !isMuted;
        if (isMuted) {
            bgVideo.volume = 0;
            muteBtn.textContent = "🔇";
            muteBtn.setAttribute("aria-label", "Unmute sound");
        } else {
            bgVideo.volume = 0.3;
            muteBtn.textContent = "🔊";
            muteBtn.setAttribute("aria-label", "Mute sound");
        }
    });

    // Make muteBtn accessible via keyboard
    muteBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            muteBtn.click();
        }
    });
});