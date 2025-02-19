export function showModal(message, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-title">알림</div>
            <div class="modal-content">${message}</div>
            <div class="modal-buttons">
                <button class="modal-cancel">취소</button>
                <button class="modal-confirm">확인</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    modal.querySelector('.modal-cancel').onclick = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    };

    modal.querySelector('.modal-confirm').onclick = () => {
        onConfirm();
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    };
}