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
      name: rectangle.name
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

function getVectorBlocks(templateName: string): VectorNode[] {
  let vectorBlocks: VectorNode[] = [];
  const pageName = "Teamplates";  // Исправил опечатку 'Teamplates' на 'Templates'
  
  const templatesPage = figma.root.children.find((child) => child.name === pageName) as PageNode;
  const focusTemplate = templatesPage.children.find((child) => child.name === templateName) as FrameNode;
  
  const vectors = focusTemplate.findAll((node) => node.type === "VECTOR");

  for (const item of vectors) {
    const vectorNode = item as VectorNode;
    vectorBlocks.push(vectorNode.clone());
  }
  
  return vectorBlocks;
}

/**
* Получаем все блоки FRAME из конкретного шаблона
* @param teamplateName имя шаблона
* @returns 
*/
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
  const eventCaption = rawData.find((item) => item.name === 'eventCaption') as BaseBlock;

  const OwnerMainColor = rawData.find((item) => item.name === 'OwnerMainColor') as BaseBlock;
  const OwnerSecondColor = rawData.find((item) => item.name === 'OwnerSecondColor') as BaseBlock;
  const QuestMainColor = rawData.find((item) => item.name === 'QuestMainColor') as BaseBlock;
  const QuestSecondColor = rawData.find((item) => item.name === 'QuestSecondColor') as BaseBlock;
  if (text) {
    parameters.push(text)
  }
  if (date) {
    parameters.push(date)
  }
  if (logoCaptionLeft) {
    parameters.push(logoCaptionLeft)
  }
  if (logoCaptionRight) {
    parameters.push(logoCaptionRight)
  }

  if (eventCaption) {
    parameters.push(eventCaption)
  }

  if (OwnerMainColor) {
    parameters.push(OwnerMainColor)
  }
  if (OwnerSecondColor) {
    parameters.push(OwnerSecondColor)
  }
  if (QuestMainColor) {
    parameters.push(QuestMainColor)
  }
  if (QuestSecondColor) {
    parameters.push(QuestSecondColor)
  }

  return parameters;
}


export { getTeamplatelist, getImagePositionFromTeamplate, loadFonts, getTextBlocks, getFrameBlocks, setDataFromTeamplate, getVectorBlocks };

