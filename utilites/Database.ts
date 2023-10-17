//Получаем параметры для загрузки картинок из БД
function getBannerFromCSV(data: any) {
  const newData = data;

  let banners = [];
  const rows = newData.trim().split('\n');
  if (rows.length === 0) {
    console.log('File is empty');
    return;
  }

  let keys = rows[0].split(','); // Первая строка в CSV это названия столбцов
  keys = keys.map((key: any) => key.trim()); // Используем trim() для удаления лишних пробелов в названиях столбцов
  for (let i = 1; i < rows.length; i++) {
    let columns = rows[i].split(',');
    let item: any = {};
    for (let j = 0; j < keys.length; j++) {
      const name = keys[j];
      const value = columns[j].trim();
      item[name] = value;
    }
    banners.push(item);
  }
  return banners;
}


export { getBannerFromCSV }