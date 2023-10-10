"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let clubs;
let unions;
let players;
/**
 * UTILITES2 ----------------------------------------------------------------------------------- START
 */
/**
 * Создание основного объекта
 * @param params характеристика создаваемого объекта, имя, позиция и пр.
 * @returns Сформированный объект BaseBlock
 */
function createBaseBlock(params) {
    return Object.assign({}, params);
}
/**
 * Подготовливаем координатную сетку
 * @param count Всего объектов
 * @param step Расстояние между объектами
 * @param height Высота объекта
 * @returns
 */
function createCoordinate(count, step, height) {
    return Array.from({ length: count }, (_, i) => (height + step) * i);
}
/**
 * Экспорт на диск всех Frame
 * @param pageName  имя страници
 */
function exportFramesToPNG(pageName) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = figma.root.findChild(node => node.type === "PAGE" && node.name === pageName);
        if (page) {
            for (const node of page.children) {
                if (node.type === "FRAME") {
                    console.log(node.name);
                    const imageBytes = yield node.exportAsync({ format: "PNG" });
                    // Теперь можно сохранить imageBytes на локальный диск
                    // Например, можно использовать библиотеку fs-extra для сохранения
                    // Пример использования: fs.writeFileSync("путь_к_файлу.png", imageBytes);
                }
            }
        }
        else {
            console.error(`Page "${pageName}" not found.`);
        }
    });
}
/**
 * UTILITES ----------------------------------------------------------------------------------- END
 */
//Возврящает массив всех шаблонов
function getTeamplatelist() {
    let teamplatelist = [];
    const teamplates = "Teamplates";
    const page = figma.root.children.find(child => child.name === teamplates);
    if (page) {
        for (const item of page.children) {
            teamplatelist.push(item.name);
        }
    }
    else {
        console.log(`Page not found`);
    }
    return teamplatelist;
}
//Получаем координаты блоков из шаблона
function getImagePositionFromTeamplate(name) {
    const teamplateName = name;
    let parameters = [];
    //Получаю ссылку на страницу шаблонов
    const pageName = "Teamplates";
    const teamplatesPage = figma.root.children.find((child) => child.name === pageName);
    //Получаем ссылку на конкретный шаблон
    const base1Frame = teamplatesPage.children.find((child) => child.name === teamplateName);
    const rectangles = base1Frame.findAll((node) => node.type === "RECTANGLE");
    for (const rectangle of rectangles) {
        const block = {
            x: rectangle.x,
            y: rectangle.y,
            name: rectangle.name,
        };
        parameters.push(block);
    }
    return parameters;
}
/**
 * Изменяем текстовое значение поля
 * @param node текстовая нода в которой меняем текст
 * @param newText новое значение
 */
function loadFonts(fontNames) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (const name of fontNames) {
                yield figma.loadFontAsync(name);
            }
        }
        catch (error) {
            console.error("Ошибка при загрузке шрифтов:", error);
        }
    });
}
/**
 * Получаем текстовые блоки из шаблона
 * @param teamplateName имя шаблона
 */
