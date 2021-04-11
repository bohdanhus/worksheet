const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const results = [];

fs.createReadStream('acme_worksheet.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
  // console.log(results);
   someFunction(results);  
  });

const  someFunction = (data) => {
const CSV = data;
// Полноценная таблица
const table = CSV.trim().split(/[\n\r]+/g).map((row) => row.trim().split(/,+/g))
// Отделяем типы столбцов
const columns = table.shift()
// Определяем столбцы
const columnName = columns.findIndex((v) => /Name/i.test(v))
const columnDate = columns.findIndex((v) => /Date/i.test(v))
const columnWork = columns.findIndex((v) => /Work/i.test(v))

// Сортируем дату
const A = table.reduce((a, v) => {
  const date = (new Date(v[columnDate])).valueOf()
  a.includes(date) || a.push(date)
  return a
}, []).sort()

const employees = table.reduce((a, v) => {
  const name = v[columnName].trim().replace(/\s+/g, ' ')
  const date = (new Date(v[columnDate])).valueOf()
  const work = v[columnWork].trim()
  let nw = [...a.entries()].find(([re]) => re.test(name))
  if (!nw) {
    // Здесь можно чем-то заполнить если не работали
    nw = [null, { name, work: (new Array(A.length)).fill('0') }]
    a.set(new RegExp(name, 'i'), nw[1])
  }
  nw[1].work[A.indexOf(date)] = work
  return a
}, new Map())

// Далее делаем что угодно
const result = [...employees.entries()].map(([_, { name, work }]) => [name, ...work])
// Наши заголовки с датой
result.unshift(['Employee', ...A.map((d) => (new Date(d).toDateString()))])

result.map((v)=>console.log(v.join(', ')))  
};
