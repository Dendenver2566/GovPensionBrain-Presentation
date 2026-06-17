document.addEventListener('DOMContentLoaded', () => {
    // --- Slide Navigation Manager ---
    const slides = document.querySelectorAll('.slide');
    const navItems = document.querySelectorAll('.sidebar .nav-item');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const slideCounter = document.getElementById('slideCounter');
    const progressBar = document.getElementById('progressBar');
    const slideOverlay = document.getElementById('slideOverlay');
    const btnAutoPlay = document.getElementById('btnAutoPlay');
    const btnFullscreen = document.getElementById('btnFullscreen');
    
    let currentSlide = 0;
    let autoPlayInterval = null;
    let isAutoPlaying = false;
    
    function showSlide(index, skipTransition = false) {
        if (index < 0 || index >= slides.length) return;
        
        // Trigger page transition flash/fade effect
        if (!skipTransition) {
            slideOverlay.classList.add('active');
        }
        
        setTimeout(() => {
            // Remove active classes
            slides[currentSlide].classList.remove('active');
            navItems[currentSlide].classList.remove('active');
            
            // Set new active slide
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            navItems[currentSlide].classList.add('active');
            
            // Update controls
            btnPrev.disabled = currentSlide === 0;
            btnNext.disabled = currentSlide === slides.length - 1;
            slideCounter.textContent = `${currentSlide + 1} / ${slides.length}`;
            progressBar.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
            
            // Trigger specific slide interactions
            handleSlideEnter(currentSlide);
            
            if (!skipTransition) {
                setTimeout(() => {
                    slideOverlay.classList.remove('active');
                }, 100);
            }
        }, skipTransition ? 0 : 150);
    }
    
    // Add click listeners to sidebar nav items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = parseInt(item.getAttribute('data-slide'));
            showSlide(target);
            stopAutoPlay();
        });
    });
    
    // Prev / Next button actions
    btnPrev.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        stopAutoPlay();
    });
    btnNext.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        stopAutoPlay();
    });
    
    // Keyboard navigation keys
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            if (currentSlide < slides.length - 1) {
                showSlide(currentSlide + 1);
                stopAutoPlay();
            }
        } else if (e.key === 'ArrowLeft') {
            if (currentSlide > 0) {
                showSlide(currentSlide - 1);
                stopAutoPlay();
            }
        }
    });
    
    // Auto Play presentation mode
    function startAutoPlay() {
        isAutoPlaying = true;
        btnAutoPlay.innerHTML = '<i class="fa-solid fa-pause"></i>';
        btnAutoPlay.style.color = 'var(--color-primary)';
        btnAutoPlay.style.borderColor = 'var(--color-primary)';
        btnAutoPlay.style.boxShadow = 'var(--shadow-cyan)';
        
        autoPlayInterval = setInterval(() => {
            if (currentSlide < slides.length - 1) {
                showSlide(currentSlide + 1);
            } else {
                showSlide(0); // Loop back to start
            }
        }, 12000); // 12 seconds per slide
    }
    
    function stopAutoPlay() {
        isAutoPlaying = false;
        btnAutoPlay.innerHTML = '<i class="fa-solid fa-play"></i>';
        btnAutoPlay.style.color = '';
        btnAutoPlay.style.borderColor = '';
        btnAutoPlay.style.boxShadow = '';
        clearInterval(autoPlayInterval);
    }
    
    btnAutoPlay.addEventListener('click', () => {
        if (isAutoPlaying) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });
    
    // Fullscreen Present Mode
    btnFullscreen.addEventListener('click', () => {
        const container = document.documentElement;
        if (!document.fullscreenElement) {
            container.requestFullscreen().then(() => {
                btnFullscreen.innerHTML = '<i class="fa-solid fa-compress"></i> ย่อจอ';
            }).catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen().then(() => {
                btnFullscreen.innerHTML = '<i class="fa-solid fa-expand"></i> นำเสนอ';
            });
        }
    });
    
    // Listen for fullscreen state changes
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            btnFullscreen.innerHTML = '<i class="fa-solid fa-expand"></i> นำเสนอ';
        }
    });
    
    
    // --- Slide Entering Trigger Hooks ---
    function handleSlideEnter(slideIndex) {
        if (slideIndex === 5) {
            // Re-init canvas nodes simulation when entering Slide 6
            initNetworkGraph();
        } else if (slideIndex === 6) {
            // Trigger numbers count up animation for Slide 7
            animateNumbers();
        } else if (slideIndex === 7) {
            // Reset chat simulator on Slide 8
            resetChat();
        }
    }
    
    
    // --- Slide 3: Agenda Hover Previews ---
    const agendaItems = document.querySelectorAll('.agenda-item');
    const agendaPreview = document.getElementById('agendaPreview');
    
    const agendaData = {
        '3': {
            icon: '<i class="fa-solid fa-triangle-exclamation" style="color: var(--color-danger);"></i>',
            title: 'การวิเคราะห์ปัญหา (Problem Analysis)',
            desc: 'สำรวจอุปสรรคของการตีความบำนาญ ความกระจัดกระจายของไฟล์คู่มือ และผลกระทบต่อข้าราชการระเบียบทั่วประเทศ'
        },
        '4': {
            icon: '<i class="fa-solid fa-screwdriver-wrench" style="color: var(--color-primary);"></i>',
            title: 'แนวทางแก้ไขและการสร้างระบบ',
            desc: '6 ขั้นตอนในการสร้างคลังความรู้องค์กรด้วย Obsidian Markdown Links ร่วมกับพลังประมวลผลของ Gemini AI ในแบบ Zero Cost'
        },
        '5': {
            icon: '<i class="fa-solid fa-diagram-project" style="color: var(--color-secondary);"></i>',
            title: 'ผลผลิต / ผลลัพธ์ / ประโยชน์',
            desc: 'เปรียบเทียบการเปลี่ยนแปลงจากระบบการจัดเก็บโฟลเดอร์ Drive กระจัดกระจายแบบเดิม สู่เทคโนโลยีโครงข่ายความรู้ (Knowledge Graph)'
        },
        '7': {
            icon: '<i class="fa-solid fa-terminal" style="color: var(--color-success);"></i>',
            title: 'ทดสอบความใช้งานได้จริง',
            desc: 'สืบค้นกรณีศึกษาจริงกับ AI Copilot เพื่อพิสูจน์การคำนวณบำนาญและการป้องกันการตอบเดานอกขอบเขตของ AI (Context Guard)'
        },
        '8': {
            icon: '<i class="fa-solid fa-circle-nodes" style="color: var(--color-accent);"></i>',
            title: 'การพัฒนาที่ยั่งยืนและขยายผล',
            desc: 'การรักษาสมองขององค์กรไม่ให้โยกย้ายตามตัวบุคคล แผนขยายผลสู่คลังจังหวัด ขยายระเบียบพัสดุ และต้นแบบหน่วยงานรัฐอื่น'
        }
    };
    
    agendaItems.forEach(item => {
        const target = item.getAttribute('data-target');
        
        item.addEventListener('mouseenter', () => {
            if (agendaData[target]) {
                const data = agendaData[target];
                agendaPreview.style.opacity = 0;
                setTimeout(() => {
                    agendaPreview.innerHTML = `
                        <div class="agenda-preview-icon">${data.icon}</div>
                        <h3 class="agenda-preview-title">${data.title}</h3>
                        <p class="agenda-preview-desc">${data.desc}</p>
                    `;
                    agendaPreview.style.opacity = 1;
                }, 150);
            }
        });
        
        item.addEventListener('click', () => {
            showSlide(parseInt(target));
        });
    });
    
    
    // --- Slide 5: Timeline Stepper ---
    const stepNodes = document.querySelectorAll('.step-node');
    const stepInfo = document.getElementById('stepInfo');
    const stepGraphic = document.getElementById('stepGraphic');
    const stepperProgress = document.getElementById('stepperProgress');
    
    const stepsData = [
        {
            title: '1. ติดตั้ง Obsidian & สร้าง Vault ท้องถิ่น',
            desc: 'ดาวน์โหลดและติดตั้งโปรแกรมจดโน้ต Obsidian (รองรับแบบ Local ปลอดภัย ไร้กังวลข้อมูลรั่วไหล) จากนั้นทำการสร้างโฟลเดอร์กระดาษโน้ตเปล่าที่เรียกว่า "Vault" ตั้งชื่อว่า "CGD Knowledge"',
            graphic: '📁 C:\\Users\\CGD\\Documents\\CGD Knowledge\n├── 📝 โน้ตบำนาญ.md\n└── 📝 คู่มือสมาชิก.md'
        },
        {
            title: '2. ขอรับ API Key จาก Google AI Studio',
            desc: 'เข้าไปที่เว็บไซต์ Google AI Studio เพื่อขอสิทธิ์การเข้าใช้งาน Gemini API โดยเลือกใช้บริการแพลตฟอร์ม API แบบ Free Tier ทำให้สามารถใช้โมเดลระดับพรีเมียมได้ฟรี ไม่มีต้นทุนในระยะพัฒนา',
            graphic: '🔑 Google AI Studio Developer Console\nAPI Key: API_KEY_*********************\nModel: gemini-1.5-flash (Free Limit enabled)'
        },
        {
            title: '3. ติดตั้ง Copilot Plugin ใน Obsidian',
            desc: 'เปิดโปรแกรม Obsidian เข้าไปที่การตั้งค่า Community Plugins ค้นหาปลั๊กอิน "Copilot" เพื่อติดตั้งเข้ามาในโปรแกรม แล้วนำ API Key จากขั้นตอนที่ 2 มาใส่ลงในช่อง AI Configuration',
            graphic: '⚙️ Obsidian > Community Plugins\n🔍 Search: "Copilot" > [Install] > [Enable]\n🔑 Set API Key: AI_Studio_Key = **********'
        },
        {
            title: '4. แปลงระเบียบและกฎหมายเป็นคลังโน้ต (.md)',
            desc: 'แปลงไฟล์ PDF หนังสือเวียน กฎกระทรวง และ พ.ร.บ. บำเหน็จบำนาญต่างๆ ให้อยู่ในรูปโน้ต Markdown (.md) แล้วสร้างจุดเชื่อมระหว่างโน้ตผ่านเครื่องหมาย Internal Link [[กฎหมายอ้างอิง]] คล้ายสารานุกรมวิกิพีเดียส่วนตัว',
            graphic: '📝 [[พ.ร.บ. บำเหน็จบำนาญ 2494]]\n├── มาตรา 9: อัตราบำนาญ...\n└── มีส่วนเกี่ยวข้องกับการคำนวณของ [[พ.ร.บ. กบข. 2539]]'
        },
        {
            title: '5. ตั้งค่าคำสั่งระบบ System Prompt (Context Guard)',
            desc: 'ในส่วนการตั้งค่า Copilot ตั้งค่าคำสั่งหลัก (System Prompt) บังคับให้ปัญญาประดิษฐ์สืบค้นและดึงคำตอบจากโน้ตความรู้ใน Vault ของเราเท่านั้น หากไม่พบข้อมูลระเบียบในนั้นให้ปฏิเสธทันที ห้าม AI คิดคำตอบเองป้องกันการมโน (Context Guard)',
            graphic: '🤖 System Prompt Configuration:\n"You are an assistant for CGD. You MUST only answer questions using the provided vault notes. If the answer is not in the notes, say that you don\'t know. Do NOT make up any answers."'
        },
        {
            title: '6. เปิดใช้งานระบบ & พัฒนาคลังความรู้ต่อเนื่อง',
            desc: 'เจ้าหน้าที่สามารถเริ่มใช้งานห้องแชทสืบค้นกฎหมายได้ทันที และเมื่อมีหนังสือเวียนหรือแนวปฏิบัติข้อหารือใหม่ๆ เข้ามา ก็นำมาพิมพ์เพิ่มและสร้างลิงก์ไว้ใน Obsidian คลังความรู้จะฉลาดและแม่นยำขึ้นเรื่อยๆ',
            graphic: '🚀 System Status: ONLINE\n📊 Vault Stats: 32 notes, 148 links connected.\n🤖 Model Ready: gemini-1.5-flash (Zero Hallucination)'
        }
    ];
    
    function updateStepper(stepIndex) {
        stepNodes.forEach((node, idx) => {
            if (idx < stepIndex) {
                node.className = 'step-node completed';
            } else if (idx === stepIndex) {
                node.className = 'step-node active';
            } else {
                node.className = 'step-node';
            }
        });
        
        // Progress line calculation
        const percent = (stepIndex / (stepNodes.length - 1)) * 100;
        stepperProgress.style.width = `${percent}%`;
        
        // Update detailed card
        const data = stepsData[stepIndex];
        stepInfo.style.opacity = 0;
        stepGraphic.style.opacity = 0;
        
        setTimeout(() => {
            stepInfo.innerHTML = `
                <h3>${data.title}</h3>
                <p>${data.desc}</p>
            `;
            stepGraphic.textContent = data.graphic;
            
            stepInfo.style.opacity = 1;
            stepGraphic.style.opacity = 1;
        }, 150);
    }
    
    stepNodes.forEach((node, idx) => {
        node.addEventListener('click', () => {
            updateStepper(idx);
        });
    });
    
    
    // --- Slide 6: Node Graph Simulation (HTML5 Canvas) ---
    let canvas, ctx;
    let nodes = [];
    let links = [];
    let animationFrameId = null;
    let isConnectedMode = false;
    let hoveredNode = null;
    let draggedNode = null;
    let offset = { x: 0, y: 0 };
    
    const btnDisconnect = document.getElementById('btnDisconnect');
    const btnConnect = document.getElementById('btnConnect');
    const graphTitle = document.getElementById('graphTitle');
    const graphDesc = document.getElementById('graphDesc');
    
    const graphModesData = {
        disconnected: {
            title: '<span style="color: var(--color-danger);"><i class="fa-solid fa-triangle-exclamation"></i></span> ข้อมูลกระจัดกระจาย (Drive/Folder)',
            desc: 'ความรู้ในรูปแบบไฟล์ PDF คู่มือ และกฎหมายกระจัดกระจายในไดรฟ์ส่วนตัวโดยไม่มีความเชื่อมโยงกัน ทำให้เจ้าหน้าที่เสียเวลาค้นหา หาความสัมพันธ์ระหว่างฉบับแก้ไขยาก และนำข้อมูลบำเหน็จบำนาญเก่ามาใช้อ้างอิงแบบไม่รู้ตัว'
        },
        connected: {
            title: '<span style="color: var(--color-success);"><i class="fa-solid fa-circle-nodes"></i></span> เชื่อมโยงสมอง (Knowledge Graph)',
            desc: 'แปลงความรู้ให้อยู่ในรูปโน้ต Obsidian เชื่อมโยงระหว่าง พ.ร.บ. กฎกระทรวง และหนังสือเวียนด้วย Internal Link AI สามารถจับโครงสร้างอ้างอิง ตอบได้แม่นยำ พร้อมดึงเส้นทางเอกสารตรวจสอบ (Audit Trail) ให้เห็นทันที'
        }
    };
    
    function initNetworkGraph() {
        canvas = document.getElementById('networkGraphCanvas');
        if (!canvas) return;
        
        ctx = canvas.getContext('2d');
        
        // Handle High-DPI screens
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        // Cancel existing animation loop
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        
        // Generate nodes
        const width = rect.width;
        const height = rect.height;
        
        nodes = [
            { id: 0, label: 'GovPension Brain', type: 'core', x: width / 2, y: height / 2, vx: 0, vy: 0, radius: 18, color: 'var(--color-primary)' },
            // Group 1: พ.ร.บ. 2494
            { id: 1, label: 'พ.ร.บ.บำเหน็จบำนาญ 2494', type: 'law', x: width * 0.25, y: height * 0.3, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, radius: 13, color: '#00f0ff' },
            { id: 2, label: 'มาตรา 9 (สูตรคำนวณ)', type: 'law', x: width * 0.15, y: height * 0.2, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, radius: 9, color: '#3b82f6' },
            { id: 3, label: 'มาตรา 10 (ข้าราชการวิสามัญ)', type: 'law', x: width * 0.22, y: height * 0.15, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, radius: 9, color: '#3b82f6' },
            { id: 4, label: 'ระเบียบการเบิกจ่ายบำนาญ', type: 'rule', x: width * 0.35, y: height * 0.2, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, radius: 10, color: 'var(--color-secondary)' },
            
            // Group 2: พ.ร.บ. กบข. 2539
            { id: 5, label: 'พ.ร.บ.กองทุน กบข. 2539', type: 'law', x: width * 0.75, y: height * 0.3, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, radius: 13, color: '#00f0ff' },
            { id: 6, label: 'สูตรคำนวณบำนาญ กบข.', type: 'rule', x: width * 0.85, y: height * 0.2, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, radius: 9, color: 'var(--color-secondary)' },
            { id: 7, label: 'เกณฑ์เพดาน 70%', type: 'rule', x: width * 0.72, y: height * 0.18, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, radius: 9, color: 'var(--color-secondary)' },
            { id: 8, label: 'เงินสะสม/เงินสมทบ', type: 'rule', x: width * 0.82, y: height * 0.35, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, radius: 9, color: 'var(--color-secondary)' },
            
            // Group 3: คู่มือและหนังสือเวียน
            { id: 9, label: 'หนังสือเวียน กรมบัญชีกลาง', type: 'doc', x: width * 0.3, y: height * 0.75, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, radius: 11, color: '#ffffff' },
            { id: 10, label: 'คู่มือแนวปฏิบัติบำนาญ', type: 'doc', x: width * 0.5, y: height * 0.8, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, radius: 10, color: '#ffffff' },
            { id: 11, label: 'แนวทางขอรับเงินบำนาญ', type: 'doc', x: width * 0.7, y: height * 0.75, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, radius: 10, color: '#ffffff' }
        ];
        
        // Define links relationships (source, target)
        links = [
            { source: 0, target: 1 },
            { source: 0, target: 5 },
            { source: 0, target: 9 },
            { source: 0, target: 10 },
            { source: 0, target: 11 },
            
            { source: 1, target: 2 },
            { source: 1, target: 3 },
            { source: 1, target: 4 },
            { source: 1, target: 5 }, // Law relationship
            
            { source: 5, target: 6 },
            { source: 5, target: 7 },
            { source: 5, target: 8 },
            
            { source: 9, target: 1 },
            { source: 9, target: 4 },
            { source: 10, target: 4 },
            { source: 11, target: 8 }
        ];
        
        // Add events for dragging & hover
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        
        // Start animation loop
        animateGraph(rect.width, rect.height);
    }
    
    function animateGraph(width, height) {
        ctx.clearRect(0, 0, width, height);
        
        // Update physics positions
        nodes.forEach(node => {
            if (node === draggedNode) return;
            
            if (isConnectedMode) {
                // Connected Mode: Spring physics attraction toward targets
                let targetX = width / 2;
                let targetY = height / 2;
                
                // Group cluster coordinates
                if (node.id !== 0) {
                    if (node.type === 'law') {
                        targetX = node.id < 5 ? width * 0.3 : width * 0.7;
                        targetY = height * 0.4;
                    } else if (node.type === 'rule') {
                        targetX = node.id < 5 ? width * 0.2 : width * 0.8;
                        targetY = height * 0.25;
                    } else if (node.type === 'doc') {
                        targetX = width * (0.2 + (node.id - 9) * 0.3);
                        targetY = height * 0.7;
                    }
                }
                
                // Apply spring pull force
                const dx = targetX - node.x;
                const dy = targetY - node.y;
                node.vx += dx * 0.03;
                node.vy += dy * 0.03;
                
                // Node repulsive forces to prevent overlap
                nodes.forEach(other => {
                    if (other === node) return;
                    const rDx = other.x - node.x;
                    const rDy = other.y - node.y;
                    const dist = Math.sqrt(rDx * rDx + rDy * rDy) || 1;
                    const minDist = node.radius + other.radius + 35;
                    
                    if (dist < minDist) {
                        const force = (minDist - dist) / dist * 0.2;
                        node.vx -= rDx * force;
                        node.vy -= rDy * force;
                    }
                });
                
                // Friction
                node.vx *= 0.7;
                node.vy *= 0.7;
            } else {
                // Disconnected Mode: Chaos floating (gas physics)
                // Boundary check bouncing
                if (node.x - node.radius < 0 || node.x + node.radius > width) {
                    node.vx *= -1;
                    node.x = node.x - node.radius < 0 ? node.radius : width - node.radius;
                }
                if (node.y - node.radius < 0 || node.y + node.radius > height) {
                    node.vy *= -1;
                    node.y = node.y - node.radius < 0 ? node.radius : height - node.radius;
                }
                
                // Add minor random drift to keep moving
                node.vx += (Math.random() - 0.5) * 0.05;
                node.vy += (Math.random() - 0.5) * 0.05;
                
                // Limit maximum speed
                const maxSpeed = 0.5;
                const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
                if (speed > maxSpeed) {
                    node.vx = (node.vx / speed) * maxSpeed;
                    node.vy = (node.vy / speed) * maxSpeed;
                }
            }
            
            // Apply velocities
            node.x += node.vx;
            node.y += node.vy;
        });
        
        // Draw Links first so they are behind nodes
        if (isConnectedMode) {
            links.forEach(link => {
                const src = nodes[link.source];
                const dst = nodes[link.target];
                
                let isHighlighted = false;
                if (hoveredNode) {
                    isHighlighted = (hoveredNode === src || hoveredNode === dst);
                }
                
                ctx.beginPath();
                ctx.moveTo(src.x, src.y);
                ctx.lineTo(dst.x, dst.y);
                
                if (hoveredNode) {
                    ctx.strokeStyle = isHighlighted ? 'rgba(0, 240, 255, 0.8)' : 'rgba(255, 255, 255, 0.02)';
                    ctx.lineWidth = isHighlighted ? 2.5 : 0.8;
                } else {
                    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
                    ctx.lineWidth = 1.2;
                }
                ctx.stroke();
            });
        }
        
        // Draw Nodes
        nodes.forEach(node => {
            const isHovered = (hoveredNode === node);
            let alpha = 1.0;
            
            if (hoveredNode && isConnectedMode) {
                // Highlight hovered node and connected neighbors, fade out rest
                const isConnected = links.some(l => 
                    (l.source === hoveredNode.id && l.target === node.id) ||
                    (l.target === hoveredNode.id && l.source === node.id)
                );
                const isMatch = (isHovered || isConnected || node.id === hoveredNode.id);
                alpha = isMatch ? 1.0 : 0.25;
            }
            
            // Draw glow effect for active/hovered nodes
            if (isHovered || node.id === 0) {
                ctx.shadowColor = node.color === 'var(--color-primary)' ? '#00f0ff' : '#9333ea';
                ctx.shadowBlur = isHovered ? 20 : 10;
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius + (isHovered ? 2 : 0), 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.globalAlpha = alpha;
            ctx.fill();
            ctx.globalAlpha = 1.0;
            
            // Reset shadow
            ctx.shadowBlur = 0;
            
            // Draw text labels
            ctx.fillStyle = '#ffffff';
            ctx.font = `${isHovered ? 'bold ' : ''}11px var(--font-body)`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.globalAlpha = alpha;
            ctx.fillText(node.label, node.x, node.y + node.radius + 6);
            ctx.globalAlpha = 1.0;
        });
        
        animationFrameId = requestAnimationFrame(() => animateGraph(width, height));
    }
    
    function handleMouseMove(e) {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        if (draggedNode) {
            draggedNode.x = mouseX - offset.x;
            draggedNode.y = mouseY - offset.y;
            return;
        }
        
        // Check for node hover
        let found = null;
        for (let i = nodes.length - 1; i >= 0; i--) {
            const n = nodes[i];
            const dx = n.x - mouseX;
            const dy = n.y - mouseY;
            if (Math.sqrt(dx*dx + dy*dy) < n.radius + 8) {
                found = n;
                break;
            }
        }
        
        if (hoveredNode !== found) {
            hoveredNode = found;
            canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
        }
    }
    
    function handleMouseDown(e) {
        if (hoveredNode) {
            draggedNode = hoveredNode;
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            offset.x = mouseX - draggedNode.x;
            offset.y = mouseY - draggedNode.y;
        }
    }
    
    function handleMouseUp() {
        draggedNode = null;
    }
    
    // Graph connection state toggling
    btnDisconnect.addEventListener('click', () => {
        isConnectedMode = false;
        btnDisconnect.className = 'graph-toggle-btn active';
        btnConnect.className = 'graph-toggle-btn';
        
        graphTitle.innerHTML = graphModesData.disconnected.title;
        graphDesc.textContent = graphModesData.disconnected.desc;
    });
    
    btnConnect.addEventListener('click', () => {
        isConnectedMode = true;
        btnConnect.className = 'graph-toggle-btn active';
        btnDisconnect.className = 'graph-toggle-btn';
        
        graphTitle.innerHTML = graphModesData.connected.title;
        graphDesc.textContent = graphModesData.connected.desc;
    });
    
    
    // --- Slide 7: Animated Stat Counters ---
    function animateNumbers() {
        const counters = document.querySelectorAll('.stat-val');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            let current = 0;
            
            // Custom count speeds depending on numbers
            const steps = 30;
            const increment = target / steps;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    // Special case strings
                    if (target === 0) {
                        counter.textContent = counter.parentElement.querySelector('.stat-label').textContent.includes('Error') ? '0%' : '0 บาท';
                    } else if (target === 50 && suffix === '') {
                        counter.textContent = '-' + Math.round(target) + '%';
               	       } else {
                    	counter.textContent = Math.round(target) + suffix;
                                        }
		} else {
			if (target === 50 && suffix === '') {
            		counter.textContent = '-' + Math.round(current) + '%';
        	        } else {
            		counter.textContent = Math.round(current) + suffix;
        	        }
                }
            }, 20);
        });
    }
    
    
    // --- Slide 8: Interactive Chat Simulator ---
    const caseCards = document.querySelectorAll('.case-card');
    const chatHistory = document.getElementById('chatHistory');
    const chatDummyInput = document.getElementById('chatDummyInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    
    const casesChatData = {
        '1': {
            question: 'นาย ก. ข้าราชการเกษียณ อายุราชการ 39 ปี เงินเดือนเฉลี่ย 60 เดือนสุดท้าย 40,000 บาท (สมาชิก กบข.) จะได้บำนาญเดือนละเท่าไหร่? อ้างอิงข้อใด?',
            steps: [
                { type: 'user', content: 'นาย ก. ข้าราชการเกษียณ อายุราชการ 39 ปี เงินเดือนเฉลี่ย 60 เดือนสุดท้าย 40,000 บาท (สมาชิก กบข.) จะได้บำนาญเดือนละเท่าไหร่? อ้างอิงข้อใด?' },
                { type: 'ai', content: 'จากการสืบค้นฐานข้อมูลกฎหมาย CGD Vault พบข้อมูลสรุปแนวปฏิบัติการคำนวณสิทธิประโยชน์ดังนี้ครับ:<br><br><b>1. การคำนวณเงินบำนาญเบื้องต้น (สมาชิก กบข.):</b><br>สูตร: (เงินเดือนเฉลี่ย 60 เดือนสุดท้าย × อายุราชการ) ÷ 50<br>แทนค่า: (40,000 บาท × 39 ปี) ÷ 50 = <b>31,200 บาท</b><br><br><b>2. การจำกัดสิทธิ์บำนาญสูงสุดตามเพดาน:</b><br>กฎหมายกำหนดให้บำนาญของสมาชิก กบข. จะต้องไม่เกิน 70% ของเงินเดือนเฉลี่ย 60 เดือนสุดท้าย<br>คำนวณเพดานสูงสุด: 40,000 บาท × 70% = <b>28,000 บาท</b><br><br><b>สรุปผลลัพธ์:</b> เนื่องจากยอดคำนวณเบื้องต้น (31,200 บาท) เกินยอดเพดาน (28,000 บาท) ดังนั้น <b>นาย ก. จะได้รับเงินบำนาญเดือนละ 28,000 บาท</b><br><br><span class="reference">⚖️ <b>กฎหมายอ้างอิง:</b><br>• พระราชบัญญัติบำเหน็จบำนาญข้าราชการ พ.ศ. 2494 มาตรา 9 และ 10<br>• พระราชบัญญัติกองทุนบำเหน็จบำนาญข้าราชการ พ.ศ. 2539</span>' }
            ]
        },
        '2': {
            question: 'ค่ารักษาพยาบาล จาก ศูนย์ศรีพัฒน์โรงพยาบาลมหาราชนครเชียงใหม่ สามารถใช้สิทธิเบิกทางราชการได้หรือไม่ หากได้ตามกฏหมายใด มาตราไหน ข้อไหน?',
            steps: [
                { type: 'user', content: 'ค่ารักษาพยาบาล จาก ศูนย์ศรีพัฒน์โรงพยาบาลมหาราชนครเชียงใหม่ สามารถใช้สิทธิเบิกทางราชการได้หรือไม่ หากได้ตามกฏหมายใด มาตราไหน ข้อไหน?' },
                { type: 'ai', content: '⚠️ <b>จากการตรวจสอบข้อมูลในฐานข้อมูล CGD Vault ของคุณ ไม่พบข้อมูลระเบียบที่ระบุถึง:</b><br>สิทธิการเบิกจ่ายค่ารักษาพยาบาลของ "ศูนย์ศรีพัฒน์ คณะแพทยศาสตร์ มหาวิทยาลัยเชียงใหม่" โดยเฉพาะเจาะจงครับ<br><br>เนื่องจากระบบถูกตั้งค่าความปลอดภัย <b>Context Guard (Zero Hallucination)</b> ผมจึงไม่สามารถคาดเดาหรือแต่งคำตอบเพื่อแจ้งข้อมูลอื่นได้ หากคุณมีบันทึก หนังสือเวียน หรือเอกสารประกาศกรมบัญชีกลางที่เกี่ยวข้อง รบกวนนำเอกสารโน้ต Markdown ดังกล่าวเพิ่มเข้าไปในระบบ แล้วให้ผมประมวลผลคำตอบใหม่อีกครั้งครับ' }
            ]
        }
    };
    
    function resetChat() {
        chatHistory.innerHTML = `
            <div class="chat-msg ai">
                สวัสดีครับ ผมคือ AI ของคุณ ยินดีช่วยเหลือตอบคำถามกฎหมายบำเหน็จบำนาญข้าราชการ โดยวิเคราะห์และอ้างอิงจากคลังความรู้ (Vault) ของคุณเท่านั้นครับ
            </div>
        `;
        chatDummyInput.textContent = 'เลือกกรณีศึกษาขวามือเพื่อพิมพ์คำถาม...';
        chatSendBtn.style.background = 'rgba(255,255,255,0.05)';
        chatSendBtn.style.color = 'var(--text-muted)';
        
        caseCards.forEach(c => c.classList.remove('active'));
    }
    
    caseCards.forEach(card => {
        card.addEventListener('click', () => {
            const caseId = card.getAttribute('data-case');
            
            // Set active card state
            caseCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            runChatSimulation(caseId);
        });
    });
    
    function runChatSimulation(caseId) {
        const data = casesChatData[caseId];
        if (!data) return;
        
        // Reset and start simulation
        chatHistory.innerHTML = `
            <div class="chat-msg ai">
                สวัสดีครับ ผมคือ AI ของคุณ ยินดีช่วยเหลือตอบคำถามกฎหมายบำเหน็จบำนาญข้าราชการ โดยวิเคราะห์และอ้างอิงจากคลังความรู้ (Vault) ของคุณเท่านั้นครับ
            </div>
        `;
        
        // 1. Simulate typing of question
        chatDummyInput.textContent = '';
        let charIndex = 0;
        const text = data.question;
        chatSendBtn.style.background = 'var(--color-primary)';
        chatSendBtn.style.color = 'black';
        
        const typingTimer = setInterval(() => {
            chatDummyInput.textContent += text.charAt(charIndex);
            charIndex++;
            if (charIndex >= text.length) {
                clearInterval(typingTimer);
                
                // 2. Append User message after typing done
                setTimeout(() => {
                    appendChatMessage('user', text);
                    chatDummyInput.textContent = 'พิมพ์ข้อความของคุณ...';
                    
                    // 3. Show AI typing indicator
                    setTimeout(() => {
                        const indicator = showTypingIndicator();
                        
                        // 4. Append AI response after delay
                        setTimeout(() => {
                            indicator.remove();
                            appendChatMessage('ai', data.steps[1].content);
                        }, 2200);
                        
                    }, 600);
                }, 400);
            }
        }, 15);
    }
    
    function appendChatMessage(sender, content) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${sender}`;
        msg.innerHTML = content;
        chatHistory.appendChild(msg);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
    
    function showTypingIndicator() {
        const msg = document.createElement('div');
        msg.className = 'chat-msg ai';
        msg.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatHistory.appendChild(msg);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        return msg;
    }
    
    
    // --- Slide 9: Sustainability & Roadmap Timeline ---
    const roadmapNodes = document.querySelectorAll('.roadmap-node');
    
    roadmapNodes.forEach(node => {
        node.addEventListener('click', () => {
            // Remove active class
            roadmapNodes.forEach(rn => rn.classList.remove('active'));
            
            // Set active clicked node
            node.classList.add('active');
        });
    });
    
    
    // --- Initialize default views on start ---
    showSlide(0, true);
    updateStepper(0);
});