function getTextBlocks(teamplateName) {
    let textBlocks = [];
    const pageName = "Teamplates";
    const teamplatesPage = figma.root.children.find((child) => child.name === pageName);
    const focusTeamplate = teamplatesPage.children.find((child) => child.name === teamplateName);
    const textes = focusTeamplate.findAll((node) => node.type === "TEXT");
    for (const item of textes) {
        const textNode = item;
        textBlocks.push(textNode.clone());
    }
    return textBlocks;
}
function getFrameBlocks(teamplateName) {
    let frameBlocks = [];
    const pageName = "Teamplates";
    const teamplatesPage = figma.root.children.find((child) => child.name === pageName);
    const focusTeamplate = teamplatesPage.children.find((child) => child.name === teamplateName);
    const frames = focusTeamplate.findAll((node) => node.type === "FRAME");
    for (const item of frames) {
        const textNode = item;
        frameBlocks.push(textNode.clone());
    }
    return frameBlocks;
}
//Забераем координаты элементов из шаблона
function setDataFromTeamplate(teamplateData, rawData) {
    let parameters = [];
    for (const item of teamplateData) {
        const name = item.name;
        let block = rawData.find((block) => block.name === name);
        if (block) {
            item.imageUrl = block.imageUrl;
            parameters.push(item);
        }
    }
    //Добавляем текстовые блоки
    const text = rawData.find((item) => item.name === 'title');
    const date = rawData.find((item) => item.name === 'date');
    const logoCaptionLeft = rawData.find((item) => item.name === 'logoCaptionLeft');
    const logoCaptionRight = rawData.find((item) => item.name === 'logoCaptionRight');
    if (text) {
        parameters.push(text);
    }
    if (date) {
        parameters.push(date);
    }
    if (logoCaptionLeft) {
        parameters.push(logoCaptionLeft);
    }
    if (logoCaptionRight) {
        parameters.push(logoCaptionRight);
    }
    return parameters;
}
function makeBanner(data, positionY) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const dataNew = data.filter(item => item.name !== 'title'); // Массив только для элементов с URL
            const frameOne = figma.createFrame();
            frameOne.resize(1920, 1080);
            frameOne.x = 0;
            frameOne.y = positionY;
            frameOne.name = "TestBanner" + Date.now();
            try {
                const imagePromises = dataNew
                    .filter(item => typeof item.imageUrl === 'string')
                    .map(item => {
                    const imageUrl = item.imageUrl;
                    return figma.createImageAsync(imageUrl);
                });
                const images = yield Promise.all(imagePromises);
                for (let i = 0; i < images.length; i++) {
                    const image = images[i];
                    const item = dataNew[i];
                    const node = figma.createRectangle();
                    const { width, height } = yield image.getSizeAsync();
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
                const textDataMap = {
                    title: 'title',
                    date: 'date',
                    logoCaptionLeft: 'logoCaptionLeft',
                    logoCaptionRight: 'logoCaptionRight'
                };
                const texts = getTextBlocks("Base1");
                const frames = getFrameBlocks("Base1");
                yield loadFonts(texts.map((item) => item.fontName)); // Загружаем необходимые шрифты
                frames.map((item) => {
                    frameOne.appendChild(item);
                });
                texts.map((item) => {
                    var _a;
                    const textContent = textDataMap[item.name] ? (_a = data.find((text) => text.name === textDataMap[item.name])) === null || _a === void 0 ? void 0 : _a.textContent : "";
                    item.characters = textContent || "";
                    frames.find((frame) => {
                        if (frame.name === item.name) {
                            frame.appendChild(item);
                            const frameWidth = frame.width;
                            const frameHeight = frame.height;
                            const itemWidth = item.width;
                            const itemHeight = item.height;
                            item.x = (frame.width - item.width) / 2;
                            item.y = (frame.height - item.height) / 2;
                        }
                        else {
                            frameOne.appendChild(item);
                        }
                    });
                });
                resolve(); // Разрешаем промис при успешном завершении
            }
            catch (error) {
                console.error(error);
                reject(error); // Отклоняем промис в случае ошибки
            }
        }));
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
function getData(callback) {
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
function getSvg(callback) {
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
function getBannerFromCSV(data) {
    const newData = data;
    let banners = [];
    const rows = newData.trim().split('\n');
    if (rows.length === 0) {
        console.log('File is empty');
        return;
    }
    let keys = rows[0].split(','); // Первая строка в CSV это названия столбцов
    keys = keys.map((key) => key.trim()); // Используем trim() для удаления лишних пробелов в названиях столбцов
    for (let i = 1; i < rows.length; i++) {
        let columns = rows[i].split(',');
        let item = {};
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
function modifyData(obj) {
    const owner = {};
    const quest = {};
    const other = {};
    for (const key in obj) {
        const lowerCaseKey = key.toLowerCase();
        if (lowerCaseKey.includes('owner')) {
            owner[key] = obj[key];
        }
        else if (lowerCaseKey.includes('quest')) {
            quest[key] = obj[key];
        }
        else {
            other[key] = obj[key];
        }
    }
    return Object.assign({ owner, quest }, other);
}
/**
 * Заполнение данных шаблона данными URL картинок и текста
 * @param bannerData исходные данные шаблона
 * @returns финальный объект который попадет в функцию отрисовки
 */
function makeBannerObject(bannerData) {
    const formatedData = modifyData(bannerData);
    const blocksMapping = {
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
    };
    const finalData = [
        createBaseBlock({ name: 'background', imageUrl: "https://firebasestorage.googleapis.com/v0/b/sportbanners-1163a.appspot.com/o/images%2FtestBanner%2Fbackground.jpg?alt=media&token=6da34b57-e6c3-4cfc-8365-95a03848aa10" }),
    ];
    for (const key in formatedData) {
        const blockCreator = blocksMapping[key];
        if (blockCreator) {
            const newBlocks = blockCreator();
            finalData.push(...(Array.isArray(newBlocks) ? newBlocks : [newBlocks]));
        }
    }
    return finalData;
}
function initBanners(banners, coordinate) {
    const bannerPromises = banners.map((item, index) => __awaiter(this, void 0, void 0, function* () {
        const finalData = makeBannerObject(item);
        let banner = setDataFromTeamplate(tParameters, finalData);
        yield makeBanner(banner, coordinate[index]);
    }));
    Promise.all(bannerPromises).then(() => __awaiter(this, void 0, void 0, function* () {
        //await exportFramesToPNG('Banners');
        figma.closePlugin();
    })).catch((error) => {
        console.log(error);
        figma.closePlugin();
    });
}
//*********************************************************************************/
//БАЗА ДАННЫХ *********************************************************************/
//*********************************************************************************/
//Оптимизируем JSON ответ от сервера содержащий клубы или сборные
function transformGroupData(data) {
    if (!data || !data.documents || !Array.isArray(data.documents)) {
        return [];
    }
    return data.documents.map((item) => {
        var _a, _b, _c, _d, _e, _f;
        return {
            id: ((_b = (_a = item.fields) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.stringValue) || "",
            name: ((_d = (_c = item.fields) === null || _c === void 0 ? void 0 : _c.name) === null || _d === void 0 ? void 0 : _d.stringValue) || "",
            logoUrl: ((_f = (_e = item.fields) === null || _e === void 0 ? void 0 : _e.logoURL) === null || _f === void 0 ? void 0 : _f.stringValue) || "",
        };
    });
}
//Оптимизируем JSON ответ от сервера содержащий клубы или сборные
function transformPlayersData(data) {
    if (!data || !data.documents || !Array.isArray(data.documents)) {
        return [];
    }
    return data.documents.map((item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return {
            id: ((_b = (_a = item.fields) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.stringValue) || "",
            name: ((_d = (_c = item.fields) === null || _c === void 0 ? void 0 : _c.name) === null || _d === void 0 ? void 0 : _d.stringValue) || "",
            logoUrl: ((_f = (_e = item.fields) === null || _e === void 0 ? void 0 : _e.logoURL) === null || _f === void 0 ? void 0 : _f.stringValue) || "",
            clubGuestURL: ((_h = (_g = item.fields) === null || _g === void 0 ? void 0 : _g.clubGuestURL) === null || _h === void 0 ? void 0 : _h.stringValue) || "",
            clubOwnerURL: ((_k = (_j = item.fields) === null || _j === void 0 ? void 0 : _j.clubOwnerURL) === null || _k === void 0 ? void 0 : _k.stringValue) || "",
            unionGuestURL: ((_m = (_l = item.fields) === null || _l === void 0 ? void 0 : _l.unionGuestURL) === null || _m === void 0 ? void 0 : _m.stringValue) || "",
            unionOwnerURL: ((_p = (_o = item.fields) === null || _o === void 0 ? void 0 : _o.unionOwnerURL) === null || _p === void 0 ? void 0 : _p.stringValue) || "",
        };
    });
}
/**
 * Определяем сборная или клуб
 * @param name Имя по которомы определяем принадлежность к сборной или клубу
 */
function clubOrUnion(name) {
    const clubExists = clubs.some((item) => item.name === name);
    const unionExist = unions.some((item) => item.name === name);
    if (clubExists) {
        return 0;
    }
    else if (unionExist) {
        return 1;
    }
    else {
        return -1;
    }
}
/**
 *
 * @param name значение ключа logoOwner | logoQuest
 * @returns url изображения
 */
function getGroup(name) {
    const club = clubs.find((club) => club.name === name);
    if (club) {
        return club.logoUrl;
    }
    const union = unions.find((union) => union.name === name);
    if (union) {
        return union.logoUrl;
    }
    return '';
}
/**
 *
 * @param name значение ключа event
 * @returns url изображения
 */
function getEvent(name) {
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
function getPlayer(name, statusEvent, statusGroup) {
    let url = '';
    const player = players.find((player) => player.name === name);
    if (statusEvent) { //Owner
        if (statusGroup === 0) {
            url = player.clubOwnerURL;
        }
        else {
            url = player.unionGuestURL;
        }
    }
    else { //Quest
        if (statusGroup === 0) {
            url = player.clubGuestURL;
        }
        else {
            url = player.unionGuestURL;
        }
    }
    return url;
}
//START WORK
//Загружаем настройки шаблона с именем Base1
let tParameters = getImagePositionFromTeamplate("Base1");
figma.showUI(__html__);
figma.ui.onmessage = (msg) => {
    if (msg.type === 'importCSV') {
        const csvData = msg.data; //CSV данные
        const banners = getBannerFromCSV(csvData); //Данные для запроса в БД
        figma.ui.close();
        /*  getSvg((data) => {
           const svg = data.svg.documents[0].fields.path.stringValue;
           text(svg)
         })    */
        getData((data) => {
            //Сохранение в базу
            clubs = transformGroupData(data.clubs);
            unions = transformGroupData(data.unions);
            players = transformPlayersData(data.players);
            if (banners) {
                const coordanate = createCoordinate(banners.length, 50, 1080);
                initBanners(banners, coordanate);
            }
        });
    }
};
function text(svg) {
    const svgText = svg;
    const svgNode = figma.createNodeFromSvg(svgText);
    // Установка позиции и имени узла
    svgNode.x = 0;
    svgNode.y = 0;
    svgNode.name = "LOGO";
    svgNode.resize(200, (200 / svgNode.width) * svgNode.height);
    const frame = figma.currentPage.children[0];
    frame.appendChild(svgNode);
}
function getSvg3() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://firestore.googleapis.com/v1/projects/sportbanners-1163a/databases/(default)/documents/svg");
        const json = yield response.json();
    });
}
