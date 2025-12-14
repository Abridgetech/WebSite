document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('internForm');
  const formContainer = document.getElementById('formContainer');

  // Helper to show/hide tooltips with dynamic message
  function showError(elementId, show, message) {
    const el = document.getElementById(elementId);
    if (el) {
      if (show) {
        if (message) el.innerText = message;
        el.classList.remove('d-none');
      } else {
        el.classList.add('d-none');
      }
    }
  }

  // Generic validator using browser native validation
  function validateField(inputIds, errorId, customLogic = null) {
    const inputs = Array.isArray(inputIds) 
      ? inputIds.map(id => document.getElementById(id)).filter(Boolean)
      : [document.getElementById(inputIds)];
    
    let isValid = true;
    let message = "";

    const el = inputs[0];
    if (!el) return true;

    // Run custom logic if provided (e.g. for phone)
    if (customLogic && typeof customLogic === 'function') {
        customLogic(el);
    }

    if (el.type === 'radio' || el.type === 'checkbox') {
        const name = el.name;
        const group = document.getElementsByName(name);
        const isRequired = group[0].hasAttribute('required');
        
        let checked = false;
        for(let r of group) if(r.checked) checked = true;

        if(isRequired && !checked) {
            isValid = false;
            message = "Please select one of these options.";
            if(group[0].validationMessage) message = group[0].validationMessage;
        }
    } else {
        if (!el.checkValidity()) {
            isValid = false;
            message = el.validationMessage;
        }
    }

    showError(errorId, !isValid, message);
    return isValid;
  }

  // Phone custom logic
  function phoneCustomLogic(el) {
      const val = el.value.trim();
      // Remove all leading zeros
      const cleanVal = val.replace(/^0+/, '');
      
      // Check if it is a number
      if (!/^\d+$/.test(val)) {
         el.setCustomValidity("Please enter numbers only.");
      } else if (cleanVal.length !== 10) {
         el.setCustomValidity("Phone number must be 10 digits (excluding leading zeros).");
      } else {
         el.setCustomValidity("");
      }
  }

  // Validation Wrappers
  const validators = {
    name: () => validateField('name', 'nameError'),
    phone: () => validateField('phone', 'phoneError', phoneCustomLogic),
    email: () => validateField('email', 'emailError'),
    edu: () => validateField('edu1', 'eduError'),
    school: () => validateField('school', 'schoolError'),
    about: () => validateField('about1', 'aboutError'),
    aiRevolution: () => validateField('aiRevolution', 'aiRevolutionError'),
    competencies: () => validateField('competencies', 'competenciesError'),
    why: () => validateField('why', 'whyError')
  };

  // Add Blur Listeners
  if (form) {
    document.getElementById('name').addEventListener('blur', validators.name);
    document.getElementById('phone').addEventListener('blur', validators.phone);
    document.getElementById('email').addEventListener('blur', validators.email);
    document.getElementById('school').addEventListener('blur', validators.school);
    document.getElementById('aiRevolution').addEventListener('blur', validators.aiRevolution);
    document.getElementById('competencies').addEventListener('blur', validators.competencies);
    document.getElementById('why').addEventListener('blur', validators.why);
    
    // For radios, add change listener
    document.querySelectorAll('input[name="edu"]').forEach(r => r.addEventListener('change', validators.edu));
    document.querySelectorAll('input[name="about"]').forEach(r => r.addEventListener('change', validators.about));

    form.addEventListener('submit', async function(event) {
      event.preventDefault();
      
      let firstErrorId = null;
      let isFormValid = true;

      // Validate all fields
      if (!validators.name()) { isFormValid = false; firstErrorId = firstErrorId || 'name'; }
      if (!validators.phone()) { isFormValid = false; firstErrorId = firstErrorId || 'phone'; }
      if (!validators.email()) { isFormValid = false; firstErrorId = firstErrorId || 'email'; }
      if (!validators.edu()) { isFormValid = false; firstErrorId = firstErrorId || 'eduError'; }
      if (!validators.school()) { isFormValid = false; firstErrorId = firstErrorId || 'school'; }
      if (!validators.about()) { isFormValid = false; firstErrorId = firstErrorId || 'aboutError'; }
      if (!validators.aiRevolution()) { isFormValid = false; firstErrorId = firstErrorId || 'aiRevolution'; }
      if (!validators.competencies()) { isFormValid = false; firstErrorId = firstErrorId || 'competencies'; }
      if (!validators.why()) { isFormValid = false; firstErrorId = firstErrorId || 'why'; }

      if (isFormValid) {
        // Collect Data
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            edu: document.querySelector('input[name="edu"]:checked')?.value || "",
            school: document.getElementById('school').value,
            about: document.querySelector('input[name="about"]:checked')?.value || "",
            aiRevolution: document.getElementById('aiRevolution').value,
            competencies: document.getElementById('competencies').value,
            why: document.getElementById('why').value
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";

        try {
            const res = await fetch("https://hook.eu1.make.com/ufa7qcqgovkgr7x1xxs81n8a3c7h6h2j", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "x-make-apikey": "qwertgfdsazxcvb" 
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                 // Success: Replace Content
                formContainer.innerHTML = `
                <div class="bg-white rounded-4 shadow-lg p-5 text-center animate-fadeIn" style="border-radius: 1.5rem;">
                    <h1 class="display-4 fw-bold text-dark mb-4">
                    🎉 Thank You!
                    </h1>
                    <p class="lead text-secondary mb-4">
                    Your internship application has been submitted successfully.
                    <br class="d-none d-md-block" />
                    Our team will contact you soon.
                    </p>
                    <p class="mt-4 text-muted small fst-italic">
                    — Team A Bridge
                    </p>
                    <a href="index.html"
                    class="btn btn-dark btn-xl rounded-pill mt-4 shadow hover-scale-105"
                    style="color: #f7d23f;">
                    Go to Home
                    </a>
                </div>
                `;
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                throw new Error("Submission failed");
            }

        } catch (error) {
            console.error("Error submitting form:", error);
            alert("There was an error submitting your application. Please try again later.");
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }

      } else {
        // Scroll to first error
        const errorEl = document.getElementById(firstErrorId);
        if (errorEl) {
            const yOffset = -100; 
            const y = errorEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'smooth'});
            if(errorEl.tagName === 'INPUT' || errorEl.tagName === 'TEXTAREA') {
                errorEl.focus();
            }
        }
      }
    });
  }
});

