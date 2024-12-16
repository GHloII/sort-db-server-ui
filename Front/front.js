


function addRow(array) {
    const table = document.querySelector('tbody'); // Получаем tbody таблицы
    const rowCount = table.rows.length + 1; // Считаем количество строк
    const rowId = `row-${rowCount}`;
    const arrayContent = array.join(' ');
    const newRow = `
        <tr id="${rowId}">
            <td>
                <div class="row">
                    <button class="row-button" onclick="convertToInput(this)">${arrayContent}</button>
                    <span class="menu-trigger">⋮</span>
                    <div class="menu">
                        <button onclick="deleteRow('${rowId}')">Удалить строку</button>
                    </div>
                </div>
            </td>
        </tr>
    `;
    table.insertAdjacentHTML('beforeend', newRow);
}


function updateDB() {
    const tableBody = document.getElementById('table-body'); 

    tableBody.innerHTML = '';

    fetch('/getArrays') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при получении данных');
            }
            return response.json(); 
        })
        .then(data => {
            data.forEach(item => {
                addRow(item.array); // Вызываем функцию addRow, передавая массив
            });
        })
        .catch(error => {
            console.error('Ошибка при обновлении таблицы:', error);
        });
}

function saveToDB(ID) {
    let array = getArrayFromTextarea(ID);
    if (array === false) {
        ShowProblem("Введите цыфры через пробел");
    }
    addRow(array);

    fetch("/saveToDB", {
        method: "POST", headers: {
            "Content-Type": "application/json",
        }, body: JSON.stringify(array)
    }).catch(error => {

    })
}

function deleteRow(rowId) {
    const row = document.getElementById(rowId);
    
    const arrayData = getArrayFromRow(rowId);

    fetch("/deleteRow", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ array: arrayData })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при удалении данных');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Строка успешно удалена из базы данных');
        } else {
            console.error('Ошибка на сервере:', data.error);
        }
    })
    .catch(error => {
        console.error('Ошибка при запросе:', error.message);
    });

    if (row) {
        row.remove();
    }

}

// Функция для получения массива данных строки по её id
function getArrayFromRow(rowId) {
    const row = document.getElementById(rowId);
    const button = row.querySelector('.row-button');
    return button ? button.textContent.split(' ') : [];
}






function isValidNum(number) {
    if (isNaN(number)) {
        console.log(`Ошибка: содержимое "${number}" не является числом. Попробуйте снова.`);
        return false;
    }
    if (number < 0) {
        console.log(`Ошибка: содержимое "${number}" не является положительным числом или нулем. Попробуйте снова.`);
        return false;
    }
    if (number - Math.floor(number) !== 0) {
        console.log(`Ошибка: содержимое "${number}" не является целочисленным числом или нулем. Попробуйте снова.`);
        return false;
    }
    return true;
}

function convertToInput(button) {

    const arrayContent = button.textContent.trim().split(' ');

 
    const inputField = document.getElementById("array-input");
    inputField.value = arrayContent.join(' '); 
}


function getArrayFromTextarea(ID) {
    let input = document.getElementById(ID).value;

    let numbers = input.split(' ').map(number => {
        number = Number(number);
        if (!isValidNum(number)) {
            return NaN;
        }
        return number;
    });
    if (numbers.includes(NaN)) {
        return false;
    }
    // Если все числа валидные, сохраняем результат
    array = numbers;
    return array;
}

let lineChartInstance; // Глобальная переменная для сохранения текущего графика

google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart(inputData) {
    // Пример входного массива

  
    // Преобразуем массив в формат для графика
    const chartData = formatData(inputData);
  
    // Преобразуем массив в таблицу данных для Google Charts
    const data = google.visualization.arrayToDataTable([
      ['Index', 'Size'], // Названия осей
      ...chartData // Данные
    ]);
  
    // Настройки графика
    const options = {
      title: 'Element Size vs. Index',
      hAxis: { title: 'Index' },
      vAxis: { title: 'Size' },
      legend: 'none',
      pointSize: 5 // Размер точек
    };
  
    // Рисуем график
    const chart = new google.visualization.LineChart(document.getElementById('myChart'));
    chart.draw(data, options);
  }
  
  // Функция для преобразования массива в нужный формат
  function formatData(array) {
    return array.map((value, index) => [index + 1, value]); // Индексы начинаются с 1, а не с 0
  }






function result(array) {
    let textarea = document.getElementById("sorted-array"); // Получаем элемент
    textarea.value = array.join(' '); // Устанавливаем значение текстового поля
    drawChart(array);
}

function sort() {
    let array = getArrayFromTextarea("array-input");
    if (array === false) {
        ShowProblem("Введите цыфры через пробел");
    }
    console.log(array);


    fetch("/", {
        method: "POST", headers: {
            "Content-Type": "application/json",
        }, body: JSON.stringify(array)
    }).then(res => {
        if (res.status === 200) {
            return res.json().then(data => {
                console.log("Полученные данные:", data);
                result(data);
                // Дальнейшая обработка данных
            });
        }
    }).catch(error => {
        // if (error.message === "email-already-exists") {
        //     ShowProblem("Аккаунт на такую почту уже зарегистрирован");
        // }
    })
}

document.addEventListener('click', (e) => {
    // Close all menus
    document.querySelectorAll('.menu').forEach(menu => menu.style.display = 'none');

    if (e.target.classList.contains('menu-trigger')) {
        const menu = e.target.nextElementSibling;
        menu.style.display = 'block';
    }
});

// Prevent menu from closing when clicking inside
document.addEventListener('click', (e) => {
    if (e.target.closest('.menu')) e.stopPropagation();
});

