let clubs: any;
let unions: any;
let players: any;

/**
 * UTILITES2 ----------------------------------------------------------------------------------- START
 */

/**
 * Создание основного объекта
 * @param params характеристика создаваемого объекта, имя, позиция и пр.
 * @returns Сформированный объект BaseBlock
 */
function createBaseBlock(params: Partial<BaseBlock>) : BaseBlock {
  return {
    ...params
  };
}

/**
 * Подготовливаем координатную сетку
 * @param count Всего объектов
 * @param step Расстояние между объектами
 * @param height Высота объекта
 * @returns 
 */
function createCoordinate(count: number, step: number, height: number) {
  return Array.from({ length: count }, (_, i) => (height + step) * i);
}

/**
 * Экспорт на диск всех Frame
 * @param pageName  имя страници
 */
async function exportFramesToPNG(pageName: string) {
  const page = figma.root.findChild(node => node.type === "PAGE" && node.name === pageName) as PageNode;

  if (page) {
    for (const node of page.children) {
      if (node.type === "FRAME") {
        console.log(node.name)
        const imageBytes = await node.exportAsync({ format: "PNG" });
        // Теперь можно сохранить imageBytes на локальный диск
        // Например, можно использовать библиотеку fs-extra для сохранения
        // Пример использования: fs.writeFileSync("путь_к_файлу.png", imageBytes);
      }
    }
  } else {
    console.error(`Page "${pageName}" not found.`);
  }
}
/**
 * UTILITES ----------------------------------------------------------------------------------- END
 */





//Возврящает массив всех шаблонов
function getTeamplatelist() {
  let teamplatelist: string[] = []
  const teamplates = "Teamplates"
  const page = figma.root.children.find(child => child.name === teamplates) as PageNode;
  if (page) {
    for (const item of page.children) {
      teamplatelist.push(item.name)
    }
  } else {
    console.log(`Page not found`);
  }
  return teamplatelist;

}

//Получаем координаты блоков из шаблона
function getImagePositionFromTeamplate(name: string) {
  const teamplateName = name;
  let parameters: BaseBlock[] = []

  //Получаю ссылку на страницу шаблонов
  const pageName = "Teamplates";
  const teamplatesPage = figma.root.children.find((child) => child.name === pageName) as PageNode;

  //Получаем ссылку на конкретный шаблон
  const base1Frame = teamplatesPage.children.find((child) => child.name === teamplateName) as FrameNode;

  const rectangles = base1Frame.findAll((node) => node.type === "RECTANGLE");

  for (const rectangle of rectangles) {
    const block: BaseBlock = {
      x: rectangle.x,
      y: rectangle.y,
      name: rectangle.name,
    };
    parameters.push(block)
  }
  return parameters;
}



/**
 * Изменяем текстовое значение поля
 * @param node текстовая нода в которой меняем текст
 * @param newText новое значение
 */
async function loadFonts(fontNames: any) {
  try {
    for (const name of fontNames) {
      await figma.loadFontAsync(name);
    }
  } catch (error) {
    console.error("Ошибка при загрузке шрифтов:", error);
  }
}

/**
 * Получаем текстовые блоки из шаблона
 * @param teamplateName имя шаблона
 */
function getTextBlocks(teamplateName: string) {
  let textBlocks: TextNode[] = [];
  const pageName = "Teamplates";
  const teamplatesPage = figma.root.children.find((child) => child.name === pageName) as PageNode;
  const focusTeamplate = teamplatesPage.children.find((child) => child.name === teamplateName) as FrameNode;
  const textes = focusTeamplate.findAll((node) => node.type === "TEXT");

  for (const item of textes) {
    const textNode = item as TextNode;
    textBlocks.push(textNode.clone());
  }
  return textBlocks;
}

function getFrameBlocks(teamplateName: string) {
  let frameBlocks: FrameNode[] = [];
  const pageName = "Teamplates";
  const teamplatesPage = figma.root.children.find((child) => child.name === pageName) as PageNode;
  const focusTeamplate = teamplatesPage.children.find((child) => child.name === teamplateName) as FrameNode;
  const frames = focusTeamplate.findAll((node) => node.type === "FRAME");

  for (const item of frames) {
    const textNode = item as FrameNode;
    frameBlocks.push(textNode.clone());
  }
  return frameBlocks;
}





//Забераем координаты элементов из шаблона
function setDataFromTeamplate(teamplateData: BaseBlock[], rawData: BaseBlock[]) {
  let parameters: BaseBlock[] = []
  for (const item of teamplateData) {
    const name = item.name;
    let block = rawData.find((block) => block.name === name);
    if (block) {
      item.imageUrl = block.imageUrl;
      parameters.push(item)
    }
  }
  //Добавляем текстовые блоки
  const text = rawData.find((item) => item.name === 'title') as BaseBlock; 
  const date = rawData.find((item) => item.name === 'date') as BaseBlock;
  const logoCaptionLeft = rawData.find((item) => item.name === 'logoCaptionLeft') as BaseBlock;
  const logoCaptionRight = rawData.find((item) => item.name === 'logoCaptionRight') as BaseBlock;
  if (text) {
    parameters.push(text)
  }
  if (date) {
    parameters.push(date)
  }
  if(logoCaptionLeft) {
    parameters.push(logoCaptionLeft)
  }
  if(logoCaptionRight) {
    parameters.push(logoCaptionRight)
  }

  return parameters;
}