// Testimonials Carousel Logic
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.testimonial-track');
    // Only run if track exists
    if (!track) return;

    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.slider-next');
    const prevButton = document.querySelector('.slider-prev');
    const slideInterval = 1000; // 15 seconds
    let autoPlayTimer;

    // Calculate how many slides to scroll based on viewport
    function getSlidesPerView() {
        return window.innerWidth >= 768 ? 3 : 1;
    }

    let currentIndex = 0;

    function moveToSlide(index) {
        const slidesPerView = getSlidesPerView();
        const maxIndex = slides.length - slidesPerView;
        
        // Loop back
        if (index > maxIndex) index = 0;
        if (index < 0) index = maxIndex;

        currentIndex = index;
        const width = slides[0].getBoundingClientRect().width;
        track.style.transform = 'translateX(-' + (width * currentIndex) + 'px)';
    }

    function nextSlide() {
        moveToSlide(currentIndex + 1);
    }

    function prevSlide() {
        moveToSlide(currentIndex - 1);
    }

    // Auto Play
    function startAutoPlay() {
        stopAutoPlay(); // Clear existing to allow reset
        autoPlayTimer = setInterval(nextSlide, slideInterval);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayTimer);
    }

    // Event Listeners
    nextButton.addEventListener('click', () => {
        nextSlide();
        startAutoPlay(); // Reset timer on interaction
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
        startAutoPlay(); // Reset timer on interaction
    });

    // Pause on hover (container)
    const container = document.querySelector('.testimonial-slider-container');
    container.addEventListener('mouseenter', stopAutoPlay);
    container.addEventListener('mouseleave', startAutoPlay);

    // Initial Start
    startAutoPlay();

    // Handle Resize
    window.addEventListener('resize', () => {
        moveToSlide(currentIndex); // Re-adjust position
    });
});
