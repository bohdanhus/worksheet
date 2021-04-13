const fs = require("fs");
//парсим локальный файл и сохраняем результат в переменной = data;
const data = fs
  .readFileSync("acme_worksheet.csv")
  .toString()
  .split("\n")
  .map((e) => e.trim())
  .map((e) => e.split(",").map((e) => e.trim()));

// отделяем типы стобцов
const columns = data.shift();
// Определяем столбцы
const columnName = columns.findIndex((v) => /Name/i.test(v));
const columnDate = columns.findIndex((v) => /Date/i.test(v));
const columnWork = columns.findIndex((v) => /Work/i.test(v));
// Сортируем дату
const A = data
  .reduce((a, v) => {
    const date = new Date(v[columnDate]).valueOf();
    a.includes(date) || a.push(date);
    return a;
  }, [])
  .sort();

const employees = data.reduce((a, v) => {
  const name = v[columnName].trim().replace(/\s+/g, " ");
  const date = new Date(v[columnDate]).valueOf();
  const work = v[columnWork].trim();
  let nw = [...a.entries()].find(([re]) => re.test(name));
  // Если сотрудник не работал(а) в один из дней
  if (!nw) {
    nw = [null, { name, work: new Array(A.length).fill("0") }];
    a.set(new RegExp(name, "i"), nw[1]);
  }
  nw[1].work[A.indexOf(date)] = work;
  return a;
}, new Map());

// Сведённая таблица по всем сотрудникам
const result = [...employees.entries()].map(([_, { name, work }]) => [
  name,
  ...work,
]);
result.unshift([
  "Name/Date",
  ...A.map((d) => new Date(d).toISOString().slice(0, 10)),
]);
result.map((v) => console.log(v.join(", ")));