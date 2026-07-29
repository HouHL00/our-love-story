/* ========== 花瓣飘落效果 ========== */
const canvas = document.getElementById('petalCanvas');
const ctx = canvas.getContext('2d');

let petals = [];
const petalCount = 25;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Petal {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 5;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        // 粉色系花瓣颜色
        const colors = [
            '255, 107, 157',
            '255, 174, 199',
            '232, 69, 122',
            '255, 200, 220',
            '160, 108, 213'
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.swingRange = Math.random() * 30 + 10;
        this.swingSpeed = Math.random() * 0.02 + 0.01;
        this.swingOffset = Math.random() * Math.PI * 2;
    }

    update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * this.swingSpeed + this.swingOffset) * 0.8 + this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas.height + 20) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;

        // 画花瓣形状
        ctx.fillStyle = `rgb(${this.color})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// 初始化花瓣
for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
    // 初始散布
    petals[i].y = Math.random() * canvas.height;
}

function animatePetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(petal => {
        petal.update();
        petal.draw();
    });
    requestAnimationFrame(animatePetals);
}

animatePetals();

/* ========== 导航栏滚动效果 ========== */
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    // 导航栏背景
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 10, 30, 0.95)';
    } else {
        navbar.style.background = 'rgba(26, 10, 30, 0.8)';
    }

    // 高亮当前section对应的导航
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

/* ========== 移动端导航 ========== */
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

/* ========== 恋爱计时器 ========== */
let startDate = localStorage.getItem('loveStartDate');
if (startDate) {
    document.getElementById('startDate').value = startDate;
} else {
    // 默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
    startDate = today;
}

function saveDate() {
    const dateInput = document.getElementById('startDate').value;
    if (!dateInput) {
        alert('请选择恋爱开始日期 💕');
        return;
    }
    startDate = dateInput;
    localStorage.setItem('loveStartDate', startDate);
    updateCounter();
    updateMilestones();

    // 显示保存成功动画
    const btn = document.querySelector('.counter-save-btn');
    const originalText = btn.textContent;
    btn.textContent = '✓ 已保存';
    btn.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 2000);
}

function updateCounter() {
    if (!startDate) return;

    const start = new Date(startDate);
    const now = new Date();
    const diff = now - start;

    const totalSeconds = Math.floor(diff / 1000);
    const years = Math.floor(totalSeconds / (365.25 * 24 * 3600));
    const days = Math.floor((totalSeconds % (365.25 * 24 * 3600)) / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // 动画更新数字
    animateNumber('years', years);
    animateNumber('days', days);
    animateNumber('hours', hours);
    animateNumber('minutes', minutes);
    animateNumber('seconds', seconds);
}

function animateNumber(id, target) {
    const el = document.getElementById(id);
    const current = parseInt(el.textContent) || 0;
    if (current === target) return;

    const diff = target - current;
    const steps = 20;
    const stepValue = diff / steps;
    let step = 0;

    const timer = setInterval(() => {
        step++;
        const value = Math.round(current + stepValue * step);
        el.textContent = value;
        if (step >= steps) {
            el.textContent = target;
            clearInterval(timer);
        }
    }, 25);
}

// 每秒更新
setInterval(updateCounter, 1000);
updateCounter();

/* ========== 里程碑 ========== */
function updateMilestones() {
    if (!startDate) return;

    const start = new Date(startDate);
    const now = new Date();
    const totalDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));

    const milestones = document.querySelectorAll('.milestone-item');
    const targets = [100, 200, 365, 500, 1000];

    milestones.forEach((item, index) => {
        const target = targets[index];
        if (totalDays >= target) {
            item.classList.add('reached');
        } else {
            item.classList.remove('reached');
        }

        // 更新文字显示进度
        const textEl = item.querySelector('.milestone-text');
        if (totalDays < target) {
            textEl.textContent = `${target}天 (还差${target - totalDays}天)`;
        } else {
            textEl.textContent = `${target}天 ✓`;
        }
    });
}

updateMilestones();
setInterval(updateMilestones, 60000); // 每分钟检查一次

/* ========== 照片上传与展示 ========== */
const imageUpload = document.getElementById('imageUpload');
const galleryGrid = document.getElementById('galleryGrid');

// 从localStorage加载已保存的图片
let savedImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');

function renderGallery() {
    // 清除现有内容
    galleryGrid.innerHTML = '';

    if (savedImages.length === 0) {
        // 显示占位卡片
        const placeholders = [
            { icon: '📸', text: '上传第一张照片吧' },
            { icon: '🎬', text: '记录美好时刻' },
            { icon: '💕', text: '留下爱的痕迹' },
            { icon: '🌟', text: '分享甜蜜瞬间' },
            { icon: '🎀', text: '装点我们的回忆' },
            { icon: '🥰', text: '填满这个相册' }
        ];

        placeholders.forEach(p => {
            const div = document.createElement('div');
            div.className = 'gallery-item placeholder-item';
            div.innerHTML = `
                <div class="placeholder-content">
                    <span class="placeholder-icon">${p.icon}</span>
                    <span class="placeholder-text">${p.text}</span>
                </div>
            `;
            galleryGrid.appendChild(div);
        });
    } else {
        savedImages.forEach((imgData, index) => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.draggable = true;
            div.dataset.index = index;
            div.innerHTML = `
                <img src="${imgData}" alt="甜蜜回忆 ${index + 1}">
                <button class="delete-btn" onclick="deleteImage(${index}, event)">×</button>
            `;
            div.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-btn') && !isDragging) {
                    openModal(imgData);
                }
            });

            // 拖拽排序
            div.addEventListener('dragstart', (e) => {
                isDragging = true;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', index);
                div.style.opacity = '0.5';
            });

            div.addEventListener('dragend', (e) => {
                isDragging = false;
                div.style.opacity = '1';
                document.querySelectorAll('.gallery-item').forEach(item => {
                    item.classList.remove('drag-over');
                });
            });

            div.addEventListener('dragover', (e) => {
                e.preventDefault();
                div.classList.add('drag-over');
            });

            div.addEventListener('dragleave', (e) => {
                div.classList.remove('drag-over');
            });

            div.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                div.classList.remove('drag-over');
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = index;
                if (fromIndex !== toIndex) {
                    const item = savedImages.splice(fromIndex, 1)[0];
                    savedImages.splice(toIndex, 0, item);
                    localStorage.setItem('galleryImages', JSON.stringify(savedImages));
                    renderGallery();
                }
            });

            galleryGrid.appendChild(div);
        });
    }
}

let isDragging = false;

imageUpload.addEventListener('change', (e) => {
    const files = e.target.files;
    if (!files.length) return;
    processFiles(files);
});

// 拖拽上传
const gallerySection = document.getElementById('gallery');

gallerySection.addEventListener('dragover', (e) => {
    e.preventDefault();
    gallerySection.style.background = 'rgba(255, 107, 157, 0.05)';
});

gallerySection.addEventListener('dragleave', (e) => {
    e.preventDefault();
    gallerySection.style.background = '';
});

gallerySection.addEventListener('drop', (e) => {
    e.preventDefault();
    gallerySection.style.background = '';
    const files = e.dataTransfer.files;
    if (files.length) processFiles(files);
});

function processFiles(files) {
    // 过滤非图片文件
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!imageFiles.length) {
        alert('请上传图片文件哦 📷');
        return;
    }

    // 限制总数量
    const maxImages = 50;
    const remaining = maxImages - savedImages.length;
    if (remaining <= 0) {
        alert(`相册最多容纳${maxImages}张照片，请先删除一些再上传 💕`);
        return;
    }

    const filesToProcess = imageFiles.slice(0, remaining);
    let loadedCount = 0;

    filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            // 压缩图片再存储
            compressImage(event.target.result, 800, 0.7).then(compressed => {
                savedImages.push(compressed);
                loadedCount++;

                if (loadedCount === filesToProcess.length) {
                    try {
                        localStorage.setItem('galleryImages', JSON.stringify(savedImages));
                    } catch (e) {
                        // localStorage可能溢出，移除最早的图片
                        while (savedImages.length > 10) {
                            savedImages.shift();
                            try {
                                localStorage.setItem('galleryImages', JSON.stringify(savedImages));
                                break;
                            } catch (e2) {
                                continue;
                            }
                        }
                    }
                    renderGallery();
                    imageUpload.value = '';
                }
            });
        };
        reader.readAsDataURL(file);
    });
}

// 图片压缩
function compressImage(dataUrl, maxWidth, quality) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = dataUrl;
    });
}

function deleteImage(index, event) {
    event.stopPropagation();
    if (confirm('确定要删除这张照片吗？💔')) {
        savedImages.splice(index, 1);
        localStorage.setItem('galleryImages', JSON.stringify(savedImages));
        renderGallery();
    }
}

// 初始渲染
renderGallery();

/* ========== 图片预览模态框 ========== */
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');

function openModal(src) {
    modalImage.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

/* ========== 时光轴 - 添加回忆 ========== */
function addMemory() {
    const date = prompt('请输入这个特殊日子的日期（如：2024-01-15）：');
    if (!date) return;

    const title = prompt('给这个回忆起个标题吧：');
    if (!title) return;

    const desc = prompt('描述一下这个美好时刻：');
    if (!desc) return;

    const timelineContainer = document.getElementById('timelineContainer');

    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-date">${date}</div>
        <div class="timeline-content">
            <h3>${title}</h3>
            <p>${desc}</p>
        </div>
    `;

    timelineContainer.appendChild(item);

    // 入场动画
    requestAnimationFrame(() => {
        item.style.transition = 'all 0.5s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    });

    // 保存到localStorage
    let memories = JSON.parse(localStorage.getItem('memories') || '[]');
    memories.push({ date, title, desc });
    localStorage.setItem('memories', JSON.stringify(memories));
}

// 加载已保存的回忆
function loadMemories() {
    let memories = JSON.parse(localStorage.getItem('memories') || '[]');
    const timelineContainer = document.getElementById('timelineContainer');

    memories.forEach(m => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-date">${m.date}</div>
            <div class="timeline-content">
                <h3>${m.title}</h3>
                <p>${m.desc}</p>
            </div>
        `;
        timelineContainer.appendChild(item);
    });
}

loadMemories();

/* ========== 甜蜜留言板 ========== */
function addMessage() {
    const name = document.getElementById('messageName').value.trim();
    const text = document.getElementById('messageText').value.trim();
    const mood = document.getElementById('messageMood').value;

    if (!name || !text) {
        // 摇动输入框提示
        const form = document.querySelector('.message-form');
        form.style.animation = 'shake 0.5s ease';
        setTimeout(() => form.style.animation = '', 500);
        return;
    }

    const messageList = document.getElementById('messageList');
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const item = document.createElement('div');
    item.className = 'message-item';
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.innerHTML = `
        <div class="message-avatar">${mood}</div>
        <div class="message-body">
            <div class="message-header">
                <span class="message-author">${name}</span>
                <span class="message-mood">${mood}</span>
            </div>
            <p class="message-content">${text}</p>
            <span class="message-time">${timeStr}</span>
        </div>
    `;

    messageList.prepend(item);

    // 入场动画
    requestAnimationFrame(() => {
        item.style.transition = 'all 0.4s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    });

    // 清空输入框
    document.getElementById('messageName').value = '';
    document.getElementById('messageText').value = '';

    // 保存到localStorage
    let messages = JSON.parse(localStorage.getItem('loveMessages') || '[]');
    messages.unshift({ name, text, mood, time: timeStr });
    // 最多保存50条
    messages = messages.slice(0, 50);
    localStorage.setItem('loveMessages', JSON.stringify(messages));
}

// 加载已保存的留言
function loadMessages() {
    let messages = JSON.parse(localStorage.getItem('loveMessages') || '[]');
    const messageList = document.getElementById('messageList');

    messages.forEach(m => {
        const item = document.createElement('div');
        item.className = 'message-item';
        item.innerHTML = `
            <div class="message-avatar">${m.mood}</div>
            <div class="message-body">
                <div class="message-header">
                    <span class="message-author">${m.name}</span>
                    <span class="message-mood">${m.mood}</span>
                </div>
                <p class="message-content">${m.text}</p>
                <span class="message-time">${m.time}</span>
            </div>
        `;
        // 跳过第一条系统提示
        if (messageList.children.length > 0) {
            messageList.appendChild(item);
        }
    });
}

loadMessages();

// 回车发送
document.getElementById('messageText').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addMessage();
    }
});

/* ========== 抖动动画 ========== */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(styleSheet);

/* ========== 音乐控制（模拟） ========== */
let isPlaying = false;
const musicControl = document.getElementById('musicControl');
const musicIcon = document.getElementById('musicIcon');

function toggleMusic() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        musicControl.classList.add('playing');
        musicIcon.textContent = '🎶';
        // 尝试播放背景音乐（需要用户自备音频文件）
        // const audio = new Audio('background-music.mp3');
        // audio.loop = true;
        // audio.volume = 0.3;
        // audio.play().catch(() => {});
    } else {
        musicControl.classList.remove('playing');
        musicIcon.textContent = '🎵';
    }
}

/* ========== 滚动入场动画 ========== */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 观察所有section
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease';
    observer.observe(section);
});

// Hero不需要入场动画
document.querySelector('.hero').style.opacity = '1';
document.querySelector('.hero').style.transform = 'translateY(0)';

/* ========== 今日甜蜜 - 每日情话 ========== */
const loveQuotes = [
    { text: "我喜欢你，不是情话，是心里话。", author: "—— 佚名" },
    { text: "遇见你之后，我才知道，原来心是可以这样跳的。", author: "—— 佚名" },
    { text: "我想变得有趣，变得特别，变成你眼里的一点光。", author: "—— 佚名" },
    { text: "你是我所有的安全感，也是我不安的理由。", author: "—— 佚名" },
    { text: "世界上最幸福的事，就是和你一起慢慢变老。", author: "—— 佚名" },
    { text: "我想和你一起生活，在某个小镇，共享无尽的黄昏。", author: "—— 茨维塔耶娃" },
    { text: "你是我昼夜不舍的温柔妄想。", author: "—— 佚名" },
    { text: "所有的晦暗都留给过往，从遇见你开始，凛冬散尽，星河长明。", author: "—— 佚名" },
    { text: "我爱你，不是因为你是一个怎样的人，而是因为我喜欢与你在一起时的感觉。", author: "—— 佚名" },
    { text: "山野万里，你是我藏在微风中的欢喜。", author: "—— 佚名" },
    { text: "这世间青山灼灼，星光杳杳，秋雨淅淅，晚风慢慢，都不如你。", author: "—— 佚名" },
    { text: "我想牵着你的手，从心动到古稀。", author: "—— 佚名" },
    { text: "你是我纸短情长的雨季，也是我往后余生的晴空。", author: "—— 佚名" },
    { text: "无论这个世界怎么变，我的心跳永远为你而加速。", author: "—— 佚名" },
    { text: "和你在一起，不是因为寂寞，而是因为快乐。", author: "—— 佚名" },
    { text: "我不擅长告别，所以我只想说：谢谢你来到我身边。", author: "—— 佚名" },
    { text: "你是我平淡生活里唯一的光。", author: "—— 佚名" },
    { text: "如果思念有声音，恐怕你已经震耳欲聋。", author: "—— 佚名" },
    { text: "世界很大，幸福很小，希望你能早日回家。", author: "—— 佚名" },
    { text: "我喜欢你，从一而终，认真且怂。", author: "—— 佚名" },
    { text: "你是我藏在心里的，见不得光的，满心欢喜。", author: "—— 佚名" },
    { text: "此生三愿：家人平安，岁月静好，与你白首。", author: "—— 佚名" },
    { text: "我想做你的枕边书，意中人和心中爱。", author: "—— 佚名" },
    { text: "春风十里，不如你。", author: "—— 冯唐" },
    { text: "你是我的今天，以及所有的明天。", author: "—— 佚名" },
    { text: "陪伴是最长情的告白，等待是最沉默的陪伴。", author: "—— 佚名" },
    { text: "喜欢你，不是三分钟热度，是蓄谋已久后的深思熟虑。", author: "—— 佚名" },
    { text: "我这一生，只想做两件事：爱你，和等你。", author: "—— 佚名" },
    { text: "你是我唯一想要的终点。", author: "—— 佚名" },
    { text: "每一天都在想你，每一秒都在爱你。", author: "—— 佚名" }
];

function getDailyQuote() {
    const today = new Date();
    // 用日期作为种子，保证每天同一句
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    return loveQuotes[dayOfYear % loveQuotes.length];
}

function displayQuote(quote) {
    const quoteEl = document.getElementById('dailyQuote');
    const authorEl = document.getElementById('dailyAuthor');

    quoteEl.style.opacity = '0';
    quoteEl.style.transform = 'translateY(10px)';

    setTimeout(() => {
        quoteEl.textContent = quote.text;
        authorEl.textContent = quote.author;
        quoteEl.style.transition = 'all 0.5s ease';
        quoteEl.style.opacity = '1';
        quoteEl.style.transform = 'translateY(0)';
    }, 200);
}

function newQuote() {
    const randomQuote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
    displayQuote(randomQuote);
}

function copyQuote() {
    const text = document.getElementById('dailyQuote').textContent;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.querySelector('.copy-btn span:first-child');
            const originalText = btn.textContent;
            btn.textContent = '已复制!';
            setTimeout(() => btn.textContent = originalText, 2000);
        });
    }
}

// 初始化今日情话
displayQuote(getDailyQuote());

/* ========== 日历 ========== */
function renderCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    document.getElementById('calYear').textContent = year;
    document.getElementById('calMonth').textContent = month + 1;

    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    // 星期头部
    const dayHeaders = ['日', '一', '二', '三', '四', '五', '六'];
    dayHeaders.forEach(d => {
        const div = document.createElement('div');
        div.className = 'cal-day-header';
        div.textContent = d;
        grid.appendChild(div);
    });

    // 获取当月第一天是星期几
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 空位填充
    for (let i = 0; i < firstDay; i++) {
        const div = document.createElement('div');
        div.className = 'cal-day empty';
        grid.appendChild(div);
    }

    // 日期
    for (let d = 1; d <= daysInMonth; d++) {
        const div = document.createElement('div');
        div.className = 'cal-day';
        div.textContent = d;

        if (d === today) {
            div.classList.add('today');
        }

        // 标记特殊日期（如每月15号作为示例纪念日）
        const specialDates = [14, 15, 20]; // 可自定义纪念日
        if (specialDates.includes(d)) {
            div.classList.add('special');
            div.title = '纪念日';
        }

        grid.appendChild(div);
    }
}

renderCalendar();

/* ========== 爱情宣言 ========== */
function loadVows() {
    const hisVow = localStorage.getItem('hisVow') || '';
    const herVow = localStorage.getItem('herVow') || '';

    if (hisVow) document.getElementById('hisVow').textContent = hisVow;
    if (herVow) document.getElementById('herVow').textContent = herVow;
}

function saveVow(who) {
    const content = document.getElementById(who === 'his' ? 'hisVow' : 'herVow').textContent.trim();
    if (!content) {
        alert('请先写下你的承诺哦 💕');
        return;
    }

    localStorage.setItem(who === 'his' ? 'hisVow' : 'herVow', content);

    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ 已保存';
    btn.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 2000);
}

loadVows();

/* ========== 初始化提示 ========== */
window.addEventListener('load', () => {
    console.log('%c💕 欢迎来到你们的故事空间 💕', 'color: #ff6b9d; font-size: 20px; font-weight: bold;');
    console.log('%c提示：', 'color: #a06cd5; font-weight: bold;');
    console.log('1. 点击"上传我们的照片"按钮添加照片');
    console.log('2. 在恋爱计时器中设置你们的开始日期');
    console.log('3. 在时光轴中添加你们的回忆');
    console.log('4. 在爱情宣言中写下彼此的承诺');
    console.log('5. 在留言板写下想对TA说的话');
    console.log('6. 所有数据保存在浏览器本地，不会丢失');
});