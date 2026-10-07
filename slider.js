// IMAGE DATA
const images = [
    { src: "Image/image1.jpg.jpeg", alt: "First slider image" },
    { src: "Image/image2.jpg.jpeg", alt: "Second slider image" },
    { src: "Image/image3.jpg.jpeg", alt: "Third slider image" },
    { src: "Image/image4.jpg.jpeg", alt: "Fourth slider image" }
];

// IMAGE SLIDER CLASS
class ImageSlider {
    constructor(track, dotsContainer, previousButton, nextButton, imageData) {
        this.track = track;
        this.dotsContainer = dotsContainer;
        this.previousButton = previousButton;
        this.nextButton = nextButton;
        this.imageData = imageData;
        this.currentIndex = 0;
        this.isAnimating = false;

        // Initialize slider
        this.createSlides();
        this.createDots();
        this.bindEvents();
        this.updateSlider(false);
    }

    // CREATE SLIDES
    createSlides() {
        this.imageData.forEach((image, index) => {
            const slide = document.createElement("div");
            slide.classList.add("slide");
            slide.setAttribute("data-index", index);

            const imageElement = document.createElement("img");
            imageElement.src = image.src;
            imageElement.alt = image.alt;

            // Handle alternative image extensions
            imageElement.onerror = () => {
                if (imageElement.src.endsWith(".jpg.jpeg")) {
                    imageElement.src = image.src.replace(".jpg.jpeg", ".jpg");
                } else if (imageElement.src.endsWith(".jpg")) {
                    imageElement.src = image.src + ".jpeg";
                }
            };

            slide.appendChild(imageElement);
            this.track.appendChild(slide);
        });
    }

    // CREATE NAVIGATION DOTS
    createDots() {
        this.imageData.forEach((image, index) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.classList.add("slider-dot");
            dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
            dot.dataset.index = index;

            dot.addEventListener("click", () => {
                this.goToSlide(index);
            });

            this.dotsContainer.appendChild(dot);
        });

        this.updateActiveDot();
    }

    // BIND EVENT LISTENERS
    bindEvents() {
        // Next button
        this.nextButton.addEventListener("click", () => {
            this.next();
        });

        // Previous button
        this.previousButton.addEventListener("click", () => {
            this.previous();
        });

        // Keyboard navigation
        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") {
                this.next();
            }

            if (event.key === "ArrowLeft") {
                this.previous();
            }
        });

        // Detect animation completion
        this.track.addEventListener("transitionend", () => {
            this.isAnimating = false;
        });
    }

    // NEXT SLIDE
    next() {
        if (this.isAnimating) {
            return;
        }

        this.isAnimating = true;
        this.currentIndex++;

        // Return to first slide after the last slide
        if (this.currentIndex >= this.imageData.length) {
            this.currentIndex = 0;
        }

        this.updateSlider(true);
    }

    // PREVIOUS SLIDE
    previous() {
        if (this.isAnimating) {
            return;
        }

        this.isAnimating = true;
        this.currentIndex--;

        // Move to the last slide before the first slide
        if (this.currentIndex < 0) {
            this.currentIndex = this.imageData.length - 1;
        }

        this.updateSlider(true);
    }

    // GO TO SPECIFIC SLIDE
    goToSlide(index) {
        if (index < 0 || index >= this.imageData.length) {
            return;
        }

        if (index === this.currentIndex) {
            return;
        }

        if (this.isAnimating) {
            return;
        }

        this.isAnimating = true;
        this.currentIndex = index;
        this.updateSlider(true);
    }

    // UPDATE SLIDER POSITION
    updateSlider(animate = true) {
        if (animate) {
            this.track.style.transition = "transform 0.5s ease-in-out";
        } else {
            this.track.style.transition = "none";
        }

        const translateValue = -(this.currentIndex * 100);
        this.track.style.transform = `translateX(${translateValue}%)`;

        this.updateActiveDot();
    }

    // UPDATE ACTIVE DOT
    updateActiveDot() {
        const dots = this.dotsContainer.querySelectorAll(".slider-dot");

        dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add("active");
                dot.setAttribute("aria-current", "true");
            } else {
                dot.classList.remove("active");
                dot.removeAttribute("aria-current");
            }
        });
    }
}

// SELECT HTML ELEMENTS
const sliderTrack = document.getElementById("sliderTrack");
const sliderDots = document.getElementById("sliderDots");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");

// START IMAGE SLIDER
const imageSlider = new ImageSlider(
    sliderTrack,
    sliderDots,
    previousButton,
    nextButton,
    images
);