async function makeBanner(data: BaseBlock[], positionY: number): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const dataNew = data.filter(item => item.name !== 'title'); // Массив только для элементов с URL

    const frameOne: FrameNode = figma.createFrame();
    frameOne.resize(1920, 1080);
    frameOne.x = 0;
    frameOne.y = positionY;
    frameOne.name = "TestBanner" + Date.now();

    try {
      const imagePromises = dataNew
        .filter(item => typeof item.imageUrl === 'string')
        .map(item => {
          const imageUrl = item.imageUrl as string;
          return figma.createImageAsync(imageUrl);
        });

      const images = await Promise.all(imagePromises);

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const item = dataNew[i];
        const node = figma.createRectangle();
        const { width, height } = await image.getSizeAsync();
        node.resize(width, height);
        node.x = item.x || 0;
        node.y = item.y || 0;
        node.name = item.name || "";
        node.fills = [
          {
            type: 'IMAGE',
            imageHash: image.hash,
            scaleMode: 'FILL',
          },
        ];

        frameOne.appendChild(node);
      }

      // Добавляем текст
      const textDataMap: { [name: string]: string } = {
        title: 'title',
        date: 'date',
        logoCaptionLeft: 'logoCaptionLeft',
        logoCaptionRight: 'logoCaptionRight'
      };
      const texts = getTextBlocks("Base1");
      const frames = getFrameBlocks("Base1");
      await loadFonts(texts.map((item) => item.fontName)); // Загружаем необходимые шрифты
      
      frames.map((item)=> {
        frameOne.appendChild(item)
      })
      texts.map((item) => {
        const textContent = textDataMap[item.name] ? data.find((text) => text.name === textDataMap[item.name])?.textContent : "";
        item.characters = textContent || "";
        frames.find((frame)=> {
          if (frame.name === item.name) {
            frame.appendChild(item)
            const frameWidth = frame.width;
            const frameHeight = frame.height;
            const itemWidth = item.width;
            const itemHeight = item.height;
            item.x = (frame.width - item.width) / 2;
            item.y = (frame.height - item.height) / 2;
          } else {
            frameOne.appendChild(item);
          }
        })
      }); 

     


      resolve(); // Разрешаем промис при успешном завершении
    } catch (error) {
      console.error(error);
      reject(error); // Отклоняем промис в случае ошибки
    }
  });
}



/**
 * 
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

function getSvg(callback: (data: any) => void) {
  const playersPromise = fetch('https://firestore.googleapis.com/v1/projects/sportbanners-1163a/databases/(default)/documents/svg')
    .then(response => response.json());


  // Выполняем все запросы параллельно
  Promise.all([playersPromise])
    .then(([image]) => {
      const data = {
        svg: image,

      };
      // Вызываем колбэк с объединенными данными
      callback(data);
    })
    .catch(error => {
      console.error(error);
    });
}



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


//Обрабатывает сырой объект их CSV
function modifyData(obj: any): any {
  const owner: any = {};
  const quest: any = {};
  const other: any = {};

  for (const key in obj) {
    const lowerCaseKey = key.toLowerCase();

    if (lowerCaseKey.includes('owner')) {
      owner[key] = obj[key];
    } else if (lowerCaseKey.includes('quest')) {
      quest[key] = obj[key];
    } else {
      other[key] = obj[key];
    }
  }

  return { owner, quest, ...other };
}

/**
 * Заполнение данных шаблона данными URL картинок и текста
 * @param bannerData исходные данные шаблона
 * @returns финальный объект который попадет в функцию отрисовки
 */
function makeBannerObject(bannerData: any) {
  const formatedData = modifyData(bannerData)
  const blocksMapping: Record<'date' | 'title' | 'event' | 'owner' | 'quest' | 'logoCaptionLeft' | 'logoCaptionRight', () => BaseBlock | BaseBlock[]> = {
    title: () => createBaseBlock({name:'title', textContent: formatedData['title']}),
    date: () => createBaseBlock({name:'date', textContent: formatedData['date']}),
    event: () => createBaseBlock({name: 'event', imageUrl: getEvent(formatedData['event'])}),
    owner: () => [
      createBaseBlock({name: 'logoOwner', imageUrl: getGroup(formatedData['owner'].logoOwner) }),
      createBaseBlock({name: 'playerOwner', imageUrl: getPlayer(formatedData['owner'].playerOwner, true, clubOrUnion(formatedData['owner'].logoOwner))})
    ],
    quest: () => [
      createBaseBlock({name: 'logoQuest', imageUrl: getGroup(formatedData['quest'].logoQuest) }),
      createBaseBlock({name: 'playerQuest', imageUrl: getPlayer(formatedData['quest'].playerQuest, false, clubOrUnion(formatedData['quest'].logoQuest))})
    ],
    logoCaptionLeft: () => createBaseBlock({name:'logoCaptionLeft', textContent: formatedData['logoCaptionLeft']}),
    logoCaptionRight: () => createBaseBlock({name:'logoCaptionRight', textContent: formatedData['logoCaptionRight']}),
  }
  
  
  const finalData: BaseBlock[] = [
    createBaseBlock({ name: 'background', imageUrl: "https://firebasestorage.googleapis.com/v0/b/sportbanners-1163a.appspot.com/o/images%2FtestBanner%2Fbackground.jpg?alt=media&token=6da34b57-e6c3-4cfc-8365-95a03848aa10" }),
  ];
  
  for (const key in formatedData) {
    const blockCreator = blocksMapping[key as 'date'| 'title' | 'event' | 'owner' | 'quest' | 'logoCaptionLeft' | 'logoCaptionRight'];
    if(blockCreator) {
        const newBlocks = blockCreator();
        finalData.push(...(Array.isArray(newBlocks) ? newBlocks : [newBlocks]));
    }
  }
  
  return finalData;
}

