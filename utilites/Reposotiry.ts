/**
 * Получаем из Firebase все записи
 * @param callback 
 * Возвращает комбинированные данные
 * players
 * clubs
 * unions
 */
function getData(callback: (data: any) => void) {
    const playersPromise = fetch('https://firestore.googleapis.com/v1/projects/sportbanners-1163a/databases/(default)/documents/players')
      .then(response => response.json());
  
    const clubsPromise = fetch('https://firestore.googleapis.com/v1/projects/sportbanners-1163a/databases/(default)/documents/clubs')
      .then(response => response.json());
  
    const unionsPromise = fetch('https://firestore.googleapis.com/v1/projects/sportbanners-1163a/databases/(default)/documents/unions')
      .then(response => response.json());
  
    // Выполняем все запросы параллельно
    Promise.all([playersPromise, clubsPromise, unionsPromise])
      .then(([playersData, clubsData, unionsData]) => {
        const data = {
          players: playersData,
          clubs: clubsData,
          unions: unionsData,
        };
        // Вызываем колбэк с объединенными данными
        callback(data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  //Оптимизируем JSON ответ от сервера содержащий клубы или сборные
function transformGroupData(data: any): any[] {
    if (!data || !data.documents || !Array.isArray(data.documents)) {
      return [];
    }
  
    return data.documents.map((item: any) => {
      return {
        id: item.fields?.id?.stringValue || "",
        name: item.fields?.name?.stringValue || "",
        logoUrl: item.fields?.logoURL?.stringValue || "",
      };
    });
  }
  
  //Оптимизируем JSON ответ от сервера содержащий клубы или сборные
  function transformPlayersData(data: any): any[] {
    if (!data || !data.documents || !Array.isArray(data.documents)) {
      return [];
    }
  
    return data.documents.map((item: any) => {
      return {
        id: item.fields?.id?.stringValue || "",
        name: item.fields?.name?.stringValue || "",
        logoUrl: item.fields?.logoURL?.stringValue || "",
        clubGuestURL: item.fields?.clubGuestURL?.stringValue || "",
        clubOwnerURL: item.fields?.clubOwnerURL?.stringValue || "",
        unionGuestURL: item.fields?.unionGuestURL?.stringValue || "",
        unionOwnerURL: item.fields?.unionOwnerURL?.stringValue || "",
      };
    });
  }

  export { getData, transformGroupData, transformPlayersData  };