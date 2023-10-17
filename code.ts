import { getData, transformGroupData, transformPlayersData } from "./utilites/Reposotiry";
import { getBannerFromCSV } from "./utilites/Database";
import { createCoordinate } from "./utilites/Utils";
import { Initdata } from "./utilites/Constructor";
import { initBanners } from "./utilites/Utils";

figma.showUI(__html__)

figma.ui.onmessage = (msg) => {
  if (msg.type === 'importCSV') {
    const csvData = msg.data; //CSV данные
    const banners = getBannerFromCSV(csvData) //Данные для запроса в БД
    figma.ui.close();
    getData((data) => {
      let clubs = transformGroupData(data.clubs)
      let unions = transformGroupData(data.unions)
      let players = transformPlayersData(data.players)
      if (clubs && players && unions) {
        Initdata(clubs, unions, players);
      }
      if (banners) {
        const coordanate = createCoordinate(banners.length, 50, 1080)
        initBanners(banners, coordanate)
      }
    })
  }
};