function initBanners(banners:any[], coordinate: number[]) {
  const bannerPromises = banners.map(async (item, index)=> {
    const finalData = makeBannerObject(item)
    let banner = setDataFromTeamplate(tParameters, finalData)
    await makeBanner(banner, coordinate[index])
  })

  Promise.all(bannerPromises).then(async()=> {
    //await exportFramesToPNG('Banners');
    figma.closePlugin();
  }).catch((error)=>{
    console.log(error);
    figma.closePlugin();
  })
}

//*********************************************************************************/
//БАЗА ДАННЫХ *********************************************************************/
//*********************************************************************************/


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

/**
 * Определяем сборная или клуб
 * @param name Имя по которомы определяем принадлежность к сборной или клубу
 */
function clubOrUnion(name: string) {
  const clubExists = clubs.some((item: any) => item.name === name);
  const unionExist = unions.some((item: any) => item.name === name);

  if (clubExists) {
    return 0;
  } else if (unionExist) {
    return 1;
  } else {
    return -1;
  }
}

/**
 * 
 * @param name значение ключа logoOwner | logoQuest
 * @returns url изображения
 */
function getGroup(name: String) {

  const club = clubs.find((club: any) => club.name === name);
  if (club) {
    return club.logoUrl
  }
  const union = unions.find((union: any) => union.name === name);
  if (union) {
    return union.logoUrl
  }

  return '';
}

/**
 * 
 * @param name значение ключа event
 * @returns url изображения
 */
function getEvent(name: String) {
  let url = "https://firebasestorage.googleapis.com/v0/b/sportbanners-1163a.appspot.com/o/images%2FtestBanner%2FlogoMiddle.png?alt=media&token=cfd80ed7-4443-4a9b-91a4-fcce204b03dc";
  //let url = "https://firebasestorage.googleapis.com/v0/b/sportbanners-1163a.appspot.com/o/images%2FtestBanner%2FGrayhound%20Gaming.svg?alt=media&token=424cf688-f65e-47e9-a9d3-a56e65fc8878";
  return url;
}

/**
 * 
 * @param name имя игрока
 * @param statusEvent хозяин или гость
 * @param statusGroup клуб или сборная
 */
function getPlayer(name: string, statusEvent: boolean, statusGroup: number) {
  let url = '';
  const player = players.find((player: any) => player.name === name);

  if (statusEvent) { //Owner
    if (statusGroup === 0) {
      url = player.clubOwnerURL
    } else {
      url = player.unionGuestURL
    }
  } else { //Quest
    if (statusGroup === 0) {
      url = player.clubGuestURL
    } else {
      url = player.unionGuestURL
    }
  }
  return url;
}



//START WORK

//Загружаем настройки шаблона с именем Base1
let tParameters = getImagePositionFromTeamplate("Base1")

figma.showUI(__html__)

figma.ui.onmessage = (msg) => {
  if (msg.type === 'importCSV') {
    const csvData = msg.data; //CSV данные
    const banners = getBannerFromCSV(csvData) //Данные для запроса в БД
    figma.ui.close();



    /*  getSvg((data) => {
       const svg = data.svg.documents[0].fields.path.stringValue;
       text(svg)
     })    */

    getData((data) => {
      //Сохранение в базу
      clubs = transformGroupData(data.clubs)
      unions = transformGroupData(data.unions)
      players = transformPlayersData(data.players)

      
      if (banners) {
        const coordanate = createCoordinate(banners.length, 50, 1080)
        initBanners(banners, coordanate)
      }
    })
  }
};




function text(svg: string) {

  const svgText = svg;
  const svgNode = figma.createNodeFromSvg(svgText);

  // Установка позиции и имени узла
  svgNode.x = 0;
  svgNode.y = 0;
  svgNode.name = "LOGO";

  svgNode.resize(200, (200 / svgNode.width) * svgNode.height);

  const frame = figma.currentPage.children[0] as FrameNode;
  frame.appendChild(svgNode);
}


async function getSvg3() {
  const response = await fetch("https://firestore.googleapis.com/v1/projects/sportbanners-1163a/databases/(default)/documents/svg");
  const json = await response.json();
}

