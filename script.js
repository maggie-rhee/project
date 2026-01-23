document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const recordsList = document.getElementById('records-list');

    // Загрузка существующих записей при загрузке страницы
    loadRecords();

    // Обработчик отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем данные формы
        const formData = new FormData(form);
        const record = {};
        
        // Преобразуем FormData в объект
        const formKeys = [
            'name',
            'surname',
            'age',
            'native',
            'time',
            'date',
            'online-only',
        ];

        for (let formKey of formKeys) {
            record[formKey] = formData.get(formKey);
        }
        
        // Добавляем временную метку
        record.timestamp = new Date().toISOString();
        
        // Сохраняем запись
        saveRecord(record);
        
        // Очищаем форму
        form.reset();
        
        // Обновляем отображение записей
        loadRecords();
    });

    // Функция для сохранения записи в localStorage
    function saveRecord(record) {
        // Получаем существующие записи или создаем пустой массив
        // Говорим детям, что они смогут сделать аналогичный скрипт,
        // но вместо работы с localStorage будет взаимодействие с сервером!
        let records = JSON.parse(localStorage.getItem('languageCourseRecords')) || [];
        
        // Добавляем новую запись
        records.push(record);
        
        // Сохраняем обновленный массив записей
        localStorage.setItem('languageCourseRecords', JSON.stringify(records));
    }

    // Функция для загрузки и отображения записей
    function loadRecords() {
        // Получаем записи из localStorage
        const records = JSON.parse(localStorage.getItem('languageCourseRecords')) || [];
        
        // Очищаем список записей
        recordsList.innerHTML = '';
        
        // Если записей нет, показываем сообщение
        if (records.length === 0) {
            recordsList.innerHTML = '<p class="no-records">Нет предыдущих записей</p>';
            return;
        }
        
        // Отображаем записи в обратном порядке (новые сначала)
        records.reverse().forEach((record, index) => {
            const recordElement = createRecordElement(record, records.length - 1 - index);
            recordsList.appendChild(recordElement);
        });
    }

    // Функция для создания элемента записи
    function createRecordElement(record, index) {
        const recordItem = document.createElement('div');
        recordItem.className = 'record-item';
        
        const date = new Date(record.timestamp);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        // Переводим значение поля native в читаемый формат
        const nativeLanguages = {
            'en': 'Английский',
            'ru': 'Русский',
            'es': 'Испанский',
            'fr': 'Французский'
        };
        
        const nativeLang = nativeLanguages[record.native] || record.native;
        
        // Формируем HTML для элемента записи
        recordItem.innerHTML = `
            <h3>${record.name} ${record.surname}</h3>
            <p><strong>Возраст:</strong> ${record.age || 'Не указан'}</p>
            <p><strong>Родной язык:</strong> ${nativeLang}</p>
            <p><strong>Время занятия:</strong> ${record.time || 'Не указано'}</p>
            <p><strong>Дата занятия:</strong> ${record.date || 'Не указана'}</p>
            ${record['online-only'] ? `<p><strong>Формат:</strong> Только онлайн</p>` : ''}
            <p class="record-timestamp"><small>Зарегистрировано: ${formattedDate}</small></p>
            <button class="delete-btn" data-index="${index}">Удалить</button>
        `;
        
        // Добавляем обработчик для кнопки удаления
        recordItem.querySelector('.delete-btn').addEventListener('click', function() {
            deleteRecord(parseInt(this.getAttribute('data-index')));
        });
        
        return recordItem;
    }

    // Функция для удаления записи
    function deleteRecord(index) {
        // Получаем существующие записи
        let records = JSON.parse(localStorage.getItem('languageCourseRecords')) || [];
        
        // Удаляем запись с указанным индексом
        records.splice(index, 1);
        
        // Сохраняем обновленный массив записей
        localStorage.setItem('languageCourseRecords', JSON.stringify(records));
        
        // Обновляем отображение записей
        loadRecords();
    }
});
