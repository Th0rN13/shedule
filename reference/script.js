// Schedule data
const scheduleData = [
    { day: 'Понедельник', time: '9:00', value: '' },
    { day: 'Понедельник', time: '19:00', value: '' },
    { day: 'Вторник', time: '9:00', value: '' },
    { day: 'Вторник', time: '19:00', value: '' },
    { day: 'Среда', time: '9:00', value: '' },
    { day: 'Среда', time: '19:00', value: '' },
    { day: 'Четверг', time: '9:00', value: '' },
    { day: 'Четверг', time: '19:00', value: '' },
    { day: 'Пятница', time: '9:00', value: '' },
    { day: 'Пятница', time: '19:00', value: '' },
    { day: 'Суббота', time: '10:00', value: '' },
    { day: 'Суббота', time: '19:00', value: '' },
    { day: 'Воскресенье', time: '10:00', value: '' },
    { day: 'Воскресенье', time: '19:00', value: '' }
];

// State
let textColor = '#000000';
let textOffset = 80;
let showImage = true;
let showGrid = false;

// DOM Elements
const scheduleList = document.getElementById('scheduleList');
const textColorInput = document.getElementById('textColor');
const textOffsetInput = document.getElementById('textOffset');
const offsetValue = document.getElementById('offsetValue');
const toggleImageBtn = document.getElementById('toggleImage');
const toggleGridBtn = document.getElementById('toggleGrid');
const downloadLargeBtn = document.getElementById('downloadLarge');
const downloadSmallBtn = document.getElementById('downloadSmall');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');
const gridOverlay = document.getElementById('gridOverlay');
const showPreviewModalBtn = document.getElementById('showPreviewModal');
const previewModal = document.getElementById('previewModal');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');// Schedule data


// Initialize
function init() {
    renderScheduleList();
    setupEventListeners();
    loadBackgroundImage();
}

// Render schedule list
function renderScheduleList() {
    scheduleList.innerHTML = '';

    scheduleData.forEach((item, index) => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = `schedule-item ${item.value ? 'filled' : ''}`;

        scheduleItem.innerHTML = `
      <div class="schedule-label">${item.day}, ${item.time}</div>
      <input 
        type="text" 
        class="schedule-input" 
        value="${item.value}"
        data-index="${index}"
        placeholder="Введите текст..."
      />
      <div class="schedule-actions">
        <button class="icon-btn save" data-index="${index}" title="Сохранить">✅</button>
        <button class="icon-btn delete" data-index="${index}" title="Очистить">🗑️</button>
      </div>
    `;

        scheduleList.appendChild(scheduleItem);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Schedule inputs
    scheduleList.addEventListener('input', (e) => {
        if (e.target.classList.contains('schedule-input')) {
            const index = parseInt(e.target.dataset.index);
            scheduleData[index].value = e.target.value;
            updateScheduleItemState(e.target);
            drawCanvas();
        }
    });

    // Save buttons
    scheduleList.addEventListener('click', (e) => {
        if (e.target.classList.contains('save')) {
            const index = parseInt(e.target.dataset.index);
            const input = scheduleList.querySelector(`input[data-index="${index}"]`);
            scheduleData[index].value = input.value;
            updateScheduleItemState(input);
            drawCanvas();
            showNotification('Сохранено!');
        }
    });

    // Delete buttons
    scheduleList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const index = parseInt(e.target.dataset.index);
            const input = scheduleList.querySelector(`input[data-index="${index}"]`);
            scheduleData[index].value = '';
            input.value = '';
            updateScheduleItemState(input);
            drawCanvas();
            showNotification('Очищено!');
        }
    });



    const titleX = canvas.width / 2 + (textOffset - 50) * 10;
    ctx.fillText('*Расписание', titleX, 300);
}

// Draw schedule column
function drawScheduleColumn(x, startY, indices) {
    let y = startY;
    let currentDay = '';

    indices.forEach(index => {
        const item = scheduleData[index];

        if (item.day !== currentDay) {
            currentDay = item.day;
            ctx.font = 'bold 42px Arial';
            ctx.fillText(currentDay, x, y);
            y += 60;
        }

        if (item.value) {
            ctx.font = '36px Arial';
            ctx.fillText(`${item.time} - ${item.value}`, x, y);
            y += 50;
        }
    });
}

// Download image
function downloadImage(width, height) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');

    // Scale and draw
    tempCtx.scale(width / 1920, height / 1080);

    if (showImage && backgroundImage) {
        tempCtx.drawImage(backgroundImage, 0, 0, 1920, 1080);
    } else {
        tempCtx.fillStyle = '#f5f5dc';
        tempCtx.fillRect(0, 0, 1920, 1080);
    }

    // Draw schedule
    tempCtx.fillStyle = textColor;
    tempCtx.font = 'bold 48px Arial';
    tempCtx.textAlign = 'left';

    const leftX = 240;
    let leftY = 400;
    drawScheduleColumnOnCanvas(tempCtx, leftX, leftY, [0, 1, 2, 3, 4, 5]);

    const rightX = 880;
    let rightY = 400;
    drawScheduleColumnOnCanvas(tempCtx, rightX, rightY, [6, 7, 8, 9, 10, 11, 12, 13]);

    tempCtx.font = 'bold 72px Arial';
    tempCtx.textAlign = 'center';
    const titleX = 1920 / 2 + (textOffset - 50) * 10;
    tempCtx.fillText('*Расписание', titleX, 300);

    // Download
    tempCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `schedule_${width}x${height}.png`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification(`Скачано ${width}x${height}!`);
    });
}

// Draw schedule column on canvas
function drawScheduleColumnOnCanvas(ctx, x, startY, indices) {
    let y = startY;
    let currentDay = '';

    indices.forEach(index => {
        const item = scheduleData[index];

        if (item.day !== currentDay) {
            currentDay = item.day;
            ctx.font = 'bold 42px Arial';
            ctx.fillText(currentDay, x, y);
            y += 60;
        }

        if (item.value) {
            ctx.font = '36px Arial';
            ctx.fillText(`${item.time} - ${item.value}`, x, y);
            y += 50;
        }
    });
}

// Show notification
function showNotification(message) {
    // Simple notification - you can enhance this
    console.log(message);
}

// Open modal
function openModal() {
    // Convert canvas to image
    const dataUrl = canvas.toDataURL('image/png');
    modalImage.src = dataUrl;
    previewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    previewModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Initialize app
init();
