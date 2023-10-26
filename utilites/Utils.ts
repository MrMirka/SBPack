import { makeBanner, makeBannerObject } from "./Constructor";
import { getImagePositionFromTeamplate, setDataFromTeamplate } from "./ElementsFigma";
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

function initBanners(banners: any[], coordinate: number[]) {
  //Загружаем настройки шаблона с именем Base1
  let tParameters = getImagePositionFromTeamplate("Base1")
  const bannerPromises = banners.map(async (item, index) => {
    const finalData = makeBannerObject(item)
    let banner = setDataFromTeamplate(tParameters, finalData)
    await makeBanner(banner, coordinate[index])
  })

  Promise.all(bannerPromises).then(async () => {
    figma.closePlugin();
  }).catch((error) => {
    console.log(error);
    figma.closePlugin();
  })
}

function hexToRgba(hex: string): { r: number, g: number, b: number} {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return {
      r: r / 255,
      g: g / 255,
      b: b / 255,
  };
}

export { createCoordinate, initBanners, hexToRgba };