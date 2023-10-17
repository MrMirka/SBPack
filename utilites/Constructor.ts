import { getTextBlocks, getFrameBlocks, loadFonts } from "./ElementsFigma";

let clubs: any;
let unions: any;
let players: any;

function Initdata(clubs1: any, unions1: any, players1: any) {
  clubs = clubs1;
  unions = unions1;
  players = players1;
}

/**
 * Создание основного объекта
 * @param params характеристика создаваемого объекта, имя, позиция и пр.
 * @returns Сформированный объект BaseBlock
 */
function createBaseBlock(params: Partial<BaseBlock>): BaseBlock {
  return {
    ...params
  };
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

      frames.map((item) => {
        frameOne.appendChild(item)
      })
      texts.map((item) => {
        const textContent = textDataMap[item.name] ? data.find((text) => text.name === textDataMap[item.name])?.textContent : "";
        item.characters = textContent || "";
        frames.find((frame) => {
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

/**
* Заполнение данных шаблона данными URL картинок и текста
* @param bannerData исходные данные шаблона
* @returns финальный объект который попадет в функцию отрисовки
*/
function makeBannerObject(bannerData: any) {
  const formatedData = modifyData(bannerData)
  const blocksMapping: Record<'date' | 'title' | 'event' | 'owner' | 'quest' | 'logoCaptionLeft' | 'logoCaptionRight', () => BaseBlock | BaseBlock[]> = {
    title: () => createBaseBlock({ name: 'title', textContent: formatedData['title'] }),
    date: () => createBaseBlock({ name: 'date', textContent: formatedData['date'] }),
    event: () => createBaseBlock({ name: 'event', imageUrl: getEvent(formatedData['event']) }),
    owner: () => [
      createBaseBlock({ name: 'logoOwner', imageUrl: getGroup(formatedData['owner'].logoOwner) }),
      createBaseBlock({ name: 'playerOwner', imageUrl: getPlayer(formatedData['owner'].playerOwner, true, clubOrUnion(formatedData['owner'].logoOwner)) })
    ],
    quest: () => [
      createBaseBlock({ name: 'logoQuest', imageUrl: getGroup(formatedData['quest'].logoQuest) }),
      createBaseBlock({ name: 'playerQuest', imageUrl: getPlayer(formatedData['quest'].playerQuest, false, clubOrUnion(formatedData['quest'].logoQuest)) })
    ],
    logoCaptionLeft: () => createBaseBlock({ name: 'logoCaptionLeft', textContent: formatedData['logoCaptionLeft'] }),
    logoCaptionRight: () => createBaseBlock({ name: 'logoCaptionRight', textContent: formatedData['logoCaptionRight'] }),
  }


  const finalData: BaseBlock[] = [
    createBaseBlock({ name: 'background', imageUrl: "https://firebasestorage.googleapis.com/v0/b/sportbanners-1163a.appspot.com/o/images%2FtestBanner%2Fbackground.jpg?alt=media&token=6da34b57-e6c3-4cfc-8365-95a03848aa10" }),
  ];

  for (const key in formatedData) {
    const blockCreator = blocksMapping[key as 'date' | 'title' | 'event' | 'owner' | 'quest' | 'logoCaptionLeft' | 'logoCaptionRight'];
    if (blockCreator) {
      const newBlocks = blockCreator();
      finalData.push(...(Array.isArray(newBlocks) ? newBlocks : [newBlocks]));
    }
  }
  return finalData;
}


export { createBaseBlock, makeBanner, modifyData, makeBannerObject, Initdata }  
