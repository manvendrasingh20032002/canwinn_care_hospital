window.addEventListener('load', () => {
    console.log("🚀 CANWINN PORTAL v2.1: FEEDBACK SYSTEM ONLINE");
    // --- PRIORITY: FEEDBACK & RATING (First-Contact Logic) ---
    const feedbackForm = document.getElementById('feedbackForm');
    const starRating = document.getElementById('starRating');
    let currentRating = 5;

    if (starRating) {
        const stars = starRating.querySelectorAll('i');
        const updateStars = (val) => {
            stars.forEach(s => {
                s.style.color = s.getAttribute('data-value') <= val ? '#fbbf24' : 'var(--secondary)';
            });
        };
        stars.forEach(star => {
            star.onclick = () => { currentRating = star.getAttribute('data-value'); updateStars(currentRating); };
            star.onmouseenter = () => updateStars(star.getAttribute('data-value'));
            star.onmouseleave = () => updateStars(currentRating);
        });
        updateStars(currentRating);
    }

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = feedbackForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

            const formData = {
                name: document.getElementById('fbName').value,
                rating: Number(currentRating),
                message: document.getElementById('fbMessage').value
            };

            try {
                const response = await fetch('http://localhost:5000/api/feedback/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (response.ok) {
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> Published!';
                    btn.style.background = '#10b981';
                    feedbackForm.reset();
                    showToast('Feedback Published', 'Your healing journey is now live.', 'success');
                }
            } catch (err) {
                showToast('Storage Lag', 'Saving in background...', 'info');
            }
            setTimeout(() => { btn.innerHTML = originalText; btn.style.background = ''; }, 2000);
        });
    }

    // 1. Navigation Scroll Effect
    const header = document.getElementById('mainHeader');
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
        reveal();
    });

    backToTop.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 2. Reveal Animations on Scroll
    function reveal() {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    }
    reveal(); // Initial check

    // 3. Hospital Process Video logic
    const mainVid = document.getElementById('processVideoObj');
    const startOverlay = document.getElementById('videoStartTrigger');
    const pTitle = document.getElementById('processTitle');
    const pDesc = document.getElementById('processDesc');

    const processData = {
        1: {
            src: "/public/arrival_vid.mp4",
            title: "1. Arrival & Immediate Care",
            desc: "Experience a seamless check-in at our modern reception with zero-wait-time triage."
        },
        2: {
            src: "/public/facility_vid.mp4",
            title: "2. Advanced Treatment Phase",
            desc: "Enter our state-of-the-art operation theaters with luxurious ICU suites."
        },
        3: {
            src: "/public/recovery_vid.mp4",
            title: "3. Happy Recovery & Outing",
            desc: "Step out healthier and happier from our premium discharge lounges."
        }
    };

    if (mainVid && startOverlay) {
        startOverlay.onclick = () => {
             mainVid.muted = false;
             mainVid.play();
             startOverlay.style.background = 'transparent';
             startOverlay.querySelector('.play-btn').style.display = 'none';
             pTitle.innerHTML = "1. Arrival & Immediate Care";
             pDesc.innerHTML = "Tour Started: 100% Reliable healthcare journey.";
             setTimeout(() => { 
                startOverlay.style.opacity = '0'; 
                startOverlay.style.pointerEvents = 'none'; 
             }, 3000);
        };
    }

    window.changeProcess = function(stepId, element) {
        document.querySelectorAll('.step-badge').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
        const data = processData[stepId];
        if (mainVid && data) {
            startOverlay.style.opacity = '1';
            startOverlay.style.pointerEvents = 'auto';
            pTitle.innerHTML = data.title;
            pDesc.innerHTML = data.desc;
            
            mainVid.style.opacity = 0;
            setTimeout(() => {
                const vidSrc = document.getElementById('processVideoSrc');
                if(vidSrc) vidSrc.src = data.src;
                mainVid.load();
                mainVid.play();
                mainVid.style.opacity = 0.8;
                setTimeout(() => { 
                    startOverlay.style.opacity = '0'; 
                    startOverlay.style.pointerEvents = 'none'; 
                }, 2000);
            }, 300);
        }
    };

    // 4. Feedback Video Hovers (Best to Best)
    const reviews = document.querySelectorAll('.review-hover-box');
    reviews.forEach(box => {
        const v = box.querySelector('video');
        const p = box.querySelector('.play-btn');
        if(!v) return;

        box.onmouseenter = () => {
            v.play().then(() => { if(p) p.style.opacity = '0'; });
        };
        box.onmouseleave = () => {
            v.pause();
            if(p) p.style.opacity = '1';
        };
        box.onclick = () => {
             v.muted = !v.muted;
             v.play();
        };
    });

    // 5. Feedback Form & Star Rating Logic

    if (starRating) {
        const stars = starRating.querySelectorAll('i');
        stars.forEach(star => {
            star.onmouseenter = () => {
                const val = star.getAttribute('data-value');
                updateStars(val);
            };
            star.onmouseleave = () => {
                updateStars(currentRating);
            };
            star.onclick = () => {
                currentRating = star.getAttribute('data-value');
                updateStars(currentRating);
            };
        });

        function updateStars(val) {
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= val) {
                    s.style.color = '#fbbf24'; // Gold
                } else {
                    s.style.color = 'var(--secondary)';
                }
            });
        }
        updateStars(currentRating); // Set initial
    }






    // 6. Mobile Toggle Logic
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    if(mobileToggle && navLinks) {
        mobileToggle.onclick = () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        };
        // Close on click
        navLinks.querySelectorAll('a').forEach(link => {
            link.onclick = () => {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            };
        });
    }
    // 8. Doctor Profile Modal Logic (Glow Redesign)
    const doctorData = {
        'Dr. Sarah Johnson': {
            role: 'Chief of Surgery',
            exp: '15+ Years',
            edu: 'MD from Harvard Medical School',
            img: 'public/doctor1.png',
            skills: ['Advanced Robotic Surgery', 'Trauma Care Specialist', 'Organ Transplant'],
            bio: 'Dr. Sarah is a world-renowned surgeon specializing in minimally invasive procedures with a 99.8% success rate.'
        },
        'Dr. Michael Smith': {
            role: 'Senior Cardiologist',
            exp: '12+ Years',
            edu: 'MD in Cardiology, Johns Hopkins University',
            img: 'public/doctor2.png',
            skills: ['Interventional Cardiology', 'Heart Failure Expert', 'Cardiac Arrythmias'],
            bio: 'Leading the heart care wing, Dr. Michael is dedicated to advanced cardiovascular health and preventive medicine.'
        },
        'Dr. Emily Davis': {
            role: 'Expert Neurologist',
            exp: '10+ Years',
            edu: 'Masters in Neurosurgery, Stanford University',
            img: 'public/doctor1.png', // Note: Using doctor1 with hue-rotate or similar if needed
            skills: ['Brain Mapping', 'Spinal Cord Surgery', 'Neuro-oncology'],
            bio: 'Dr. Emily focuses on complex mind-health and nervous system recoveries with ultra-modern monitoring tools.'
        }
    };

    window.showDoctorProfile = function(name) {
        const modal = document.getElementById('doctorModal');
        const content = document.getElementById('modalContent');
        const dr = doctorData[name];
        if(!dr) return;

        content.innerHTML = `
            <div style="display: grid; grid-template-columns: 350px 1fr; min-height: 550px;">
                <!-- Left Side: Profile Image with Experience Badge -->
                <div style="position: relative; overflow: hidden; background: #f8fafc;">
                    <img src="${dr.img}" style="width: 100%; height: 100%; object-fit: cover; filter: ${name === 'Dr. Emily Davis' ? 'hue-rotate(180deg)' : 'none'};">
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(15,23,42,0.8)); padding: 2rem; color: white;">
                        <h4 style="font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; opacity: 0.8; margin-bottom: 5px;">Field Expertise</h4>
                        <p style="font-size: 1.1rem; font-weight: 700;">${dr.role}</p>
                    </div>
                    <div style="position: absolute; top: 20px; left: 20px; background: var(--accent); color: white; padding: 10px 20px; border-radius: 50px; font-weight: 800; font-size: 0.75rem; box-shadow: 0 10px 25px var(--accent-glow);">
                        VERIFIED SPECIALIST
                    </div>
                </div>

                <!-- Right Side: Professional Details -->
                <div style="padding: 4rem; display: flex; flex-direction: column; justify-content: center;">
                    <div style="margin-bottom: 2.5rem;">
                        <h2 style="font-size: 3rem; color: var(--text); margin: 0; letter-spacing: -1.5px; line-height: 1;">${name}</h2>
                        <div style="margin-top: 10px; display: flex; align-items: center; gap: 10px;">
                             <span style="color: var(--accent); font-weight: 800; font-size: 0.9rem;">TOP-RATED</span>
                             <div style="height: 4px; width: 4px; background: var(--secondary); border-radius: 50%;"></div>
                             <span style="color: var(--text-muted); font-weight: 600; font-size: 0.9rem;">${dr.exp} MEDICAL JOURNEY</span>
                        </div>
                    </div>

                    <div style="display: grid; gap: 2rem;">
                        <div style="display: flex; gap: 20px;">
                             <div style="width: 50px; height: 50px; background: #f1f5f9; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: var(--accent);">
                                 <i class="fa-solid fa-graduation-cap"></i>
                             </div>
                             <div style="flex: 1;">
                                 <h4 style="margin: 0; font-size: 1rem; color: var(--text);">Academic Excellence</h4>
                                 <p style="margin: 6px 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;">${dr.edu}</p>
                             </div>
                        </div>

                        <div style="display: flex; gap: 20px;">
                             <div style="width: 50px; height: 50px; background: #f1f5f9; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: var(--accent);">
                                 <i class="fa-solid fa-heart-pulse"></i>
                             </div>
                             <div style="flex: 1;">
                                 <h4 style="margin: 0; font-size: 1rem; color: var(--text);">Consultation Summary</h4>
                                 <p style="margin: 6px 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">${dr.bio}</p>
                             </div>
                        </div>

                        <div>
                            <h4 style="margin: 0 0 1rem; font-size: 0.75rem; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; font-weight: 800;">Core Specializations</h4>
                            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                                ${dr.skills.map(s => `<span style="background: #f1f5f9; color: var(--text); padding: 8px 18px; border-radius: 10px; font-size: 0.8rem; font-weight: 600; border: 1px solid rgba(0,0,0,0.03);">${s}</span>`).join('')}
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 3.5rem;">
                        <button class="btn btn-primary" style="width: 100%; padding: 1.5rem; font-size: 1.1rem; border-radius: 20px; box-shadow: 0 20px 40px var(--accent-glow);" onclick="window.location.href='#appointment'; document.getElementById('doctorModal').style.display='none';">
                            Book Priority Consultation <i class="fa-solid fa-calendar-check" style="margin-left: 10px;"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scroll
    };

    document.getElementById('closeModal').onclick = () => {
        document.getElementById('doctorModal').style.display = 'none';
    };

    window.onclick = (e) => {
        if(e.target == document.getElementById('doctorModal')) {
            document.getElementById('doctorModal').style.display = 'none';
        }
        if(e.target == document.getElementById('lightbox')) {
            document.getElementById('lightbox').style.display = 'none';
        }
    };

    // 9. Best to Best Gallery Filtering
    window.filterGallery = function(category) {
        const items = document.querySelectorAll('.gallery-item');
        const buttons = document.querySelectorAll('.btn-filter');
        
        buttons.forEach(btn => btn.classList.remove('active'));
        const activeBtn = Array.from(buttons).find(b => b.textContent.toLowerCase().includes(category));
        if(activeBtn) activeBtn.classList.add('active');

        items.forEach(item => {
            item.style.transition = '0.4s';
            if(category === 'all' || item.classList.contains(category)) {
                item.style.display = 'block';
                setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => { item.style.display = 'none'; }, 400);
            }
        });
    };

    // 10. Lightbox Logic
    window.openLightbox = function(src) {
        const lb = document.getElementById('lightbox');
        const img = document.getElementById('lightboxImg');
        img.src = src;
        lb.style.display = 'flex';
    };

    document.getElementById('closeLightbox').onclick = () => {
        document.getElementById('lightbox').style.display = 'none';
    };

    // Hero Modals Logic
    window.openConsultModal = function() {
        document.getElementById('heroConsultModal').style.display = 'flex';
    };
    window.closeConsultModal = function() {
        document.getElementById('heroConsultModal').style.display = 'none';
    };

    window.openVideoModal = function() {
        document.getElementById('heroVideoModal').style.display = 'flex';
        const vid = document.getElementById('heroModalVideoObj');
        vid.play().catch(e => console.log('Autoplay prevented', e));
    };
    window.closeVideoModal = function() {
        document.getElementById('heroVideoModal').style.display = 'none';
        vid.pause();
    };

    // 11. Medical Record & Portal Logic
    const uploadForm = document.getElementById('recordUploadForm');
    const recordsList = document.getElementById('recordsList');
    const fileInput = document.getElementById('recordFile');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    // Display file name when chosen
    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener('change', (e) => {
            const fileName = e.target.files[0] ? e.target.files[0].name : 'Choose a file...';
            fileNameDisplay.textContent = fileName;
        });
    }

    // 12. Toast Notification Logic
    function showToast(title, message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-circle-check',
            error: 'fa-circle-xmark',
            info: 'fa-circle-info'
        };

        toast.innerHTML = `
            <div class="toast-icon"><i class="fa-solid ${icons[type]}"></i></div>
            <div class="toast-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'toast-fade-out 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards';
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }

    // Consolidated Form Handlers with Toasts
    const appForms = ['appointmentForm', 'consultationForm'];
    appForms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = form.querySelector('button');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

                const loggedInUser = JSON.parse(localStorage.getItem('user') || 'null');

                // Get values from the SPECIFIC form (using scoped query selectors)
                const formData = {
                    name: form.querySelector('[id="apptName"], [name="name"]').value,
                    email: form.querySelector('[id="apptEmail"], [name="email"]').value,
                    phone: form.querySelector('[id="apptPhone"]').value,
                    date: form.querySelector('[id="apptDate"]').value,
                    time: form.querySelector('[id="apptTime"]').value,
                    department: form.querySelector('[id="apptDept"]').value,
                    patientId: loggedInUser ? loggedInUser.id : null
                };

            try {
                const response = await fetch('http://localhost:5000/api/appointments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                
                if (result.success) {
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> Slot Confirmed!';
                    btn.style.background = '#10b981';
                    form.reset();
                    showToast('Booking Successful', 'Your appointment and email confirmation are ready.', 'success');
                } else {
                    showToast('Booking Failed', result.message || 'Please try again.', 'error');
                    btn.innerHTML = 'Try Again';
                }
            } catch (error) {
                showToast('Server Error', 'Communication with the hospital failed.', 'error');
                btn.innerHTML = 'Error';
            }

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 1000);
            });
        }
    });


    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

            const formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                phone: document.getElementById('contactPhone').value,
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value
            };

            try {
                const response = await fetch('http://localhost:5000/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();
                
                if (result.success) {
                    btn.innerHTML = '<i class="fa-solid fa-envelope-circle-check"></i> Message Sent!';
                    contactForm.reset();
                    showToast('Message Sent', 'Admin and your phone has been notified.', 'success');
                } else {
                    showToast('Inquiry Failed', result.message || 'Error occurred.', 'error');
                }
            } catch (error) {
                showToast('System Error', 'Service is temporarily unavailable.', 'error');
            }

            setTimeout(() => { btn.innerHTML = originalText; }, 4000);
        });
    }

    // --- 10-Digit Numeric Validation (Global Enforcement) ---
    const enforcePhoneValidation = () => {
        const telInputs = document.querySelectorAll('input[type="tel"], #apptPhone, #contactPhone, #r-phone');
        telInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                // Remove non-numeric characters
                let val = e.target.value.replace(/[^0-9]/g, '');
                // Slice to max 10 digits
                if (val.length > 10) {
                    val = val.slice(0, 10);
                }
                e.target.value = val;
            });
        });
    };
    enforcePhoneValidation();

    // 12. Medical Reports Logic with Search & "View All"
    window.medicalState = { showAll: false, data: [], searchQuery: '' };

    window.fetchRecords = async (patientId) => {
        const list = document.getElementById('recordsList');
        const viewAllContainer = document.getElementById('viewAllContainer');
        if (!list) return;

        try {
            const response = await fetch(`/api/medical-records/${patientId}`);
            const result = await response.json();
            
                window.medicalState.data = result.data;
                
                const q = window.medicalState.searchQuery.toLowerCase();
                let matched = [];
                let others = [];

                if (q) {
                    matched = result.data.filter(rec => 
                        rec.diagnosis.toLowerCase().includes(q) ||
                        (rec.patientName && rec.patientName.toLowerCase().includes(q))
                    );
                    others = result.data.filter(rec => !matched.includes(rec));
                } else {
                    matched = result.data;
                }

                let displayData = [];
                if (q) {
                    displayData = [...matched, ...others];
                } else if (!window.medicalState.showAll) {
                    displayData = matched.slice(0, 3);
                } else {
                    displayData = matched;
                }

                if (viewAllContainer) {
                    viewAllContainer.style.display = (result.data.length > 3 && !q) ? 'block' : 'none';
                }

                if (displayData.length > 0) {
                    list.innerHTML = displayData.map(rec => {
                        const isMatch = q && matched.includes(rec);
                        const boxStyle = isMatch ? 'box-shadow: 0 10px 30px rgba(59, 130, 246, 0.15); border-left: 5px solid #3b82f6; background: #f0f9ff;' : 'box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-left: 5px solid var(--accent); background: white;';
                        const iconBg = isMatch ? 'background: #3b82f6; color: white;' : 'background: var(--primary-bg); color: var(--accent);';
                        const badgeHtml = isMatch ? '<span style="background: #dbeafe; color: #1e40af; font-size: 0.6rem; padding: 2px 8px; border-radius: 10px; font-weight: 800; margin-bottom: 5px; display: inline-block;">TOP MATCH</span><br>' : '';

                        return `
                        <div class="card reveal active" style="padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; transition: 0.3s; ${boxStyle}">
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <div style="width: 45px; height: 45px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; ${iconBg}">
                                    <i class="fa-solid fa-file-medical"></i>
                                </div>
                                <div>
                                    ${badgeHtml}
                                    <h4 style="margin: 0; font-size: 1rem; color: var(--text);">${rec.diagnosis}</h4>
                                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Patient: ${rec.patientName || 'Verified'} | ${new Date(rec.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <a href="${rec.attachments[0]}" target="_blank" class="btn btn-primary" style="padding: 0.6rem 1.2rem; font-size: 0.8rem; border-radius: 10px; ${isMatch ? 'background: #3b82f6;' : ''}">
                                <i class="fa-solid fa-eye"></i> View Report
                            </a>
                        </div>
                        `;
                    }).join('');
                } else {
                    list.innerHTML = `
                        <div class="card" style="padding: 2.5rem; text-align: center; opacity: 0.6; border: 1.5px dashed var(--secondary); background: rgba(0,0,0,0.01);">
                            <i class="fa-solid fa-magnifying-glass-chart" style="font-size: 2rem; margin-bottom: 1rem; color: var(--accent);"></i>
                            <p>${q ? 'No matching reports found.' : 'No reports in history yet.'}</p>
                        </div>
                    `;
                }
        } catch (error) {
            console.error('Fetch Records Error:', error);
        }
    };

    // Search Logic
    const recordSearch = document.getElementById('recordSearch');
    if (recordSearch) {
        recordSearch.oninput = (e) => {
            window.medicalState.searchQuery = e.target.value;
            const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
            window.fetchRecords(loggedInUser.id || '65f1234567890abcdef00001');
        };
    }

    // Toggle View History
    const viewAllBtn = document.getElementById('viewAllBtn');
    if (viewAllBtn) {
        viewAllBtn.onclick = () => {
            window.medicalState.showAll = !window.medicalState.showAll;
            viewAllBtn.innerHTML = window.medicalState.showAll ? 
                '<i class="fa-solid fa-compress highlight" style="margin-right: 8px;"></i> Show Less' : 
                '<i class="fa-solid fa-clock-rotate-left highlight" style="margin-right: 8px;"></i> View All Reports';
            window.fetchRecords('65f1234567890abcdef00001');
        };
    }

    // Initial load for demo patient
    const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    fetchRecords(loggedInUser.id || '65f1234567890abcdef00001');

    // Record Upload Submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            const title = document.getElementById('recordTitle').value;
            const file = fileInput.files[0];

            if (!title || !file) {
                showToast('Incomplete Data', 'Please provide a title and select a file.', 'error');
                btn.innerHTML = originalText;
                btn.style.background = '';
                return;
            }

            const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
            const targetPatientId = loggedInUser.id || '65f1234567890abcdef00001';

            const formData = new FormData();
            formData.append('patientId', targetPatientId);
            formData.append('doctorId', '65f1234567890abcdef00002');
            formData.append('patientName', document.getElementById('recordPatientName').value);
            formData.append('dob', document.getElementById('recordDOB').value);
            formData.append('address', document.getElementById('recordAddress').value);
            formData.append('diagnosis', title);
            formData.append('prescription', 'As per doctor consultation');
            formData.append('attachment', file);

            try {
                const response = await fetch('http://localhost:5000/api/medical-records/upload', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // 1. Update the UI first
                    btn.innerHTML = '<i class="fa-solid fa-cloud-check"></i> Stored!';
                    btn.style.background = '#10b981';
                    uploadForm.reset();
                    if (fileNameDisplay) fileNameDisplay.textContent = 'Choose a file...';
                    
                    // 2. Show success toast immediately
                    showToast('File Uploaded', 'Record stored successfully.', 'success');
                    
                    // 3. Trigger list refresh separately
                    setTimeout(() => {
                        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                        window.fetchRecords(currentUser.id || '65f1234567890abcdef00001');
                    }, 500);
                    
                    return; // EXIT HERE ON SUCCESS TO PREVENT CATCH BLOCK
                } else {
                    showToast('Upload Failed', result.message || 'Server rejected the file.', 'error');
                }
            } catch (error) {
                // Only show error if it's NOT a successful result that somehow threw
                console.error('Critical Upload Error:', error);
                showToast('Upload Error', 'Please refresh and try again.', 'error');
            }

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 4000);
        });
    }

});
